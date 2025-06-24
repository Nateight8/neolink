// import BottomNav from "@/components/navigation/bottom-nav";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function TestPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      {/* <BottomNav /> */}

      <div className="max-w-xl h-9 w-full flex items-center gap-3">
        <div className="border-y border-r w-2 h-full "></div>
        <Button variant="outline" size="icon">
          <MessageCircle />
        </Button>
        <div className="border-y border-l w-2 h-full "></div>
      </div>
    </div>
  );
}
