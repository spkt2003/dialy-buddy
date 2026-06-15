// components/caregiver/ChatBox.tsx
"use client";

import { useState } from "react";
import { Send, Phone } from "lucide-react";
import type { Message } from "@/types";

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "patient", text: "สวัสดีค่ะ พี่ดูแล ผมมีคำถามเกี่ยวกับการนัดหมาย" },
    { id: 2, sender: "caregiver", text: "สวัสดีค่ะ มีอะไรให้ช่วยบ้างคะ" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      sender: "caregiver",
      text: input.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest rounded-[2rem] shadow-ambient ghost-border overflow-hidden">
      {/* Header */}
      <div className="bg-surface-container-lowest border-b border-outline-variant/15 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center font-bold text-on-surface-variant shrink-0">
            ญ
          </div>
          <div>
            <h3 className="font-bold text-on-background leading-tight">แชทกับผู้ป่วย/ญาติ</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ออนไลน์
            </p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors">
          <Phone className="w-5 h-5" />
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-surface-container-low/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "caregiver" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                msg.sender === "caregiver"
                  ? "bg-primary text-on-primary rounded-br-sm"
                  : "bg-surface-container-lowest border border-outline-variant/15 text-on-surface rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/15">
        <div className="flex items-center gap-2 bg-surface-container-low rounded-full p-1.5 border border-outline-variant/20 focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none px-4 py-2 text-[15px] focus:outline-none focus:ring-0 text-on-surface placeholder-on-surface-variant/60"
            placeholder="พิมพ์ข้อความ..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSend();
              }
            }}
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
