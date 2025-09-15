"use client"
import { AlbumDisplay } from "@/src/components/album-display";
import { getTodayAlbum } from "@/src/lib/logic";
import { Album } from "@/src/types/albums";
import { AlbumOfTheDay } from "@/src/types/game";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Page() {
  const [albumOfTheDay, setAlbumOfTheDay] = useState<AlbumOfTheDay | null>(null)
  const [album, setAlbum] = useState<Album | null>(null)
  useEffect(() => {
    initFunction()
  }, [])
  const t = useTranslations("adminPage")
  async function initFunction() {

    const albumOfTheDay = await getTodayAlbum()
    setAlbumOfTheDay(albumOfTheDay)
    if (albumOfTheDay)
      setAlbum(albumOfTheDay?.album)
  }

  function displayAlbum() {
    if (album)
      return (
        <AlbumDisplay album={album}></AlbumDisplay>
      );
    return null
  }

  return (
    <div className="mt-4 flex flex-col items-center" >
      <p className="text-2xl"> {t("title")} </p>
      <div className="flex flex-col items-start  mt-3">
        <span className="text-xl"> {t("todayAlbum")} :</span>
        <div className="flex flex-row">
          {displayAlbum()}
          <div className="flex flex-col items-start">
            <span>{t("try")} : {albumOfTheDay?.try}</span>
            <span>{t("guess")} : {albumOfTheDay?.guess}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
