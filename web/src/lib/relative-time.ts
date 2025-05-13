import {
  differenceInSeconds,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

export function getCompactRelativeTime(date: Date | string): string {
  const now = new Date();
  const inputDate = new Date(date);

  const seconds = differenceInSeconds(now, inputDate);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = differenceInMinutes(now, inputDate);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = differenceInHours(now, inputDate);
  if (hours < 24) return `${hours}h ago`;

  const days = differenceInDays(now, inputDate);
  return `${days}d ago`;
}
