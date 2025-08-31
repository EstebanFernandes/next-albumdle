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
		<div className="fixed lg:px-14 md:px-10 sm:px-5 px-1 top-0 left-0 w-full h-screen -z-100 flex flex-row justify-around gap-6">
			<div className="flex flex-row gap-1 lg:gap-5">
			<CarouselWrapper albums={leftSide1} className="hidden  xl:inline "  carouselDirection="forward"></CarouselWrapper>
			<CarouselWrapper albums={rightSide1} carouselDirection="backward"></CarouselWrapper>
			</div>
			<div className="  w-[70vw] lg:w-[50vw] md:w-[50vw] "></div>
			<div className="flex flex-row gap-5">
			<CarouselWrapper albums={leftSide2} className="hidden  xl:inline " carouselDirection="forward"></CarouselWrapper>
			<CarouselWrapper albums={rightSide2} carouselDirection="backward"></CarouselWrapper>
			</div>
		</div>
	);
}
