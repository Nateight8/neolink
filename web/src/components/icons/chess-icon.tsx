import { LucideProps } from "lucide-react";

export function ChessIcon({ className, ...props }: LucideProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M8 16l-1.447.724A1 1 0 0 0 7 18.5V22h10v-3.5a1 1 0 0 0 .447-1.776L16 16" />
      <path d="M12 4v2" />
      <path d="M15.5 8h-7a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h3a3 3 0 0 0 3-3V9a1 1 0 0 0-1-1Z" />
      <path d="M12 2a2 2 0 0 0-2 2v2h4V4a2 2 0 0 0-2-2Z" />
    </svg>
  );
}
