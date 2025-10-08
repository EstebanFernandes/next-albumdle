import * as Icons from "lucide-react";
import { Album } from "./albums";
import { createDefaultMainStat, Stat } from "./stat";
export interface GameState {
  gamemodeId: number;
  attempts: Album[];
  isGameOver: boolean;
  maxAttempts: number;
  hints: hintState[]
}

export interface hintState {
  type:'cover'|'tracks';
  label:string;
  iconName: keyof typeof Icons; // any valid Lucide icon name
  available:number;
  value?:string;

}

export interface GameClientFirstInformation {
  type: 'first';
  maxAttempts: number;
  knownStat: Stat;
  secure: { data: string; signature: string };
}

export interface GameClientUpdate {
  type: 'update';
  attemptVerify: Album|null;
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
  dateToNextUpdate: Date;
  try:number;
  guess:number;
}




export function createFirstGameState( secure_ :{ data: string; signature: string }) : GameClientFirstInformation{
return {
  type:'first',
  maxAttempts: 6,
  secure: secure_,
  knownStat: createDefaultMainStat()
}
}

export function createDefaultGameState(gamemodeId:number) : GameState
{
  return {
    gamemodeId: gamemodeId,
    attempts: [],
    isGameOver: false,
    maxAttempts: 6,
    hints : []
  };
}
