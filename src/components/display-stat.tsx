"use client"

import { ArrowDown, ArrowUp, Calendar, Disc, LucideIcon, MapPinned, Medal, MicVocal, Music, Users } from "lucide-react"
import { baseStat, Stat } from "../types/stat"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"
import { memberCountToString } from "../lib/front.help"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { hintState } from "../types/game-state"
import { useEffect } from "react"
import * as Icons from "lucide-react";
import { Button } from "./ui/button"
import { Dialog,DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"

export default function StatMainDisplay({
  stat, hints
}: {
  stat: Stat,
  hints: hintState[] | undefined
}) {


  function numericStat(value: string) {
    if (value.includes("↓")) {
      const baseValue = Number(value.replace(/[↓↑]/, '').trim());
      if (!isNaN(baseValue)) {
        return (<span className="flex flex-row items-center">{baseValue} <ArrowDown className="h-4 sm:h-6 lg:h-7" /></span>);
      }
    }
    if (value.includes("↑")) {
      const baseValue = Number(value.replace(/[↓↑]/, '').trim());
      if (!isNaN(baseValue)) {
        return (<span className="flex flex-row items-center">{baseValue} <ArrowUp className="h-4 sm:h-6 lg:h-7" /></span>);
      }
    }
    else return (<>{value}</>);
  }



  interface AlbumItemProps {
    Icon: LucideIcon;
    text: React.ReactNode;
    toolTipText: string;

  }

  interface HintItemProps {
    type: 'cover' | 'tracks';
    label: string;
    available: number;
    value: string;

  }
  useEffect(() => {
    console.log("Icon is", hints);
  }, [hints]);
  const t = useTranslations("gamePage.currentInformation");
  const tTools = useTranslations("tools");
  const animationReveal = "animate-ping"
  //Function use to factorize the album item display
  const AlbumItem: React.FC<AlbumItemProps> = ({ Icon, text, toolTipText }) => {
    useEffect(() => {

    }, [text])
    return (
      <Tooltip >
        <TooltipTrigger className={`flex items-center justify-center rounded-md sm:gap-2`}>
          <Icon className="h-4 sm:h-6 lg:h-7" />
          <span className={`text-xs lg:text-md line-clamp-1 lg:line-clamp-2 truncate 
            hover:whitespace-normal hover:overflow-visible 
            active:whitespace-normal active:overflow-visible ${text !== baseStat ? "" : "text-muted-foreground"}`}>{text}</span>
        </TooltipTrigger>
        <TooltipContent>
          <span>{toolTipText}</span>
        </TooltipContent>
      </Tooltip>
    );
  };



  const HintItem: React.FC<HintItemProps> = ({ type, label, available, value }) => {
    if (available !== 0) return (
      <div>
        <span className="flex flex-col justify-center ">
          <span> {t("hintAvailable")} {available}</span>
        </span>
      </div>);

    if (type === "cover") {
      return (
        <div>
          <Image src={value} alt={label} width={300} height={300} className="rounded-md" />
        </div>
      );
    }
    if (type === "tracks")
      return (
        <span className={`flex flex-col items-start gap-1`}>
          <ul>{value.split(";").map((song) => (
            <li key={song}>{song}</li>
          ))}</ul>
        </span>
      );
  };

  const HintDisplay: React.FC<hintState> = ({ type, iconName, label, available, value }) => {
    const Icon = Icons[iconName] as LucideIcon;
    if (!Icon) return null; // fallback for invalid icon name
    if (available !== 0)
      return (
        <Tooltip key={type}>
          <TooltipTrigger asChild>
            <span className="h-full flex flex-col content-center rounded-md gap-1 lg:gap-1.5">
              <Button
                variant="outline"
                size="icon"
                disabled={true}
                className="p-0 "
              >
                <Icon className="h-4 sm:h-6 lg:h-7" />
              </Button>
            </span>
          </TooltipTrigger>

          <TooltipContent>
            <HintItem
              key={type}
              type={type}
              label={label}
              available={available}
              value={value ?? ""}
            />
          </TooltipContent>
        </Tooltip>

      );

    if (available === 0)
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="p-0" size="icon">
              <Icon className="h-4 sm:h-6 lg:h-7" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-auto">
            <DialogHeader>
              <DialogTitle className="pr-4">{t(label)}</DialogTitle>
            </DialogHeader>
            <HintItem key={type} type={type} label={label} available={available} value={value ? value : ""} />
          </DialogContent>
        </Dialog>
      );
  }

  function hintsDisplay(hints: hintState[] | undefined) {
    if (!hints || hints.length === 0) return null;

    return (<div className="flex flex-col gap-1 items-center">
      {hints.map((hint) =>
        <HintDisplay key={hint.type} {...hint} />
      )}
    </div>
    );


  }


  return (
    <div className=" w-full flex flex-row gap-2 items-start">
      <div>{t("hints")}
        {hintsDisplay(hints)}
      </div>
      <div>
        {t("artist")} <span className={stat.artist === baseStat ? "" : animationReveal}>{stat.artist}</span>
      </div>
      <div className="w-full grid grid-cols-3 h-full lg:gap-3 sm:gap-2 gap-1 box-border">
        <AlbumItem Icon={Medal} text={numericStat(stat.rank)} toolTipText={t("tooltips.rank")} />
        <AlbumItem Icon={Calendar} text={numericStat(stat.date)} toolTipText={t("tooltips.year")} />
        <AlbumItem Icon={MicVocal} text={stat.type} toolTipText={t("tooltips.albumType")} />
        <AlbumItem Icon={Users} text={stat.memberCount} toolTipText={t("tooltips.memberCount")} />
        <AlbumItem Icon={MapPinned} text={stat.location} toolTipText={t("tooltips.location")} />
        <AlbumItem Icon={Disc} text={stat.label} toolTipText={t("tooltips.label")} />

      </div>

      <Tooltip>
        <TooltipTrigger className={` h-full flex flex-col content-center rounded-md gap-1 lg:gap-1.5 `}>
          <Music className="h-4 sm:h-6 lg:h-7" />
          {stat.genres.map((genre, index) => {
            return <Badge key={index} className="text-xs h-5 truncate max-w-9 " variant="default">{genre}</Badge>
          })}

        </TooltipTrigger>
        <TooltipContent>
          <p>Genres of the album</p>
        </TooltipContent>
      </Tooltip>

    </div>
  )
}
