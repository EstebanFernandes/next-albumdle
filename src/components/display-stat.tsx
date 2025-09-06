"use client"

import { ArrowDown, ArrowUp, Calendar, Disc, LucideIcon, MapPinned, Medal, MicVocal, Music, Users } from "lucide-react"
import { Stat } from "../types/stat"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"
import { memberCountToString } from "../lib/front.help"
import { useTranslations } from "next-intl"

export default function StatMainDisplay({
	stat
}: {
	stat: Stat
}) {


	function numericStat(value:string)
	{
		if(value.includes("↓") )
		{
			const baseValue = Number(value.replace(/[↓↑]/, '').trim());
			if(!isNaN(baseValue))
			{
				return(<span className="flex flex-row items-center">{baseValue} <ArrowDown className="h-4 sm:h-6 lg:h-7"/></span>);
			}
		}
		if(value.includes("↑"))
		{
			const baseValue = Number(value.replace(/[↓↑]/, '').trim());
			if(!isNaN(baseValue))
			{
				return(<span className="flex flex-row items-center">{baseValue} <ArrowUp className="h-4 sm:h-6 lg:h-7"/></span>);
			}
		}
		else return (<>{value}</>);
	}



interface AlbumItemProps {
  Icon: LucideIcon;
  text: React.ReactNode;
  toolTipText:string;

}
const t = useTranslations("gamePage.currentInformation");

const AlbumItem: React.FC<AlbumItemProps> = ({ Icon, text, toolTipText }) => {
  return (
    <Tooltip>
          <TooltipTrigger className={`flex items-center justify-center rounded-md sm:gap-2`}>
            <Icon className="h-4 sm:h-6 lg:h-7"/>
           <span className="text-xs lg:text-md line-clamp-1 lg:line-clamp-2 truncate 
            hover:whitespace-normal hover:overflow-visible 
            active:whitespace-normal active:overflow-visible">{text}</span>
            </TooltipTrigger>
          <TooltipContent>
            <span>{toolTipText}</span>
          </TooltipContent>
        </Tooltip>
  );
};


	return ( 
  


<div className="flex flex-row gap-2 items-start">
  <div>
    {t("artist")} : {stat.artist}
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
            <Music className="h-4 sm:h-6 lg:h-7"/>
            {stat.genres.map((genre,index)=>{
                        return <Badge key={genre} className="text-xs h-5 truncate max-w-9 " variant="default">{genre}</Badge>
                      })}
          
          </TooltipTrigger>
          <TooltipContent>
            <p>Genres of the album</p>
          </TooltipContent>
        </Tooltip>
      
	</div>
  )
}
