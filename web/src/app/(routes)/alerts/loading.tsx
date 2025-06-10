// This is a loading skeleton for the alerts page
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-8 w-1/3 bg-gray-800 rounded"></div>
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-800/50 rounded"></div>
        ))}
      </div>
    </div>
  );
}
