import { useTranslations } from "next-intl";
import Link from "next/link";
export function Footer() {
    const t = useTranslations("footer")
  return (
    <footer 
    className=" flex items-center justify-center text-sm lg:text-[14px] static bottom-0 left-0 w-full">
        <span>
        {t("title")} &nbsp;
      <Link href="https://github.com/EstebanFernandes"  target="blank" className="text-blue-700 hover:text-blue-500" >
      Esteban Fernandes
      </Link></span>
    </footer>
  );
}
