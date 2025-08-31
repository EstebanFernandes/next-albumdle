"use client"; 
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import AutoScroll from 'embla-carousel-auto-scroll'
import { Album } from "../types/albums";
import React from "react";

type CarouselWrapperProps = {
	albums: Album[]
	carouselDirection: "forward" | "backward"
	className?: string
}

//The background will randomly load 40 albums and make 2 carousels that display 20 albums each
export function CarouselWrapper({ albums, carouselDirection,className="" }: CarouselWrapperProps) {

	return (
   <Carousel
    opts={{
        align: "start",
        loop: true,
        watchDrag: false,
        axis: "y",
    }}
    orientation="vertical"
    plugins={[
        AutoScroll({
            direction: carouselDirection,  // Use direction instead of speed
            speed: 0.5,                    // Adjust speed as needed (slower = smoother)
            playOnInit: true,
            stopOnInteraction: false,
        }),
    ]}
    className={`w-[50px] xs:w-[70px] sm:w-[70px] lg:w-[120px] overflow-hidden ${className}`}
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
