import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getRandomElements<T>(arr: T[], x: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random()); // shallow copy + shuffle
  return shuffled.slice(0, x);
}


export function isSameDayAsToday(dateToCheck: string) {
  return todayDateString() === dateToCheck;
}




export function todayDateNumber(): number {
  const today = new Date();
  return Number.parseInt(todayDateString())
}

export function todayDateString(): string {
  const today = new Date();
  return today.getUTCFullYear().toString().concat((today.getUTCMonth()).toString().padStart(2, "0")).concat(today.getUTCDate().toString())
}


export function dateAsNumber(date: Date): number {
  return Number.parseInt(dateAsString(date))
}
export function dateAsString(date: Date): string {
  return date.getUTCFullYear().toString().concat((date.getUTCMonth()).toString().padStart(2, "0")).concat(date.getUTCDate().toString())
}
