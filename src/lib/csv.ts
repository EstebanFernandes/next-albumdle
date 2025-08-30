import fs from "fs";
import path from "path";
import Papa from 'papaparse';
import { Album } from "../types/albums";
import { getRandomElements } from "./utils";
import { createDefaultStat } from "../types/stat";

// Global cache to avoid reparsing the CSV each time
let cachedAlbums: Album[]  = [];
let hasBeenCalled = false;
export function getAlbums(numberOfAlbums?: number): Album[] {
  if (!hasBeenCalled) {
    hasBeenCalled = true;
    const csvPath = path.join(process.cwd(), "data", "albums.csv");
    const csvFile = fs.readFileSync(csvPath, "utf8");
    const result = Papa.parse(csvFile, { header: true }).data;
    let i = 0;
     // Cast to Album[]
    cachedAlbums = result.map((row: any) => ({
      id: i++,          // convert string -> number
      title: row.album,
      rank: parseInt(row.rank_2020),
      type : row.type,
      memberCount: parseInt(row.artist_member_count),
      country: row.country,
      label: row.label_name,
      small_thumbnail: row.small_thumbnails,
      large_thumbnail: row.large_thumbnails,
      genres: row.genres ? row.genres.split(";") : [],
      top_songs: row.top_songs ? row.top_songs.split(";") : [],
      artist: row.clean_name || undefined,
      releaseDate: row.release_year || undefined,
      color : createDefaultStat()
    })) as Album[];
  console.log(`Cached ${cachedAlbums.length} albums `);
  }

  if (numberOfAlbums) {
    return getRandomElements(cachedAlbums, numberOfAlbums);
  }

  return cachedAlbums;

}



