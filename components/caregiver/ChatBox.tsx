// components/caregiver/ChatBox.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Phone } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import type { Message } from "@/types";

type ChatBoxProps = {
  jobId: string;
  onUnreadChange?: (count: number) => void;
};

type ChatRow = {
  id: string;
  job_id: string;
  sender: string;
  text: string;
  created_at: string;
  read_at: string | null;
};

export default function ChatBox({ jobId, onUnreadChange }: ChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setUnread(0);
    onUnreadChange?.(0);
  }, [jobId, onUnreadChange]);

  // โหลดข้อความเก่า และ mark ข้อความ patient ที่ยังไม่ได้อ่านเป็นอ่านแล้ว
  useEffect(() => {
    if (!jobId) return;
    supabase
      .from("chat_messages")
      .select("id, sender, text, created_at, read_at")
      .eq("job_id", jobId)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!data) return;
        setMessages(
          data.map((row) => ({
            id: new Date(row.created_at).getTime(),
            sender: row.sender as Message["sender"],
            text: row.text,
            readAt: row.read_at ? new Date(row.read_at).getTime() : undefined,
          }))
        );
        // caregiver เห็นแชทตลอด — mark ข้อความ patient ทั้งหมดที่ยังไม่ได้อ่าน
        supabase
          .from("chat_messages")
          .update({ read_at: new Date().toISOString() })
          .eq("job_id", jobId)
          .eq("sender", "patient")
          .is("read_at", null)
          .then();
      });
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    const channel = supabase
      .channel(`chat_${jobId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `job_id=eq.${jobId}` },
        (payload) => {
          const row = payload.new as ChatRow;
          setMessages((prev) => {
            const ts = new Date(row.created_at).getTime();
            if (prev.some((m) => m.id === ts)) return prev;
            const msg: Message = {
              id: ts,
              sender: row.sender as Message["sender"],
              text: row.text,
              readAt: row.read_at ? new Date(row.read_at).getTime() : undefined,
            };
            if (row.sender === "patient") {
              setUnread((u) => {
                const next = u + 1;
                onUnreadChange?.(next);
                return next;
              });
              // caregiver เห็นแชทตลอด — mark ข้อความใหม่จาก patient ทันที
              supabase
                .from("chat_messages")
                .update({ read_at: new Date().toISOString() })
                .eq("id", row.id)
                .then();
            }
            return [...prev, msg];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "chat_messages", filter: `job_id=eq.${jobId}` },
        (payload) => {
          const row = payload.new as ChatRow;
          if (!row.read_at) return;
          const ts = new Date(row.created_at).getTime();
          setMessages((prev) =>
            prev.map((m) => (m.id === ts ? { ...m, readAt: new Date(row.read_at!).getTime() } : m))
          );
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [jobId, onUnreadChange]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");
    const optimisticId = Date.now();
    setMessages((prev) => [...prev, { id: optimisticId, sender: "caregiver", text }]);
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ job_id: jobId, sender: "caregiver", text })
      .select()
      .single();
    if (error) {
      console.error("ChatBox send:", error.message);
      setMessages((prev) => prev.filter((m) => m.id !== optimisticId));
    } else if (data) {
      const realId = new Date((data as ChatRow).created_at).getTime();
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticId ? { ...m, id: realId } : m))
      );
    }
  };

  const lastCaregiverReadIdx = messages.reduce(
    (acc, m, i) => (m.sender === "caregiver" && m.readAt !== undefined ? i : acc),
    -1
  );

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border overflow-hidden">
      <div className="bg-surface-container-lowest border-b border-outline-variant/15 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center font-bold text-on-surface-variant shrink-0">
              ญ
            </div>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-on-error text-[10px] font-bold rounded-full flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-on-background leading-tight">แชทกับผู้ป่วย/ญาติ</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ออนไลน์
            </p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
          <Phone className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-surface-container-low/50">
        {messages.length === 0 && (
          <p className="text-center text-sm text-on-surface-variant/60 mt-8">
            ยังไม่มีข้อความ เริ่มแชทได้เลย
          </p>
        )}
        {messages.map((msg, idx) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "caregiver" ? "items-end" : "items-start"}`}>
            <div className={`flex ${msg.sender === "caregiver" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                msg.sender === "caregiver"
                  ? "bg-primary text-on-primary rounded-br-sm"
                  : "bg-surface-container-lowest border border-outline-variant/15 text-on-surface rounded-bl-sm"
              }`}>
                {msg.text}
              </div>
            </div>
            {msg.sender === "caregiver" && idx === lastCaregiverReadIdx && (
              <span className="text-[11px] text-on-surface-variant/60 mt-0.5 mr-1">อ่านแล้ว</span>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/15">
        <div className="flex items-center gap-2 bg-surface-container-low rounded-full p-1.5 border border-outline-variant/20 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none px-4 py-2 text-[15px] focus:outline-none focus:ring-0 text-on-surface placeholder-on-surface-variant/60"
            placeholder="พิมพ์ข้อความ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSend(); } }}
          />
          <button
            type="button"
            className="flex items-center justify-center rounded-full bg-primary w-10 h-10 text-on-primary hover:bg-primary-dim transition-colors shrink-0 shadow-sm"
            onClick={handleSend}
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
