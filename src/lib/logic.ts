"use server";
// This file should contain game's logic, as choosing the right album based on user input. and decide the album of the day
import { Album } from "../types/albums";

import { getAlbums } from "./csv";
import { isSameDayAsToday } from "./utils";
import { createDefaultMainStat, createDefaultStat, Stat } from "../types/stat";
import crypto from 'crypto';
import { createDefaultGameState, createFirstGameState, GameClientFirstInformation, GameClientLastUpdate, GameClientUpdate, GameState } from "../types/game-state";


//This function will handle games logic, it will be store in the main page
let album :Album | null = null;
const albums = getAlbums();
const lastDate = new Date();

const correct:string ="bg-[#61B35B]"
const incorrect:string ="bg-[#D83B3B]"
const partial:string ="bg-[#FFB900]"
const GAME_SECRET = process.env.GAME_SECRET!;
export async function updateTodayAlbum()
{
    if(album!==null && isSameDayAsToday(lastDate))
        return album;

    
    if (!albums.length) return null;
    // Get the current date in UTC YYYY-MM-DD format
    const now = new Date();
    const daySeed = now.getUTCFullYear() + '-' +
        String(now.getUTCMonth() + 1).padStart(2, '0') + '-' +
        String(now.getUTCDate()).padStart(2, '0');
    let hash = 0;
    for (let i = 0; i < daySeed.length; i++) {
        hash = (hash << 5) - hash + daySeed.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % albums.length;
    album = albums[index];
    console.log(`Today's album is: ${album.title} by ${album.artist}`);
}

//Function calls by the client main component to fetch various information (date, number of attempts )
export async function startGame(){
    const state = createDefaultGameState();
    return createFirstGameState(signState(state));
}


// --- Main server action ---
export async function submitGuess(
  guessId: number,
  secure: { data: string; signature: string }
) : Promise<GameClientUpdate | GameClientFirstInformation | GameClientLastUpdate>
{
  // Verify the incoming state
  if (!verifyState(secure.data, secure.signature)) {
    throw new Error("Invalid or tampered state");
  }

  const state: GameState = JSON.parse(secure.data);
  if(album===null)
    updateTodayAlbum()
if(album===null|| state.isGameOver)
  {
    const lastState : GameClientLastUpdate = {
      type: 'last',
      hasWin: false,
      answer: albums[guessId],
      secure: signState(state),
      knownStat: createDefaultStat(),
      isGameOver: true
    };
    return lastState;
   }

  // --- Validate the guess ---
console.log(albums[guessId].artist)
const albumOfTheDay = album;
const guess = albums[guessId]
  const isCorrect = guessId === albumOfTheDay.id;

  updateState(state,guess);
console.log(isCorrect);
  // Return updated state
  const signed = signState(state);
  if(isCorrect===false)
  {
    const clientInfo : GameClientUpdate = {
    type: 'update',
    attemptVerify :guess,
    knownStat: calculateNewStat(state),
    secure: signed,
    isGameOver : state.isGameOver
  }
  return clientInfo;
  }
  else{
    const clientLastInfo : GameClientLastUpdate = {
      type: 'last',
      hasWin: true,
      answer: album,
      secure: signState(state),
      knownStat: calculateNewStat(state),
      isGameOver: true
    };
    return clientLastInfo;
  }
}

function updateState(state: GameState, guess: Album) {
  // Update the game state as needed
  state.attempts.push(guess);
    if (guess.id === album?.id || state.attempts.length >= state.maxAttempts) {
        state.isGameOver = true;  
    }
    updateColorOfAlbum(guess);
}



function numericLogic(values :number[], aimValue : number, isReverse = false) {
  if (!Array.isArray(values) || values.length === 0) {
    return 'Unknown';
  }

  aimValue = Number(aimValue);
  if (isNaN(aimValue)) {
    return 'Unknown';
  }
  if (values.includes(aimValue)) {

     return String(aimValue)
  }

  if (values.length === 1) {
    if (isReverse) {
      const direction = values[0] < aimValue ?  "↓" : "↑";
      return `${values[0]} ${direction}`;
    } else {
      const direction = values[0] > aimValue ? "↓" : "↑";
      return `${values[0]} ${direction}`;
  }
}

  let minRange = null;

  // Look for the smallest range that includes aimValue
  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      const a = values[i];
      const b = values[j];
      const low = Math.min(a, b);
      const high = Math.max(a, b);

      if (aimValue >= low && aimValue <= high) {
        const size = high - low;
        if (!minRange || size < minRange.size) {
          minRange = { low, high, size };
        }
      }
    }
  }

  if (minRange) {
    return `${minRange.low} - ${minRange.high}`;
  }

  // If no valid range found, return nearest value + arrow
  let closest = values[0];
  let minDiff = Math.abs(values[0] - aimValue);

  for (const val of values) {
    const diff = Math.abs(val - aimValue);
    if (diff < minDiff) {
      minDiff = diff;
      closest = val;
    }
  }

