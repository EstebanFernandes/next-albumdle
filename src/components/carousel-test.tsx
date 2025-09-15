"use client"; 
import Image from "next/image";
import { Album } from "../types/albums";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

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
  
  
    }}
    orientation="vertical"
    plugins={[/*
        AutoScroll({
            direction: carouselDirection,  // Use direction instead of speed
            speed: 0.5,                    // Adjust speed as needed (slower = smoother)
            playOnInit: true,
            stopOnInteraction: false,
        }),
    */]}
    className={`w-[35px] sm:w-[70px] lg:w-[120px] h-full z-200 ${className}`}
>
	<CarouselContent >
		{albums.map((album) => (
			<CarouselItem key={album.id} className="relative group  py-10 sm:py-5 md:py-4 lg:py-3" >
				<Image src={album.small_thumbnail} alt={album.title} width={100} height={100}
					className="rounded-sm sm:rounded-md w-full h-full object-cover aspect-square" />
			</CarouselItem>
		))}
	</CarouselContent>
		</Carousel>

	);
}
