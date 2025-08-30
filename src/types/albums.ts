import { createDefaultStat, Stat } from "./stat";

export interface Album {
  id: number;
  title: string;
  rank: number;
  type: string;
  memberCount: number;
  country:string;
  label:string;
  small_thumbnail: string;
  large_thumbnail: string;
  genres: string[];
  top_songs: string[];
  artist: string;
  releaseDate: number;
  color: Stat;
}


export function createStat(album: Album): Stat
{
   return {
                artist: album.artist,
                rank: album.rank.toString(),
                date: album.releaseDate.toString(),
                genres: album.genres.join(("/")),
                type: album.type,
                memberCount: album.memberCount.toString(),
                location: album.country,
                label: album.label
            };
}
