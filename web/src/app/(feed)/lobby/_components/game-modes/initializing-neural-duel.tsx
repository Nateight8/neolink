import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function InitializingNeuralDuel({
  duration = 1500,
}: {
  duration?: number;
}) {
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    let start: number | null = null;
    let frame: number;
    const animate = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percent = Math.min(100, (elapsed / duration) * 100);
      setProgress(percent);
      if (percent < 100) {
        frame = requestAnimationFrame(animate);
      }
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration]);

  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-transparent flex flex-col items-center justify-center relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md mx-auto px-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
          <div className="animate-pulse">
            <Zap className="h-14 w-14 sm:h-16 sm:w-16 md:h-20 md:w-20 text-cyan-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-fuchsia-400 bg-clip-text text-transparent">
            Initializing Neural Duel
          </h3>
          <p className="text-cyan-300/80 text-sm sm:text-base">
            Loading AI opponent and game environment...
          </p>
          <div className="w-full max-w-xs h-1.5 bg-cyan-900/50 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
