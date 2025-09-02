"use client"

import { Album } from "../types/albums"
import {  Calendar, Disc, MapPinned, Medal, MicVocal, Music, Users } from "lucide-react"
import { Badge } from "./ui/badge"


export default function StatDisplay({
  album,className
}: {
  album: Album,className?:string
}) {
  return (
    <div className={`grid grid-cols-4 h-full gap-3 box-border py-1.5 ${className}`}>
      <div className={`flex items-center rounded-md gap-2 ${album.color.rank}`}>
          <Medal />
          {album.rank}
        </div>
        <div className={`flex items-center rounded-md gap-2 ${album.color.date}`}>
          <Calendar />
          {album.releaseDate}
        </div>
        <div className={`flex items-center rounded-md `}>
          <Music className="pr-2"/>
          {album.genres.map((genre,index)=>{
            return <Badge key={genre} className={`text-sm ${album.color.genres[index]}`} variant="outline">{genre}</Badge>
          })}
        </div>
        <div className={`flex items-center rounded-md gap-2 ${album.color.type}`}>
          <MicVocal />
          {album.type}
        </div>
        <div className={`flex items-center rounded-md gap-2 ${album.color.memberCount}`}>
          <Users />
          {album.memberCount}
        </div>
        <div className={`flex items-center rounded-md gap-2 ${album.color.location}`}>
          <MapPinned />
          {album.country}
        </div>
        <div className={`flex items-center rounded-md gap-2 ${album.color.label}`}>
          <Disc />
          {album.label}
        </div>
    </div>
  )
}
