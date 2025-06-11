import Conversations from "./_components/conversations";
import EmptyMessages from "./_components/empty-mgs";

export default function Page() {
  return (
    <div className="h-[calc(100vh-4rem)] flex"> {/* Subtract header height if you have one */}
      {/* conversation list - shown on mobile only user routes to [messageid] onclick */}
      <div className="md:hidden w-full h-full">
        <Conversations />
      </div>
      <div className="hidden md:flex w-full h-full items-center justify-center">
        <EmptyMessages />
      </div>
    </div>
  );
}
