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
export function  capitalize(value:string|undefined)
{
  if(value)
  return value.at(0)?.toLocaleUpperCase().concat(value.substring(1))
return undefined;
}