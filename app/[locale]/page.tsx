import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import {useTranslations} from 'next-intl';
export default function Page() {
  const t = useTranslations("homePage");
  return (
    <div className="w-[100vw] lg:w-[50vw] md:w-[50vw] sm:w-[70vw] flex flex-col justify-center items-center gap-10 mt-50 mb-10 ">
      <p className=" lg:text-4xl md:text-3xl ">{t("title")}</p>
      <p className="text-2xl">{t("subtitle")}</p>
      <Button className="h-15 rounded-2xl px-6 text-2xl"><Link href="/game">{t("button")}</Link></Button>
        </div>
  );
}
