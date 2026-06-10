import ChatBox from "@/components/caregiver/ChatBox";

// Right-column wrapper for the caregiver chat widget.
// lg:sticky so the chat stays visible while the job list scrolls; non-sticky on mobile (renders inline).
// top-28 (112px) = 80px header + 32px clearance. Height fills remaining viewport on desktop.
export function ChatColumn() {
  return (
    <div className="lg:col-span-1">
      <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-140px)] min-h-[400px]">
        <ChatBox />
      </div>
    </div>
  );
}
