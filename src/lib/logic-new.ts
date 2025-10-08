"use server";
// This file should contain game's logic, as choosing the right album based on user input. and decide the album of the day
import { Album, nullAlbum, todayData } from "../types/albums";

import crypto from 'crypto';
import { createDefaultGameState, createFirstGameState, GameClientFirstInformation, GameClientLastUpdate, GameClientUpdate, GameState, hintState } from "../types/game-state";
import { baseStat, createDefaultMainStat, Stat } from "../types/stat";
import { updateAlbumInDatabase } from "../utils/supabase";
import { getGameDayData } from "./gamemode";



//This function will handle games logic, it will be store in the main page

const correct: string = "bg-[#61B35B]"
const incorrect: string = "bg-[#D83B3B]"
const partial: string = "bg-[#FFB900]"
const GAME_SECRET = process.env.GAME_SECRET!;

//Function calls by the client main component to fetch various information (date, number of attempts )
export async function startGame(gamemodeId: number) {
  const state = createDefaultGameState(gamemodeId);
  state.hints = [{ type: 'cover', label: "cover", iconName: "Image", available: 2 }, { type: 'tracks', label: "songs", iconName: "AudioLines", available: 3 }];
  return createFirstGameState(signState(state));
}



// --- Main server action ---
export async function submitGuess(
  guessId: number,
  secure: { data: string; signature: string }, gID: number
): Promise<GameClientUpdate | GameClientFirstInformation | GameClientLastUpdate> {
  // Verify the incoming state
  if (!verifyState(secure.data, secure.signature)) {
    throw new Error("Invalid or tampered state");
  }

  const state: GameState = JSON.parse(secure.data);

  // --- Validate the guess ---
  const gameData = await getGameDayData(state.gamemodeId)
  if (gameData === null || gameData.today === null)
    throw new Error("Game data does not exist for this");

  const albums = gameData.mode.data;
  const album = gameData.today.album;
  const guess = (guessId === -1) ? null : albums[guessId];

  updateState(state, guess,gameData.today.album);
  updateHints(state.hints,gameData.today);
  const isCorrect = state.attempts.some(a => a.id === album.id);
  console.log(`Status of the guess : ${isCorrect.toString()}`)
  if (state.isGameOver || isCorrect) {
    gameData.today.try++
    if (isCorrect) gameData.today.guess++
    updateAlbumInDatabase(gameData.today)
    const lastState: GameClientLastUpdate = {
      type: 'last',
      hasWin: isCorrect,
      answer: album,
      secure: signState(state),
      knownStat: calculateNewStat(state,gameData.today),
      isGameOver: true,
      dateToNextUpdate: new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate() + 1)),
      try: gameData.today.try,
      guess: gameData.today.guess
    };
    return lastState;
  }
  console.log("here is the guess")
  console.log(guess)

  const clientInfo: GameClientUpdate = {
    type: 'update',
    attemptVerify: guess,
    knownStat: calculateNewStat(state,gameData.today),
    secure: signState(state),
    isGameOver: state.isGameOver
  };

  return clientInfo;
}

function updateState(state: GameState, guess: Album | null,todayAlbum:Album) {
  if (guess) {
    updateColorOfAlbum(guess,todayAlbum);
    // Update the game state as needed
    state.attempts.unshift(guess);
  }
  else {
    state.attempts.unshift(nullAlbum())
  }
  if (state.attempts.length >= state.maxAttempts) {
    state.isGameOver = true;
  }
}

