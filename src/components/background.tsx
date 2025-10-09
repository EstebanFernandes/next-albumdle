"use client"
import { useEffect, useState } from "react";
import { BackgroundAlbum } from "../types/albums";
import { CarouselTestWrapper } from "./carousel-test";


function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			return window.matchMedia(query).matches;
		}
		return false; // fallback côté SSR
	});

	useEffect(() => {
		if (typeof window === "undefined") return;

		const media = window.matchMedia(query);

		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// On set l'état initial
		setMatches(media.matches);

		media.addEventListener("change", listener);
		return () => media.removeEventListener("change", listener);
	}, [query]);

	return matches;
}

//The background will randomly load 2 albums and make 2 carousels that display 10 albums each
export function Background({ albums, forward }: { albums: BackgroundAlbum[], forward: boolean }) {
	const todaySeed = Number(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
	const shuffled = seedShuffle(albums, todaySeed);
	const isMedium = useMediaQuery("(max-width: 80rem)")
	const isMobile = useMediaQuery("(max-width: 40rem)")


	const leftSide = shuffled.slice(0, 10);
	const rightSide = shuffled.slice(10, 20);



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


	if (isMobile) {

		return (<div></div>);

	}


	if (isMedium) {
		if (forward)
			return (
				<CarouselTestWrapper albums={leftSide} className="sticky left-0   " direction="forward"></CarouselTestWrapper>
			);
		else
			return (
				<CarouselTestWrapper albums={rightSide} className="sticky right-0   " direction="backward"></CarouselTestWrapper>
			);


	}
	if (forward)
		return (

			<div className="sticky left-0  flex flex-row gap-1 lg:gap-5 -z-10">
				<CarouselTestWrapper albums={leftSide} className="hidden  xl:inline " direction="forward"></CarouselTestWrapper>
				<CarouselTestWrapper albums={rightSide} className="hidden sm:inline" direction="backward"></CarouselTestWrapper>
			</div>

		);
	else
		return (

			<div className="sticky right-0   flex flex-row gap-5 -z-10">
				<CarouselTestWrapper albums={leftSide} className="hidden  xl:inline " direction="forward"></CarouselTestWrapper>
				<CarouselTestWrapper albums={rightSide} className="hidden sm:inline" direction="backward"></CarouselTestWrapper>
			</div>

		);

}



/*
	
	return (
				<div className="fixed inset-0 lg:px-14 md:px-10 sm:px-5 px-1 top-0 left-0 w-full h-screen  flex flex-row justify-around gap-6  -z-20000">
					<div className="flex flex-row gap-1 lg:gap-5">
						<CarouselTestWrapper albums={leftSide1} className=" " direction="forward"></CarouselTestWrapper>
					</div>
					<div className="  w-[100vw] sm:w-[70vw] lg:w-[50vw] md:w-[50vw] -z-100 "></div>
					<div className="flex flex-row gap-5">
						<CarouselTestWrapper albums={rightSide2} className="" direction="backward"></CarouselTestWrapper>
					</div>
				</div>
			);
	
	
	*/