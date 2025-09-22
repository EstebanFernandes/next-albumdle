import { Album } from "./albums";

export interface AlbumOfTheDay {
id:string;
date: string;
album: Album;
imageHint:string|null;
try:number;
guess:number;
}


export function createAlbumOfTheDay(data:{
    album_id: number | null;
    date: number | null;
    guess: number | null;
    id: number;
    try: number | null;
},albums:Album[] ) : AlbumOfTheDay
{
    return {
        id: data.id.toString(),
        date: data.date?.toString() ??"",
        album : albums[data.album_id??0],
        imageHint : null,
        try : data.try ?? -1,
        guess : data.guess ?? -1
    }
}