import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";
export function Header() {
  return (
    <header 
    className="
    sticky top-0 p-4 bg-white text-gray-800 border-b border-gray-300 z-100
    flex flex-row justify-center items-center gap-5 w-full
    ">
      <Image src="/logo.png" alt="Albumdle Logo" 
      width={56} height={56}
      className="w-10 h-10 md:w-14 md:h-14 object-contain"/>
      <div className="text-2xl font-semibold">Albumdle</div>
      <CircleQuestionMark className="w-5 h-5 md:w-6 md:h-6" />
    </header>
  );
}
