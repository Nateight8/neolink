import { Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function Posts() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
        <div
          key={item}
          className="relative aspect-square overflow-hidden group"
        >
          {/* Neon border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-75 -z-10"></div>

          {/* <Image
            src=""
            alt={`Post ${item}`}
            className="object-cover w-full h-full"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
            <div className="flex items-center">
              <Heart className="h-5 w-5 mr-1 text-fuchsia-400" />
              <span className="text-fuchsia-300 font-mono">42</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-1 text-cyan-400" />
              <span className="text-cyan-300 font-mono">12</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
