import Conversations from "./_components/conversations";
import EmptyMessages from "./_components/empty-mgs";

export default function Page() {
  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Conversation list - shown on mobile only, user routes to [messageid] onclick */}
      <div className="md:hidden w-full h-full min-w-0">
        <Conversations />
      </div>

      {/* Empty state - shown on desktop only */}
      <div className="hidden md:flex w-full h-full items-center justify-center min-w-0">
        <EmptyMessages />
      </div>
    </div>
  );
}
