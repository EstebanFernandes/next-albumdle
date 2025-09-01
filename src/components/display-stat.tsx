"use client"

import { ArrowDown, ArrowUp, Calendar, Disc, MapPinned, Medal, MicVocal, Music, Users } from "lucide-react"
import { Stat } from "../types/stat"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"

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
				return(<><span>{baseValue}</span><ArrowDown /></>);
			}
		}
		if(value.includes("↑"))
		{
			const baseValue = Number(value.replace(/[↓↑]/, '').trim());
			if(!isNaN(baseValue))
			{
				return(<><span>{baseValue}</span><ArrowUp /></>);
			}
		}
		else return (<>{value}</>);
	}
	return ( 
<div className="flex flex-row gap-2 items-start">
  <div>
    Artist : {stat.artist}
  </div>
		<div className="grid grid-cols-4">
			<div>
				<Tooltip>
          <TooltipTrigger className={`flex items-center gap-2 `}><Medal />
          {numericStat(stat.rank)}</TooltipTrigger>
          <TooltipContent>
            <p>Ranking of the album</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
				<Tooltip>
          <TooltipTrigger className={`flex items-center gap-2 `}>
            <Calendar />
          {numericStat(stat.date)}</TooltipTrigger>
          <TooltipContent>
            <p>Release year of the album</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
				<Tooltip>
          <TooltipTrigger className={`flex items-center gap-2 `}>
            <Music />
            {stat.genres.map((genre,index)=>{
                        return <Badge key={genre}  variant="default">{genre}</Badge>
                      })}
          
          </TooltipTrigger>
          <TooltipContent>
            <p>Genres of the album</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
				<Tooltip>
          <TooltipTrigger className={`flex items-center gap-2 `}>
            <MicVocal />
          {stat.type}</TooltipTrigger>
          <TooltipContent>
            <p>Type of the album</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
				<Tooltip>
          <TooltipTrigger className={`flex items-center gap-2 `}>
            <Users />
          {stat.memberCount}</TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Solo/Duo or group</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
				<Tooltip>
          <TooltipTrigger className={`flex items-center gap-2 `}>
            <MapPinned />
          {stat.location}</TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Origin country of the artist</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div>
				<Tooltip>
          <TooltipTrigger className={`flex items-center gap-2 `}>
            <Disc />
          {stat.label}</TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Label that produces the album</p>
          </TooltipContent>
        </Tooltip>
      </div>
	</div>
	</div>
  )
}
