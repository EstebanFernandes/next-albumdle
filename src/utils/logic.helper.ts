import { getHintImage } from "../lib/image";
import { dateAsString } from "../lib/utils";
import { Album, todayData } from "../types/albums";
import { AlbumOfTheDay } from "../types/game";

//File used to store function to help the logic part
export function chooseAlbumRandomly(albums: Album[], date: Date): Album {
    const daySeed = date.getUTCFullYear() + '-' +
        String(date.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(date.getUTCDate()).padStart(2, '0');
    let hash = 0;
    for (let i = 0; i < daySeed.length; i++) {
        hash = (hash << 5) - hash + daySeed.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % albums.length;
    return albums[index];
}


export async function chooseAlbumOfTheDayRandomly(albums: Album[], date: Date): Promise<todayData> {
    const daySeed = date.getUTCFullYear() + '-' +
        String(date.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(date.getUTCDate()).padStart(2, '0');
    let hash = 0;
    for (let i = 0; i < daySeed.length; i++) {
        hash = (hash << 5) - hash + daySeed.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % albums.length;
    return {
        id: "",
        album: albums[index],
        date : dateAsString(date),
        imageHint : await getHintImage(albums[index].largeThumbnail,3),
        try:0,
        guess : 0
    }
}


