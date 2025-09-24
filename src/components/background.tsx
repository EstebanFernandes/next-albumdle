import { Album, BackgroundAlbum } from "../types/albums";
import React from "react";
import { CarouselWrapper } from "./carouselWrapper";
import { CarouselTestWrapper } from "./carousel-test";


//The background will randomly load 40 albums and make 2 carousels that display 20 albums each
export function Background({ albums }: { albums: Album[] }) {
	const todaySeed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
	const bgAlbums = toBackgroundAlbums(albums);
	const shuffled = seedShuffle(bgAlbums, todaySeed);

  const leftSide1 = shuffled.slice(0, 10);
  const rightSide1 = shuffled.slice(10, 20);
  const leftSide2 = shuffled.slice(20, 30);
  const rightSide2 = shuffled.slice(30, 40);
	function toBackgroundAlbums(albums: Album[]): BackgroundAlbum[] {
		return albums.map(album => ({
			id: album.id,
			title: album.title,
			thumbnail: album.small_thumbnail,
			scale: getDeterministicScale(album.id),
		}));
	}
	function getDeterministicScale(albumId: number): number {
		const todaySeed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
		const hash = (albumId * 9301 + 49297 + todaySeed) % 100; // pseudo-random
		return 75 + (hash % 26); // 75-100
	}

	function seedShuffle<T>(array: T[], seed: number): T[] {
		const arr = [...array];
		for (let i = arr.length - 1; i > 0; i--) {
			seed = (seed * 9301 + 49297) % 233280;
			const rand = seed / 233280;
			const j = Math.floor(rand * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	return (
		<div className="fixed lg:px-14 md:px-10 sm:px-5 px-1 top-0 left-0 w-full h-screen  flex flex-row justify-around gap-6  -z-20000">
			<div className="flex flex-row gap-1 lg:gap-5">
				<CarouselTestWrapper albums={leftSide1} className="hidden  xl:inline " direction="forward"></CarouselTestWrapper>
				<CarouselTestWrapper albums={rightSide1} className="hidden sm:inline" direction="backward"></CarouselTestWrapper>
			</div>
			<div className="  w-[100vw] sm:w-[70vw] lg:w-[50vw] md:w-[50vw] -z-100 "></div>
			<div className="flex flex-row gap-5">
				<CarouselTestWrapper albums={leftSide2} className="hidden  xl:inline " direction="forward"></CarouselTestWrapper>
				<CarouselTestWrapper albums={rightSide2} className="hidden sm:inline" direction="backward"></CarouselTestWrapper>
			</div>
		</div>
	);
}
