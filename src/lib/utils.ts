import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getRandomElements<T>(arr: T[], x: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random()); // shallow copy + shuffle
  return shuffled.slice(0, x);
}


export function isSameDayAsToday(dateToCheck:Date) {
  const today = new Date();

  return dateToCheck.getUTCFullYear() === today.getUTCFullYear() &&
         dateToCheck.getUTCMonth() === today.getUTCMonth() &&
         dateToCheck.getUTCDate() === today.getUTCDate();
}