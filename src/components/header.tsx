import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";
import { ThemeToggle } from "../lib/theme";
export function Header() {
  return (
    <header 
    className="
    sticky top-0 w-full py-4 bg-background text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-800 z-100
    flex flex-row justify-center items-center gap-5 
    ">
      <Image src="/logo.png" alt="Albumdle Logo" 
      width={56} height={56}
      className="w-10 h-10 md:w-14 md:h-14 object-contain"/>
      <div className="text-2xl font-semibold">Albumdle</div>
      <CircleQuestionMark className="w-5 h-5 md:w-6 md:h-6" />
      <ThemeToggle />
    </header>
  );
}
