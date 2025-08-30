"use client"; 
import { Album } from "../types/albums";
import React from "react";
import { CarouselWrapper } from "./carouselWrapper";


//The background will randomly load 40 albums and make 2 carousels that display 20 albums each
export function Background({ albums }: { albums: Album[] }) {
	const leftSide1 = albums.slice(0, 10);
	const rightSide1 = albums.slice(10, 20);
	const leftSide2 = albums.slice(20, 30);
	const rightSide2 = albums.slice(30, 40);

	
	return (
		<div className="absolute pl-15 pr-15 top-0 left-0 w-full h-screen -z-100 flex flex-row justify-between blur-[2px]">
			<div className="flex flex-row gap-5">
			<CarouselWrapper albums={leftSide1} carouselDirection="forward"></CarouselWrapper>
			<CarouselWrapper albums={rightSide1} carouselDirection="backward"></CarouselWrapper>
			</div>
			<div className="flex flex-row gap-5">
			<CarouselWrapper albums={leftSide2} carouselDirection="forward"></CarouselWrapper>
			<CarouselWrapper albums={rightSide2} carouselDirection="backward"></CarouselWrapper>
			</div>
		</div>
	);
}
