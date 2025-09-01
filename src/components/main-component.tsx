"use client"; 
import Image from "next/image";
import { CircleQuestionMark, Command } from "lucide-react";
import { Carousel, CarouselContent, CarouselNext, CarouselItem } from "./ui/carousel";
import AutoScroll from 'embla-carousel-auto-scroll'
import { Album } from "../types/albums";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { JSX, useEffect, useRef, useState } from "react";
import { CommandList,CommandItem, CommandInput, CommandEmpty, CommandGroup, CommandSeparator } from "./ui/command";
import AutoComplete from "./autocomplete";
import StatDisplay from "./album-stat";
import { AlbumDisplay } from "./album-display";
import { startGame, submitGuess } from "../lib/logic";
import { GameClientFirstInformation, GameClientLastUpdate, GameClientUpdate, GameState } from "../types/game-state";
import { createDefaultMainStat, createDefaultStat, Stat } from "../types/stat";
import StatMainDisplay from "./display-stat";
import { Separator } from "./ui/separator";
import { Dialog, DialogContent, DialogTrigger,DialogTitle,DialogHeader } from "./ui/dialog";





//Main component  of the main page
export function MainComponent({albums}: {albums: Album[]}) {
  const [selected, setSelected] = useState<number>(0);
  const [displayInfo, setDisplayInfo] = useState<Stat>(createDefaultMainStat());
  const [attemptsSquare, setAttemptsSquare] = useState<string[]>([]);  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isFirstAttempt, setFirstAttempt] = useState<boolean>(true);
  const [clientLastUpdate, setClientLastUpdate] = useState<GameClientLastUpdate | null>(null);
  const attemptListRef = useRef<HTMLDivElement>(null);
  const [fullAutoCompleteList,setFullAutoCompleteList] = useState<{ value: string; labelImportant: string; labelSecondary: string }[]>([]);
  
  const correct:string ="bg-[#61B35B]"
  const incorrect:string ="bg-[#D83B3B]"
  const neutral:string ="bg-gray-500"
  const beginTransition=`transition-opacity duration-500 ${isFirstAttempt ? "opacity-0" : "opacity-100"}
  ${isFirstAttempt ? "pointer-events-none" : ""}`
  

  async function startGameClientSide() {
    setFullAutoCompleteList( albums.map((album) => ({
    value: album.id.toString(),
    labelImportant: album.title,
    labelSecondary: album.artist,
  })));
  const startInformation = await startGame();
  // Save server info
  storeSecure(startInformation.secure);
  console.log(startInformation.secure.data);
  setGameState(JSON.parse(startInformation.secure.data) as GameState);
  console.log(gameState);
  // Build attempt squares array
  const squares = [];
  for (let i = 0; i < startInformation.maxAttempts; i++) {
    squares.push(neutral);
  }

  // Update state once
  setAttemptsSquare(squares);
}

function updateGame(gameUpdate: GameClientUpdate| GameClientFirstInformation | GameClientLastUpdate) {
  const newGameState = JSON.parse(gameUpdate.secure.data) as GameState;
  setGameState(newGameState);
  if(isFirstAttempt)
    setFirstAttempt(false);
  storeSecure(gameUpdate.secure);
  console.log(gameUpdate);
  setDisplayInfo(gameUpdate.knownStat);
   switch(gameUpdate.type)
     {
      case 'update':
        attemptsSquare[newGameState.attempts.length as number -1] = incorrect;
         setFullAutoCompleteList(fullAutoCompleteList.filter(item =>
  !newGameState.attempts.some(other => other.id.toString() === item.value)));
        break;
        case 'last':
          // Handle last case

          if(gameUpdate.hasWin)
            attemptsSquare[newGameState.attempts.length as number -1] = correct;
          else
            attemptsSquare[newGameState.attempts.length as number -1] = incorrect;
          setClientLastUpdate(gameUpdate);
          break;
        }
        
        
}

// Run startGameClientSide only once after first render
  useEffect(() => {
    startGameClientSide();
  }, []); // [] = run only on mount


   function handleEnter(value: string) {
    setSelected(parseInt(value));
    const update = submitGuess(parseInt(value),{data :localStorage.getItem("data") as string, signature: localStorage.getItem("signature") as string});
    update.then((response) => {
      updateGame(response);
    });
  }


function displayLastDialog(ClientLastUpdate: GameClientLastUpdate | null)
{
  if( !ClientLastUpdate) return;
const hasWin = ClientLastUpdate.hasWin;
const album = ClientLastUpdate.answer;
  const title = hasWin ? "Congratulations !" : "Game Over";
  const message = hasWin ? `You guessed  it right !` : `Loser`;
  album.color = createDefaultStat()
  return (
   <div>
          <p>{title}</p>
        <p>{message}</p>
        The album was <AlbumDisplay album={album} />
        Come tomorrow for the next guess !
</div>
  );
}

function displayCurrentInformation(knownStat: Stat)
{
  return (
   <div>
    <p className={` ${beginTransition}`}>Current information</p>
         <StatMainDisplay  stat={knownStat}/>
</div>
  );
}



  
	return (
		<div className=" w-[70vw] lg:w-[50vw] md:w-[50vw]  h-full text-xs sm:text-sm md:text-lg">
            <div className="flex flex-col justify-center items-center gap-2 mt-5">
                <div className=" text-xl sm:text-2xl md:text-3xl">Guess todays&apos;album ! </div>
                <div className="text-md sm:text-lg md:text-xl"> To play, simply enter an album title in the field below and click &quot;Guess&quot;.</div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4 mt-6">
             <AutoComplete fullList={fullAutoCompleteList} onEnter={handleEnter}/>
                  <div className={`w-full h-full flex flex-col justify-center items-center gap-2 mt-2
                  ${beginTransition}`}>
                  <div className={`flex flex-row gap-2 mt-2`}>
                     {attemptsSquare.map((bgClass, i) => (
                       <div
                         key={i}
                         id={`attempt${i}`}
                         className={`rounded-lg p-4  w-6 h-6 ${bgClass}`}
                       ></div>
                     ))}
                </div>
                 Attempts lefts : { gameState && gameState.maxAttempts! - gameState.attempts.length!}
                </div>
             <div className={`flex flex-col justify-center items-center gap-4 w-full
              ${beginTransition}`}>
             {clientLastUpdate===null && displayCurrentInformation(displayInfo)}
             {clientLastUpdate && displayLastDialog(clientLastUpdate)}
             <Separator className={`  ${beginTransition}`}></Separator>
             <p className="text-2xl"> Attempts list</p>
        <div className="flex flex-col-reverse gap-4 w-full mb-4">
        {gameState?.attempts.map((album, index) => (
    <AlbumDisplay key={album.id} album={album} />
))}

        </div>
      </div>
      </div>
		</div>
	);
  function storeSecure(secure: {data:string, signature:string}) {
    localStorage.setItem("data", secure.data);
    localStorage.setItem("signature", secure.signature);
  }
}


