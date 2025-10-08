import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import {useTranslations} from 'next-intl';
export default function Page() {
  const t = useTranslations("homePage");
  return (
    <div className="w-[90vw] lg:w-[50vw] md:w-[50vw] sm:w-[70vw] flex flex-col items-center gap-20  mt-20 sm:mt-30 md:mt-40 lg:mt-50 ">
      <p className="  text-xl sm:text-2xl md:text-3xl lg:text-4xl  ">{t("title")}</p>
      <p className="text-sm lg:text-2xl">{t("subtitle")}</p>
      <Button className="h-15 rounded-2xl px-6 text-sm lg:text-2xl"><Link href="/game">{t("button")}</Link></Button>
        </div>
  );
}
