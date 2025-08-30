"use client"; 
import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";
import { Carousel, CarouselContent, CarouselNext, CarouselItem } from "./ui/carousel";
import AutoScroll from 'embla-carousel-auto-scroll'
import { Album } from "../types/albums";
import { Card, CardContent } from "./ui/card";
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
			transition-opacity duration-700 ${
        mounted ? "opacity-100" : "opacity-0"}`}>

			<Image src={album.large_thumbnail} alt={album.title} width={128} height={128}
				className="rounded-md  aspect-square" />
				<div className="ml-4 flex flex-col justify-center">
					<p className="font-semibold">{album.title}</p>
					<p className="italic text-gray-800">{album.artist}</p>
				</div>
				<StatDisplay album={album}></StatDisplay>

		</div>
	);
}