function updateHints(hints: hintState[], today: todayData) {

  for (const hint of hints) {
    hint.available--;
    if (hint.available < 0) hint.available = 0;

    if (hint.type === "cover" && hint.available === 0) {
      hint.value = today.imageHint ?? "";
    }

    if (hint.type === "tracks" && hint.available === 0) {
      hint.value = today.album.topSongs.join(";") || "";
    }

  }
}

  function numericLogic(values: number[], aimValue: number, isReverse = false) {
    if (!Array.isArray(values) || values.length === 0) {
      return baseStat;
    }

    aimValue = Number(aimValue);
    if (isNaN(aimValue)) {
      return baseStat;
    }
    if (values.includes(aimValue)) {

      return String(aimValue)
    }

    if (values.length === 1) {
      if (isReverse) {
        const direction = values[0] < aimValue ? "↓" : "↑";
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

  function genreLogic(genres: string[], aimGenres: string[]): string[] {
    if (!Array.isArray(genres) || genres.length === 0 || !aimGenres) {
      return ['?'];
    }

    const genresSet = new Set(genres.map(g => g.toLowerCase()));
    const returns: string[] = []
    for (let i = 0; i < aimGenres.length; i++) {
      const g = aimGenres[i];
      if (genresSet.has(g.toLowerCase())) {
        returns.push(g);
      }
      else
        returns.push("?");
    }

    return returns;
  }



  function memberLogic(members: number[], aimMember: number): string {
    if (!Array.isArray(members) || members.length === 0 || !aimMember) {
      return '?';
    }

    const found = members.find(member => member === aimMember);
    if (!found)
      return '?';

    if (Number(aimMember) === 1)
      return "Solo";
    else if (Number(aimMember) === 2)
      return "Duo";
    else
      return `Group (${aimMember})`;
  }

  function capitalize(stringToCapitalize: string) {
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

  function calculateNewStat(state: GameState,today:todayData): Stat {
    const returnStat = createDefaultMainStat()
    const attempts = state.attempts.filter(attempt => attempt.id !== -1)
    const album = today.album;
    //ARTIST NAME LOGIC
    const artists = [...new Set(attempts.map(a => a.artist).filter(Boolean))];
    returnStat.artist = (artists.includes(album?.artist)) ? album?.artist : "???";

    // RANK LOGIC
    const ranks = attempts.map(a => Number(a.rank)).filter(n => (!isNaN(n) || n !== -1));

    returnStat.rank = numericLogic(ranks, album?.rank, true)

    // RELEASE YEAR LOGIC
    const releases = attempts.map(a => Number(a.releaseDate)).filter(n => !isNaN(n) || n !== -1);
    console.log(releases)
    returnStat.date = numericLogic(releases, album?.releaseDate);

    const genres = Array.from(
      new Set(
        attempts
          .map(a => a.genres)        // get the array of genres for each attempt
          .filter(Boolean)           // remove undefined or null
          .flat()                    // flatten array of arrays into a single array
          .map(g => g.trim())        // trim whitespace
          .filter(g => g.length > 0) // remove empty strings
      )
    );


    returnStat.genres = genreLogic(genres, album?.genres);


    // TYPE LOGIC
    const types = attempts.map(a => a.type).filter(Boolean);
    returnStat.type = types.includes(album?.type) ? album?.type : "???";

    // MEMBERS LOGIC
    const members = attempts.map(a => a.memberCount).filter(Boolean);
    returnStat.memberCount = memberLogic(members, album?.memberCount);

    // LOCATION LOGIC
    const locations = attempts.map(a => a.country).filter(Boolean);
    returnStat.location = (locations.includes(album?.country)) ? album?.country : "???";


    // LABEL LOGIC
    const labels = attempts.map(a => a.label).filter(Boolean);
    returnStat.label = labels.includes(album?.label) ? album?.label : "???";
    return returnStat;
  }


  function updateColorOfAlbum(albumToTry: Album,todayAlbum:Album) {

    albumToTry.color.artist = (albumToTry.artist === todayAlbum.artist) ? correct : incorrect;

    albumToTry.color.rank = (albumToTry.rank === todayAlbum.rank) ? correct : incorrect;

    albumToTry.color.date = (albumToTry.releaseDate === todayAlbum.releaseDate) ? correct : incorrect;

    //Here we gonna compare each genre


    const found = 0;
    const albumGenres = todayAlbum.genres || [];
    albumToTry.color.genres = []
    for (const genre of albumToTry.genres) {
      if (albumGenres.includes(genre))
        albumToTry.color.genres.push(correct);
      else
        albumToTry.color.genres.push(incorrect);
    }


    albumToTry.color.type = (albumToTry.type === todayAlbum.type) ? correct : incorrect;

    const tryCount = albumToTry.memberCount; const albumCount = todayAlbum.memberCount || 0;
    if (tryCount === albumCount)
      albumToTry.color.memberCount = correct;
    else if (Math.abs(tryCount - albumCount) === 1) //Little difference
      albumToTry.color.memberCount = partial;
    else
      albumToTry.color.memberCount = incorrect;

    albumToTry.color.location = (albumToTry.country === todayAlbum.country) ? correct : incorrect;

    albumToTry.color.label = (albumToTry.label === todayAlbum.label) ? correct : incorrect;

  }


