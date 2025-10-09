"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { routing } from "../i18n/routing"; // 👈 import your locales array
import { Globe } from "lucide-react";
import { capitalize } from "../lib/front.help";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const displayNames = new Intl.DisplayNames([locale], { type: "language" });

  const handleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPath = `/${newLocale}${pathname.replace(/^\/[a-z]{2}/, "")}`;
    router.push(newPath);
  };

  return (
    <span className="flex flex-row gap-2 items-center">
      <Globe className="size-4.5"></Globe>
    <Select defaultValue={locale} onValueChange={handleChange}>
      <SelectTrigger className="w-[110px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {capitalize(displayNames.of(loc))}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    </span>
  );
}