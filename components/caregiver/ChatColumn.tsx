import ChatBox from "@/components/caregiver/ChatBox";

type ChatColumnProps = {
  jobId: string;
};

// Right-column wrapper for the caregiver chat widget.
// lg:sticky so the chat stays visible while the job list scrolls.
// top-28 (112px) = 80px header + 32px clearance.
export function ChatColumn({ jobId }: ChatColumnProps) {
  return (
    <div className="lg:col-span-1">
      <div className="lg:sticky lg:top-28 lg:h-[calc(100vh-140px)] min-h-[400px]">
        <ChatBox jobId={jobId} />
      </div>
    </div>
  );
}
