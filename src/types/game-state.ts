import { Album } from "./albums";
import { createDefaultMainStat, createDefaultStat, Stat } from "./stat";

export interface GameState {
  gameType: GameType;
  attempts: Album[];
  isGameOver: boolean;
  maxAttempts: number;
}

export interface GameClientFirstInformation {
  type: 'first';
  maxAttempts: number;
  knownStat: Stat;
  secure: { data: string; signature: string };
}

export interface GameClientUpdate {
  type: 'update';
  attemptVerify: Album;
  knownStat: Stat;
  secure: { data: string; signature: string };
  isGameOver: boolean;
}

export interface GameClientLastUpdate {
  type: 'last';
  hasWin: boolean;
  answer: Album;
  knownStat: Stat;
  secure: { data: string; signature: string };
  isGameOver: true;
}


function isClientUpdate(object: any): object is GameClientUpdate {
    return 'attemptVerify' in object;
}

export function createFirstGameState( secure_ :{ data: string; signature: string }) : GameClientFirstInformation{
return {
  type:'first',
  maxAttempts: 6,
  secure: secure_,
  knownStat: createDefaultMainStat()
}
}

export function createDefaultGameState() : GameState
{
  return {
    gameType: GameType.Main,
    attempts: [],
    isGameOver: false,
    maxAttempts: 6
  };
}

enum GameType {
  Main = 0,
}
