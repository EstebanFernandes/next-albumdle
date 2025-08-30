"use client"; 
import Image from "next/image";
import { CircleQuestionMark } from "lucide-react";
import { Carousel, CarouselContent, CarouselNext, CarouselItem } from "./ui/carousel";
import AutoScroll from 'embla-carousel-auto-scroll'
import { Album } from "../types/albums";
import React from "react";

type CarouselWrapperProps = {
	albums: Album[]
	carouselDirection: "forward" | "backward"
}

//The background will randomly load 40 albums and make 2 carousels that display 20 albums each
export function CarouselWrapper({ albums, carouselDirection }: CarouselWrapperProps) {

	return (
   <Carousel
    opts={{
        align: "start",
        loop: true,
        watchDrag: false,
        axis: "y",
        containScroll: "keepSnaps"
    }}
    orientation="vertical"
    plugins={[
        AutoScroll({
            direction: carouselDirection,  // Use direction instead of speed
            speed: 0.5,                    // Adjust speed as needed (slower = smoother)
            playOnInit: true,
            stopOnInteraction: false,
            startDelay: 0,                 // Start immediately
            active: true,                  // Ensure it's always active
            
        }),
    ]}
    className="w-[120px] overflow-hidden"
>
	<CarouselContent >
		{albums.map((album) => (
			<CarouselItem key={album.id} className="relative group lg:basis-1/5 sm:basis-1/3" >
				<Image src={album.small_thumbnail} alt={album.title} width={100} height={100}
					className="rounded-md w-full h-full object-cover aspect-square" />
			</CarouselItem>
		))}
	</CarouselContent>
		</Carousel>

	);
}
