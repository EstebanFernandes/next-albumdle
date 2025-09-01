"use client"

import { Album } from "../types/albums"
import {  Calendar, Disc, MapPinned, Medal, MicVocal, Music, Users } from "lucide-react"
import { Badge } from "./ui/badge"


export default function StatDisplay({
  album
}: {
  album: Album
}) {
  return (  
    <div className="grid grid-cols-4 ">
      
        <div className={`flex items-center rounded-md gap-2 ${album.color.rank}`}>
          <Medal />
          {album.rank}
        </div>
        <div className={`flex items-center rounded-md gap-2 ${album.color.date}`}>
          <Calendar />
          {album.releaseDate}
        </div>
        <div className={`flex items-center rounded-md gap-2 `}>
          <Music />
          {album.genres.map((genre,index)=>{
            return <Badge key={genre} className={`${album.color.genres[index]}`} variant="default">{genre}</Badge>
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
