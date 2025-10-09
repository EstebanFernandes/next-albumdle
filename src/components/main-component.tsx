"use client";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { startGame, submitGuess } from "../lib/logic-new";
import { Album, GameMode } from "../types/albums";
import { GameClientFirstInformation, GameClientLastUpdate, GameClientUpdate, GameState } from "../types/game-state";
import { createDefaultMainStat, createDefaultStat, Stat } from "../types/stat";
import { AlbumDisplay } from "./album-display";
import AutoComplete from "./autocomplete";
import StatMainDisplay from "./display-stat";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader } from "./ui/card";
import Confetti, { ConfettiHandle } from "./confetti";
import { Button } from "./ui/button";
import { toast } from "sonner"
import { CircleQuestionMark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";





//Main component  of the main page
export function MainComponent({ albums, gamemode }: { albums: Album[], gamemode: GameMode }) {
  const [selected, setSelected] = useState<number>(0);
  const [displayInfo, setDisplayInfo] = useState<Stat>(createDefaultMainStat());
  const [attemptsSquare, setAttemptsSquare] = useState<string[]>([]);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isFirstAttempt, setFirstAttempt] = useState<boolean>(true);
  const [clientLastUpdate, setClientLastUpdate] = useState<GameClientLastUpdate | null>(null);
  const attemptListRef = useRef<HTMLDivElement>(null);
  const [fullAutoCompleteList, setFullAutoCompleteList] = useState<{ value: string; labelImportant: string; labelSecondary: string }[]>([]);
  const [difference, setDifference] = useState<Date>(new Date());
  const incorrect: string = "bg-[#D83B3B]"
  const neutral: string = "bg-gray-500"
  const correct: string = "bg-[#61B35B]"
  const skip: string = "bg-[#664F3E]"
  const beginTransition = `transition-opacity duration-500 ${isFirstAttempt ? "opacity-0" : "opacity-100"}
  ${isFirstAttempt ? "pointer-events-none" : ""}`
  const [disabledInput, setDisableInput] = useState<boolean>(false)
  const confettiRef = useRef<ConfettiHandle>(null);

  const t = useTranslations("gamePage");
  const tTools = useTranslations("tools");
  const tRoot = useTranslations("")
  const [title, setTitle] = useState<string>(t("title"))
  const [subtitle, setSubtitle] = useState<string>(t("subtitle"))

  async function startGameClientSide() {
    setFullAutoCompleteList(albums.map((album) => ({
      value: album.id.toString(),
      labelImportant: album.title,
      labelSecondary: album.artist,
    })));
    const startInformation = await startGame(gamemode.id);
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



  function updateGame(gameUpdate: GameClientUpdate | GameClientFirstInformation | GameClientLastUpdate) {
    const newGameState = JSON.parse(gameUpdate.secure.data) as GameState;
    setGameState(newGameState);
    if (isFirstAttempt)
      setFirstAttempt(false);
    storeSecure(gameUpdate.secure);
    console.log(gameUpdate);
    setDisplayInfo(gameUpdate.knownStat);
    switch (gameUpdate.type) {
      case 'update':
        if (newGameState.attempts.length !== 0)
          setSubtitle(t("subtitle2"))
        if (gameUpdate.attemptVerify === undefined)
          attemptsSquare[newGameState.attempts.length as number - 1] = skip;
        else
          attemptsSquare[newGameState.attempts.length as number - 1] = incorrect;

        setFullAutoCompleteList(fullAutoCompleteList.filter(item =>
          !newGameState.attempts.some(other => other.id.toString() === item.value)));
        break;
      case 'last':
        // Handle last case
        if (gameUpdate.hasWin) {
          attemptsSquare[newGameState.attempts.length as number - 1] = correct;
          fireConfetti()
        }
        else
          attemptsSquare[newGameState.attempts.length as number - 1] = incorrect;
        setTitle(gameUpdate.hasWin ? t("gameOver.win.title") : t("gameOver.lose.title"))
        setSubtitle(gameUpdate.hasWin ? `${t("gameOver.win.message")} ${newGameState.attempts.length} ${tTools("attempts")}` : t("gameOver.lose.message"));
        setDisableInput(true)
        setClientLastUpdate(gameUpdate);
        break;
    }


  }

  useEffect(() => {
    if (!clientLastUpdate) return; // do nothing until we have data

    const id = setInterval(() => {
      const now = new Date();
      const nextUpdate = clientLastUpdate.dateToNextUpdate;
      setDifference(new Date(nextUpdate.getTime() - now.getTime()));
    }, 1000);

    return () => clearInterval(id); // cleanup when component unmounts or clientLastUpdate changes
  }, [clientLastUpdate]);


  // Run startGameClientSide only once after first render
  useEffect(() => {
    startGameClientSide();
  }, []); // [] = run only on mount




  function handleEnter(value: string) {
    setSelected(parseInt(value));
    const update = submitGuess(parseInt(value), { data: localStorage.getItem("data") as string, signature: localStorage.getItem("signature") as string }, gamemode.id);
    update.then((response) => {
      updateGame(response);
    }).catch((error) => {
      toast(`Server error : ${error}`)
    });
  }


  function displayLastDialog(clientLastUpdate: GameClientLastUpdate | null) {
    if (!clientLastUpdate) return;
    const hasWin = clientLastUpdate.hasWin;
    const album = clientLastUpdate.answer;
    const perc = Math.round(clientLastUpdate.guess / clientLastUpdate.try * 100);
    album.color = createDefaultStat()
    const songs = clientLastUpdate.answer.topSongs;
    return (
      <Card className="w-full">
        <CardHeader><span className={`sm:text-2xl text-2xl `}>{t("gameOver.subtitle")}</span></CardHeader>
        <CardContent>
          <div className="flex flex-col justify-center items-start gap-2">
            <div className="flex flex-row items-start">
              <AlbumDisplay album={album} />
              <div className="w-3/10 flex flex-col items-start">
                <span className="font-weight text-lg"> {t("currentInformation.songs")} </span>
                <ul>
                  {songs.map((song) =>
                    (<li key={song} className="font-weight text-sm">{song}</li>))}
                </ul>
              </div>
            </div>
            <span>{t("gameOver.comeOver")} {`${difference.getHours()}:${difference.getMinutes()}:${difference.getSeconds()}`}</span>
            <span> {t("gameOver.todayPerc")}&nbsp;:&nbsp;{perc}&nbsp;% </span>

          </div>
        </CardContent>
      </Card>


    );
  }

  function displayCurrentInformation(knownStat: Stat) {
    return (

      <Card className="w-full">
        <CardHeader><span className={` ${beginTransition} sm:text-2xl text-2xl `}>{t("currentInformation.title")}</span></CardHeader>
        <CardContent>
          <div className="w-full flex flex-col items-center">

            <StatMainDisplay stat={knownStat} hints={gameState?.hints} />
          </div>
        </CardContent>
      </Card>
    );
  }


  function displayCurrentHeadInfo() {
    return (

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
        {t("attemptsLeft")}: {gameState && gameState.maxAttempts! - gameState.attempts.length!}
      </div>
    );
  }

  async function fireConfetti() {
    const launches: { x: number, y: number, offset: number }[] = []
    for (let i = 0; i < 20; i++) {
      launches.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        offset: Math.random() * 200
      })
    }

    for (const launch of launches) {
      confettiRef.current?.fire(launch.x, launch.y)
      await new Promise(r => setTimeout(r,));
    }
  }


  return (
    <div className=" w-full  text-xs sm:text-sm md:text-lg
    px-2 ">
      <div className="flex flex-col justify-center items-center gap-2 mt-5">
        <div className=" text-xl sm:text-2xl md:text-3xl">{title} </div>
        <span className="text-md sm:text-lg md:text-xl">{subtitle}
          <Tooltip>
            <TooltipTrigger><CircleQuestionMark /></TooltipTrigger>
            <TooltipContent> {tRoot(`gamedata.${gamemode.title.replaceAll(" ","_").toLowerCase()}`)} </TooltipContent>
          </Tooltip>
          </span>
      </div>
      {clientLastUpdate === null && displayCurrentHeadInfo()}
      <div className="flex flex-col justify-center items-center gap-4 mt-6">
        <AutoComplete fullList={fullAutoCompleteList} onEnter={handleEnter} disabled={disabledInput} />
        <div className={`flex flex-col justify-center items-center gap-4 w-full
              ${beginTransition}`}>
          {clientLastUpdate === null && displayCurrentInformation(displayInfo)}
          {clientLastUpdate && displayLastDialog(clientLastUpdate)}
          <p className="text-xl"> {t("attemptsList")}</p>
          <div className="flex flex-col-reverse gap-4 w-full mb-4">
            <ul className="list-none divide-y divide-gray-300 ">
              {gameState?.attempts.map((album, index) => (
                <li
                  key={album.id === -1 ? `empty-${index}` : album.id}
                  className="py-2"
                >
                  <AlbumDisplay album={album} />
                </li>
              ))}
            </ul>


          </div>
        </div>
      </div>
      <Confetti ref={confettiRef} count={50} />
    </div>
  );
  function storeSecure(secure: { data: string, signature: string }) {
    localStorage.setItem("data", secure.data);
    localStorage.setItem("signature", secure.signature);
  }
}


