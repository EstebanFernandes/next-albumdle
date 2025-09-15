"use client";
import Image from "next/image";
import { Album } from "../types/albums";
import StatDisplay from "./album-stat";
import { useEffect, useState } from "react";


//The background will randomly load 40 albums and make 2 carousels that display 20 albums each
export function AlbumDisplay({ album }: { album: Album }) {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true);
	}, []);
	return (
		<div className={`flex flex-row items-start 

			h-[50px] sm:h-[80px] md:h-[100px] lg:h-[128px] gap-2
			transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
			<Image src={album.large_thumbnail} alt={album.title} width={128} height={128}
				className="size-[50px] sm:size-[80px] md:size-[100px] lg:size-[128px] rounded-md  aspect-square" />
			<div className="ml-4 w-2/10 flex flex-col justify-center z-30" >
				<p className="font-semibold 
    line-clamp-2
    hover:line-clamp-none
    active:line-clamp-none">{album.title}</p>
				<p
  className="
    italic text-muted-foreground
    truncate
    hover:overflow-visible
	active:overflow-visible
	 transition-all duration-500 ease-in-out
  "
>
  {album.artist}
</p>

			</div>
			<StatDisplay album={album} className="w-5/10 ml-auto"></StatDisplay>
		</div>
	);
}
