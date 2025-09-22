"use client"
import { AlbumDisplay } from "@/src/components/album-display";
import Calendar22 from "@/src/components/calendar-22";
//import { getAlbums } from "@/src/lib/csv";
//import { getMonthDate } from "@/src/lib/admin";
import { getTodayAlbum } from "@/src/lib/logic";
import { dateAsNumber, dateAsString, todayDateString } from "@/src/lib/utils";
import { Album } from "@/src/types/albums";
import { AlbumOfTheDay, createAlbumOfTheDay } from "@/src/types/game";
//import { retrieveAlbumById } from "@/src/utils/supabase";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getMonthDate, retrieveAlbumById } from "../lib/admin";

export default function AdminComponent({ albums }: { albums: Album[] }) {
    const [albumOfTheDay, setAlbumOfTheDay] = useState<AlbumOfTheDay | null>(null)
    const [album, setAlbum] = useState<Album | null>(null)
    const [monthDate, setMonthDate] = useState<{ id: number; date: number | null; }[]>([])
    const [currentdate, setCurrentDate] = useState<Date | undefined>(new Date())


    const t = useTranslations("adminPage")
    useEffect(() => {
        initFunction()
    }, [])

    async function initFunction() {

        const albumOfTheDay = await getTodayAlbum()
        setAlbumOfTheDay(albumOfTheDay)
        if (albumOfTheDay)
            setAlbum(albumOfTheDay?.album)
        const todaydate = todayDateString()
        const monthPicks = await getMonthDate(Number.parseInt(todaydate.substring(0, 6)))
        console.log(monthPicks)
        setMonthDate(monthPicks)
    }

    function displayAlbum() {
        if (album)
            return (
                <AlbumDisplay album={album}></AlbumDisplay>
            );
        return null
    }

    async function changeDate(date: Date | undefined) {
        if (date && albumOfTheDay) {

            const stringDate = dateAsString(date, false)
            const numberDate = dateAsNumber(date, false)

            console.log(date)
            console.log(numberDate)
            console.log(stringDate)

            if (isSameMonth(albumOfTheDay.date, stringDate))//Same month
            {
                const res = monthDate.find(pick => pick.date === numberDate)
                if (res === undefined) {
                    console.log("non non non non")
                    return;
                }
                console.log(`Id for ${stringDate} : ${res.id}`)
                const data = await retrieveAlbumById(res.id)
                setAlbumOfTheDay(createAlbumOfTheDay(data, albums))
                console.log(data.album_id)
                if (data.album_id) {
                    setAlbum(albums[data.album_id])
                    console.log(albums[data.album_id].title)
                }
                setCurrentDate(date)
            }
        }
    }

    function isSameMonth(date1: string, date2: string) {
        return date2.includes(date1.substring(0, 4))
    }

    return (
        <div className="mt-4 flex flex-col items-center" >
            <p className="text-2xl"> {t("title")} </p>
            <span className="text-xl"> {t("todayAlbum")} :</span>
            <Calendar22 value={currentdate} onChange={changeDate} label=""></Calendar22>
            <div className="flex flex-row">
                {displayAlbum()}
                <div className="flex flex-col items-start">
                    <span>{t("try")} : {albumOfTheDay?.try}</span>
                    <span>{t("guess")} : {albumOfTheDay?.guess}</span>
                </div>
            </div>
        </div>
    );
}
