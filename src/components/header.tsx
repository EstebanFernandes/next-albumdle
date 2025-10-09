import Image from "next/image";
import Link from "next/link";
import { SidebarTrigger } from "./ui/sidebar";
export function Header() {
  return (
    <header
      className="
    sticky top-0 w-full py-4 bg-background text-gray-800 dark:text-white border-b border-gray-300 dark:border-gray-800 
    flex flex-row justify-center items-center gap-5 z-40
    ">
      <SidebarTrigger className=" absolute left-0 ml-7" />
      <Link href="/" className="flex items-center gap-3">
        <Image src="/logo.png" alt="Albumdle Logo"
          width={56} height={56}
          className="w-10 h-10 md:w-14 md:h-14 object-contain" />
        <span className="text-2xl font-semibold">Albumdle</span>
      </Link>
      {/*<CircleQuestionMark className="w-5 h-5 md:w-6 md:h-6" />*/}
    </header>
  );
}
