// components/caregiver/ChatBox.tsx
"use client";

import { useState } from "react";
import { Send } from "lucide-react";

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
    <div className="flex flex-col h-full border rounded-lg shadow-sm bg-white">
      {/* Message list */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "caregiver" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs rounded-lg p-2 text-sm ${msg.sender === "caregiver" ? "bg-teal-600 text-white" : "bg-gray-200 text-gray-900"}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-center border-t p-2 bg-gray-50">
        <input
          type="text"
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          className="ml-2 flex items-center justify-center rounded-md bg-teal-600 p-2 text-white hover:bg-teal-700"
          onClick={handleSend}
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
