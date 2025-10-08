import fs from "fs";
import Papa from 'papaparse';
import path from "path";
import { Album } from "../types/albums";
import { createDefaultStat } from "../types/stat";




export function getAlbumsRawData(csvData: string, header: string) {
  const keys = header.split(","); // <-- string[], pas const

  type Row = Record<string, string>; // générique, pas précis

  // Papa Parse
  const parsed = Papa.parse<string[]>(csvData, {
    header: false,
    skipEmptyLines: true,
  });

  const csvHeader = (parsed.data[0] as string[]) || [];
  const csvHeaderIndex: Record<string, number> = {};
  csvHeader.forEach((col, i) => (csvHeaderIndex[col] = i));

  const rows: Row[] = (parsed.data.slice(1) as string[][]).map((line) => {
    const obj: Row = {};
    keys.forEach((key) => {
      const idx = csvHeaderIndex[key];
      obj[key] = idx !== undefined ? line[idx] ?? "" : "";
    });
    return obj;
  });

  return rows;
}

export function getAlbumsDataDynamic(csvData: string): Album[] {
  const raw = Papa.parse<Record<string, string>>(csvData, {
    header: true,
    skipEmptyLines: true,
  }).data;

  let i = 0;

  return raw.map((row) => {
    const album: Partial<Album> = { id: i++, color: createDefaultStat() };

    // Pour chaque clé de Album
    (Object.keys(row) as (keyof Album)[]).forEach((key) => {
      if (key in album || (key === "id")) return; // id déjà défini
      
      if ( key === "color") return; // Color déjà défini
      const value = row[key];
      if (value == null) return;

      switch (key) {
        case "rank":
        case "memberCount":
        case "releaseDate":
          album[key] = parseInt(value) as number;
          break;

        case "genres":
        case "topSongs":
          album[key] = value.split(";") as string[];
          break;

        default:
          album[key] = value as string;
      }
    });

    return album as Album;
  });
}






// Header is generic, we want TS to know the keys
export function getAlbum(
  csvUrl: string,
): Album[] {
  const url = path.join(process.cwd(), "data", csvUrl);
  const csvData = fs.readFileSync(url, "utf8");
  return getAlbumsDataDynamic(csvData)
}
