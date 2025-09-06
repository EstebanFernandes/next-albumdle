"use client"

import { Album } from "../types/albums"
import {  Calendar, Disc, LucideIcon, MapPinned, Medal, MicVocal, Music, Users } from "lucide-react"
import { Badge } from "./ui/badge"
import { memberCountToString } from "../lib/front.help"


export default function StatDisplay({
  album,className
}: {
  album: Album,className?:string
}) {

interface AlbumItemProps {
  Icon: LucideIcon;
  text: React.ReactNode;
  colorClass: string;
}



const AlbumItem: React.FC<AlbumItemProps> = ({ Icon, text, colorClass }) => {
  return (
    <div className={`flex items-center justify-center rounded-md sm:gap-2 ${colorClass}`}>
      <Icon className="h-4 sm:h-6 lg:h-7" />
      <span className="text-xs lg:text-md line-clamp-1 lg:line-clamp-2 truncate 
            hover:whitespace-normal hover:overflow-visible 
            active:whitespace-normal active:overflow-visible">{text}</span>
    </div>
  );
};

  return (
    <div className=" h-full flex items-center lg:gap-2.5 sm:gap-2 gap-1">
      <div className={`w-full grid grid-cols-3 h-full lg:gap-2.5 sm:gap-2 gap-1 box-border py-1.5  ${className}`}>
        <AlbumItem Icon={Medal} text={album.rank} colorClass={album.color.rank} />
        <AlbumItem Icon={Calendar} text={album.releaseDate} colorClass={album.color.date} />
        <AlbumItem Icon={MicVocal} text={album.type} colorClass={album.color.type} />
        <AlbumItem Icon={Users} text={memberCountToString(album.memberCount)} colorClass={album.color.memberCount} />
        <AlbumItem Icon={MapPinned} text={album.country} colorClass={album.color.location} />
        <AlbumItem Icon={Disc} text={album.label} colorClass={album.color.label} />
      </div>
      <div className={` h-full flex flex-col content-center rounded-md gap-1 lg:gap-1.5`}>
            <Music className="h-5 sm:h-6 lg:h-7"/>
            {album.genres.map((genre,index)=>{
              return <Badge key={genre} className={`text-xs  h-5  ${album.color.genres[index]}`} variant="secondary">{genre}</Badge>
            })}
      </div>
   </div>
    
  )
}
