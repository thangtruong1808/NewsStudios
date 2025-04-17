import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function formatDateToLocal(date: string | Date) {
  if (!date) return "";

  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