//True = up, False = down
  let direction = closest < aimValue ? "↑" : "↓";
  if (isReverse)
    direction = closest > aimValue ? "↑" : "↓";
  return `${closest} ${direction}`;
}

function genreLogic(genres :string[], aimGenres:string[]) : string {
  if (!Array.isArray(genres) || genres.length === 0 || !aimGenres) {
    return '?';
  }

  const genresSet = new Set(genres.map(g => g.toLowerCase()));
  const returns:string[] = []
  for(let i = 0; i < aimGenres.length; i++) {
    const g = aimGenres[i];
    if (genresSet.has(g.toLowerCase())) {
      returns.push(g);
    }
    else
      returns.push("?");
  }

  return returns.join('/');
}



function memberLogic(members:number[], aimMember: number):string {
  if (!Array.isArray(members) || members.length === 0 || !aimMember) {
    return '?';
  }

  const found = members.find(member => member === aimMember);
  if(!found)
    return '?'; 

  if (Number(aimMember) === 1)
    return "Solo";
  else if (Number(aimMember) === 2)
    return "Duo";
  else
    return `Group (${aimMember})`;
  }






function capitalize(stringToCapitalize:string) {
  return stringToCapitalize.charAt(0).toUpperCase() + stringToCapitalize.slice(1);
}


function signState(state: GameState) {
  const data = JSON.stringify(state);
  const signature = crypto
    .createHmac('sha256', GAME_SECRET)
    .update(data)
    .digest('hex');

  return { data, signature };
}

function verifyState(data: string, signature: string) {
  const expected = crypto
    .createHmac('sha256', GAME_SECRET)
    .update(data)
    .digest('hex');

  return expected === signature;
}

function calculateNewStat(state: GameState): Stat {
    const returnStat = createDefaultMainStat()
    if(album===null)
        return returnStat
  //ARTIST NAME LOGIC
  const artists = [...new Set(state.attempts.map(a => a.artist).filter(Boolean))];
  returnStat.artist = (artists.includes(album?.artist)) ? album?.artist : "???";

  // RANK LOGIC
  const ranks = state.attempts.map(a => Number(a.rank)).filter(n => !isNaN(n));

  returnStat.rank = numericLogic(ranks, album?.rank)
  
  // RELEASE YEAR LOGIC
  const releases = state.attempts.map(a => Number(a.releaseDate)).filter(n => !isNaN(n));
  returnStat.date = numericLogic(releases, album?.releaseDate);
  
  const genres = Array.from(
  new Set(
    state.attempts
      .map(a => a.genres)        // get the array of genres for each attempt
      .filter(Boolean)           // remove undefined or null
      .flat()                    // flatten array of arrays into a single array
      .map(g => g.trim())        // trim whitespace
      .filter(g => g.length > 0) // remove empty strings
  )
);


  returnStat.genres = genreLogic(genres, album?.genres);
  

  // TYPE LOGIC
  const types = state.attempts.map(a => a.type).filter(Boolean);
  returnStat.type = types.includes(album?.type) ? album?.type : "???";

  // MEMBERS LOGIC
  const members = state.attempts.map(a => a.memberCount).filter(Boolean);
  returnStat.memberCount = memberLogic(members, album?.memberCount);

  // LOCATION LOGIC
  const locations = state.attempts.map(a => a.country).filter(Boolean);
  returnStat.location = (locations.includes(album?.country)) ? album?.country : "???";


  // LABEL LOGIC
  const labels = state.attempts.map(a => a.label).filter(Boolean);
  returnStat.label = labels.includes(album?.label) ? album?.label : "???";
  return returnStat;
}


function updateColorOfAlbum(albumToTry: Album) {
        albumToTry.color.artist = (albumToTry.artist === album?.artist) ? correct : incorrect;
        
        albumToTry.color.rank = (albumToTry.rank === album?.rank) ? correct : incorrect;

        albumToTry.color.date = (albumToTry.releaseDate === album?.releaseDate) ? correct : incorrect;
        
        albumToTry.color.genres = (albumToTry.genres.join("/") === album?.genres.join("/")) ? correct : incorrect;
        
        let found=0;
        const albumGenres = album?.genres|| [];
        for(const genre of albumGenres)
        {
            if(albumToTry.genres.includes(genre))
                found++;
        }

        albumToTry.color.genres = (found===album?.genres.length) ? correct : (found>0) ? partial : incorrect;

        albumToTry.color.type = (albumToTry.type === album?.type) ? correct : incorrect;

        const tryCount = albumToTry.memberCount; const albumCount = album?.memberCount || 0;
        if(tryCount===albumCount)
            albumToTry.color.memberCount = correct;
        else if (Math.abs(tryCount-albumCount)===1) //Little difference
            albumToTry.color.memberCount = partial;
        else
            albumToTry.color.memberCount = incorrect;
        
        albumToTry.color.location = (albumToTry.country === album?.country) ? correct : incorrect;
        
        albumToTry.color.label = (albumToTry.label === album?.label) ? correct : incorrect;

}