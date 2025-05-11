interface NeuralIndicatorProps {
  strength: number;
}

export function NeuralIndicator({ strength }: NeuralIndicatorProps) {
  // Calculate the number of active bars based on strength (0-1)
  const totalBars = 5;
  const activeBars = Math.round(strength * totalBars);

  // Get color based on strength
  const getColor = () => {
    if (strength > 0.8) return "bg-green-500";
    if (strength > 0.5) return "bg-cyan-500";
    if (strength > 0.3) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center space-x-[2px]">
      {Array.from({ length: totalBars }).map((_, index) => (
        <div
          key={index}
          className={`h-3 w-1 rounded-sm ${
            index < activeBars ? getColor() : "bg-gray-700"
          } ${index < activeBars ? "animate-pulse" : ""}`}
          style={{
            animationDuration: `${0.5 + index * 0.1}s`,
            height: `${6 + index * 2}px`,
          }}
        ></div>
      ))}
    </div>
  );
}
