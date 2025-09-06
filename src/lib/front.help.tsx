"use client"
export function memberCountToString(count: number): string {
  if (count === 1) {
    return "Solo";
  } else if (count === 2) {
    return "Duo";
  } else {
    return `${count} Members`;
  }
}
