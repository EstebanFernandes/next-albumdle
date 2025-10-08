"use client";
import { PopoverContent } from "@radix-ui/react-popover";
import { StepForward } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Album } from "../types/albums";
import StatDisplay from "./album-stat";
import { Popover, PopoverTrigger } from "./ui/popover";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogHeader, DialogTrigger } from "./ui/dialog";
import { createPortal } from "react-dom";

//The background will randomly load 40 albums and make 2 carousels that display 20 albums each
export function AlbumDisplay({ album }: { album: Album }) {
	const [mounted, setMounted] = useState(false)
	const t = useTranslations("tools.albumDisplay")
	const [open, setOpen] = useState(false)
	useEffect(() => {
		setMounted(true);
	}, []);

	if (album.id === -1)

		return (<div className={`
			h-[20px] sm:h-[50px] md:h-[80px] lg:h-[100px] gap-2
			flex flex-col items-center justify-center
			transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
			<span className="flex gap-1">{t("albumMissing")} <StepForward /></span>
		</div>)
	return (
		<div className={`flex flex-row items-start 
			h-[50px] sm:h-[80px] md:h-[100px] lg:h-[128px] gap-2
			transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>

			<Image src={album.largeThumbnail} alt={album.title} width={128} height={128}
				className="size-[50px] sm:size-[80px] md:size-[100px] lg:size-[128px] rounded-md  aspect-square" 
				onClick={() => setOpen(true)}/>
			{open &&
				createPortal(
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
						onClick={() => setOpen(false)}
					>
						<Image src={album.largeThumbnail} alt={album.title} width={300} height={300}
							className=" rounded-md  aspect-square"
							onClick={(e) => e.stopPropagation()} // prevent closing on image click 
						/>
					</div>,
					document.body
				)}


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
