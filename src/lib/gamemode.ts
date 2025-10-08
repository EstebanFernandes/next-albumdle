"use server"
//This file will fetch and cache every gamemode and needed CSV file for each 

import { BackgroundAlbum, GameDayData, GameMode } from "../types/albums";
import { getGameModes, updateAlbumInDatabase, updateTodayAlbum } from "../utils/supabase";
import { getAlbum, getAlbumsRawData } from "./csv";
import { getRandomElements, todayDateString } from "./utils";

const gamemodes: GameDayData[] = [];
 export async function initGamemodes()
{
  console.log("initializing Game data")
    if(gamemodes.length!==0)
        return false;
    const data = await getGameModes() //From DB
    for(const gamemodeDb of data)
    {
        if(gamemodeDb.properties===null)
            throw new Error("AHHHHHHHHHHHHH")
        const headers = gamemodeDb.properties.split(",")

        const gamemode:GameMode = {
            id:gamemodeDb.id,
            title : gamemodeDb.title??"",
            description : gamemodeDb.description??"",
            url:gamemodeDb.url??"",
            propertiesString : headers,
            data : getAlbum(gamemodeDb.csvUrl??"")
        }
        console.log(`Album loaded with ${gamemode.data.length} rows`)
        gamemodes.push({mode :gamemode, today : null})
        for(const gameDay of gamemodes)//Init for each gamemode today album
        {
          await updateDayData(gameDay)
        }
        console.log(`Found gamemode  ${gamemode.title} with id ${gamemode.id}`)
    }
    return true;
}

export async function getGameDayData(gamemodeId:number)
{
  if(gamemodes.length===0)
     await initGamemodes();
    return gamemodes.find((gameday)=> gamemodeId===gameday.mode.id) ?? null
}

/*
export async function updateDayData(gId:number)
{
    const dayData = await getGameDayData(gId)
    if(dayData===null) return null;
    if(dayData.today===null)
       { dayData.today = await updateTodayAlbum(dayData.mode.id,dayData.mode.propertiesString)
    return dayData.today;
    }
  const todaydate = todayDateString()
  if (todaydate === dayData.today.date)
    return dayData.today;

  if (todaydate > dayData.today.date) {
    updateAlbumInDatabase(dayData.today)
  }
  dayData.today = await updateTodayAlbum(dayData.mode.id,dayData.mode.propertiesString)
  return dayData.today
}
*/

export async function updateDayData(dayData:GameDayData)
{
  console.log(`Updating game data for ${dayData.mode.title}`)
    if(dayData.today===null)
       { dayData.today = await updateTodayAlbum(dayData.mode.id)
    return dayData.today;
    }
  const todaydate = todayDateString()
  if (todaydate === dayData.today.date)
    return dayData.today;

  if (todaydate > dayData.today.date) {
    updateAlbumInDatabase(dayData.today)
  }
  dayData.today = await updateTodayAlbum(dayData.mode.id)
  return dayData.today
}




export async function getAlbums(gID:number,numberOfAlbums:number=-1)
{
     if (numberOfAlbums!==-1) {
        const data = (await getGameDayData(gID))?.mode.data ?? null;
        if(data===null)return null
        return getRandomElements(data, numberOfAlbums);
      }
    return (await getGameDayData(gID))?.mode.data ?? null;
}


export async function getBackgroundAlbums(albumCount:number=40): Promise<BackgroundAlbum[]>
{
  const data = await getAlbums(1,albumCount)
  const result:BackgroundAlbum[] =[]
  if(data===null)
    return result;
  for(const album of data)
  {
    result.push({
      id: album.id, 
      title: album["title"],
      thumbnail: album["smallThumbnail"],
      scale: Math.floor(Math.random() * (100 - 90 + 1) + 90)
    })
  }
  return result;
}

export async function getProperties(gID:number)
{
  return gamemodes.find((gamemode)=>gamemode.mode.id===gID)?.mode.propertiesString ?? []
}

export async function getGamemode(gID:number)
{
  return gamemodes.find((gamemode)=>gamemode.mode.id===gID)?.mode
}

export async function updateAlbums()
{
  for(const gameday of gamemodes)
  {
    updateDayData(gameday)
  }
}