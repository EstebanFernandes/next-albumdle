import { createDefaultStat, Stat } from "./stat";

export interface Album {
  id: number;
  title: string;
  rank: number;
  type: string;
  memberCount: number;
  country: string;
  label: string;
  small_thumbnail: string;
  large_thumbnail: string;
  genres: string[];
  top_songs: string[];
  artist: string;
  releaseDate: number;
  color: Stat;
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
  small_thumbnail: "",
  large_thumbnail: "",
  genres: [],
  top_songs: [],
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
