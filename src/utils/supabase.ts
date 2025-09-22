import { createClient, PostgrestError } from '@supabase/supabase-js';
import { getAlbums } from '../lib/csv';
import { getHintImage } from '../lib/image';
import { todayDateNumber } from '../lib/utils';
import { Database } from '../types/database.types';
import { AlbumOfTheDay } from '../types/game';
import { chooseAlbumOfTheDayRandomly } from './logic.helper';

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // or ANON KEY depending on use
)
const BUCKET = "image_hint"; // your bucket name

function assertNoError<T>(
  result: { data: T | null; error: PostgrestError | null },
  context: string
): T {
  if (result.error || !result.data) {
    throw new Error(
      `Supabase error in ${context}: ${result.error?.message ?? "No data"}`
    );
  }
  return result.data;
}

export async function retrieveTodayAlbum() {

  const todayString = todayDateNumber()
  console.log(`Retrieving Rolling stones' album of the day for the following date ${todayString}`);
  const res = await retrieveAlbum(todayString)
  const data = assertNoError(res, "retrieve today album")
  if (data.length === 0)
    return null
  else
    return data[0]
}

//Date format must be YearMonthDay
export async function retrieveAlbum(date: number) {
  return supabase
    .from("rolling_stones_magazine")
    .select().eq("date", date).range(0, 1)

}

export async function DBretrieveAlbumById(id:number) {
  const res = await supabase
    .from("rolling_stones_magazine")
    .select().eq("id", id).range(0, 1)
    const data = assertNoError(res, `Try to retrieve album with id ${id}`)
    return data[0];
}

export async function updateTodayAlbum(): Promise<AlbumOfTheDay | null> {
  const todaydate = todayDateNumber()
  const todayTry = await retrieveTodayAlbum()
  if (todayTry)//If the select only reply one value
  {
    const albums = getAlbums()
    if (todayTry.album_id) {
      const todayAlbum = albums[todayTry.album_id]
      console.log(`Album of the day is ${todayAlbum.title} by ${todayAlbum.artist}`)
      return {
        id: todayTry.id.toString(),
        date: todaydate.toString(),
        album: todayAlbum,
        imageHint: await getHintImage(todayAlbum.large_thumbnail, 4),
        try: todayTry.try ?? 0,
        guess: todayTry.guess ?? 0
      }
    }
    console.error(`Row with ID : ${todayTry.id} exist without any album ID`)
    return null
  }
  //Here we know that we have to create it
  console.log("Fetching last 5 rows to decide today album")
  const albumIdsRes = await supabase.from("rolling_stones_magazine").select("album_id").lt('date', todaydate).range(0, 5)
  const data = assertNoError(albumIdsRes, "Fetching 5 values from rolling  stones table to determine today's album")
  //Cleaning data
  const cleanData = data.map(data => data.album_id).filter(album_id => album_id !== null)
  const albums = getAlbums()
  //Get rid of the last 5 data
  const usableAlbums = albums.filter(album => !cleanData.includes(album.id));
  const now = new Date()
  const albumOfTheDay = await chooseAlbumOfTheDayRandomly(usableAlbums, new Date())
  //Now insert in the DB 
  const insertRes = await supabase.from("rolling_stones_magazine").insert({ album_id: (await albumOfTheDay).album.id, try: 0, guess: 0, date: todaydate }).select()
  const insertData = assertNoError(insertRes, "Inserting new album of the day in the database ")
  albumOfTheDay.id = insertData[0].id.toString()
  console.log(`Album of the day is ${albumOfTheDay.album.title} by ${albumOfTheDay.album.artist}`)
  return albumOfTheDay;
}

export async function updateAlbumInDatabase(album: AlbumOfTheDay) {
  console.log(`updating BDD album of the day with ID ${album.id}, corresponding to ${album.album.title} by ${album.album.artist}`)
  const res = await supabase
    .from("rolling_stones_magazine")
    .update({
      try: album.try,
      guess: album.guess
    })
    .eq('id', Number.parseInt(album.id))
  const data = assertNoError(res, "Updating row of postgres database")
}

export async function uploadToSupabase(fileName: string, buffer: Buffer) {
  // Check if file already exists
  const { data: existingData, error: listError } = await supabase
    .storage
    .from(BUCKET)
    .list("", { search: fileName });

  if (listError) throw listError;
  if (existingData && existingData.length > 0) {
    // Return existing public URL
    return supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;
  }

  // Upload the file
  const { error: uploadError } = await supabase
    .storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  // Return public URL
  return supabase.storage.from(BUCKET).getPublicUrl(fileName).data.publicUrl;

}

//Get each id for a given day of the month, input as format yyyymm
export async function getMonthPick(yearmonth: number): Promise<
  {
    id: number;
    date: number | null;
  }[]> {
    const min = Number.parseInt(yearmonth.toString().padEnd(8,"0"))
        const max = (yearmonth+1).toString().padEnd(8,"0")
  console.log(`Fetching rows for the following date ${yearmonth}`)
  const res = await supabase.from("rolling_stones_magazine").select("id,date").lt('date', max).gt("date",min)
  const data = assertNoError(res, `Fetching album of the day for the following year and month ${yearmonth}`)
  //Cleaning data
  console.log(`Returning ${data.length} rows`)
  return data;
}