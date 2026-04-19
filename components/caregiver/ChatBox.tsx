// components/caregiver/ChatBox.tsx
"use client";

import { useState } from "react";
import { Send, Phone } from "lucide-react";

interface Message {
  id: number;
  sender: "caregiver" | "patient";
  text: string;
}

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
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 shrink-0">
            ญ
          </div>
          <div>
            <h3 className="font-bold text-slate-900 leading-tight">แชทกับผู้ป่วย/ญาติ</h3>
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ออนไลน์
            </p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
          <Phone className="w-5 h-5" />
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "caregiver" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                msg.sender === "caregiver"
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-white border border-slate-100 text-slate-700 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 rounded-full p-1.5 border border-slate-200 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent border-none px-4 py-2 text-[15px] focus:outline-none focus:ring-0 text-slate-800 placeholder-slate-400"
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
            className="flex items-center justify-center rounded-full bg-blue-600 w-10 h-10 text-white hover:bg-blue-700 transition-colors shrink-0 shadow-sm"
            onClick={handleSend}
          >
            <Send className="h-4 w-4 ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
