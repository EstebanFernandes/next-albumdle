import { AlbumOfTheDay } from "./game";
import { createDefaultStat, Stat } from "./stat";

export interface Album {
  id: number;
  title: string;
  rank: number;
  type: string;
  memberCount: number;
  country: string;
  label: string;
  smallThumbnail: string;
  largeThumbnail: string;
  genres: string[];
  topSongs: string[];
  artist: string;
  releaseDate: number;
  color: Stat;
}

/**
 * This interface can describe a gamemode, the album type is define from the header of this gamemode
 */
export interface GameMode {
  id: number;
  title: string;
  description: string;
  url: string;
  propertiesString: string[];     // the schema
  data: Album[];  // rows with that schema
}

export interface GameDayData {
  mode: GameMode;     // the schema
  today: todayData | null
}

export interface todayData {
id:string;
date: string;
album: Album;
imageHint:string|null;
try:number;
guess:number;
}


export interface BackgroundAlbum {
  id: number;
  title: string;
  thumbnail: string;
  scale: number;
}

export function nullAlbum() : Album
{
  
return {
  id: -1,
  title: "",
  rank: -1,
  type: "",
  memberCount: -1,
  country: "",
  label:  "",
  smallThumbnail: "",
  largeThumbnail: "",
  genres: [],
  topSongs: [],
  artist: "",
  releaseDate: -1,
  color: createDefaultStat()
}
}



export function createStat(album: Album): Stat {
  return {
    artist: album.artist,
    rank: album.rank.toString(),
    date: album.releaseDate.toString(),
    genres: album.genres,
    type: album.type,
    memberCount: album.memberCount.toString(),
    location: album.country,
    label: album.label
  };
}
