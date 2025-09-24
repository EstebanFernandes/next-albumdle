"use client";
import Image from "next/image";
import { Album, BackgroundAlbum } from "../types/albums";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

type CarouselWrapperProps = {
    albums: BackgroundAlbum[]
    direction: "forward" | "backward"
    className?: string,
    speed?: number // default: 20s
}
//The background will randomly load 40 albums and make 2 carousels that display 20 albums each
export function CarouselTestWrapper({ albums, direction, className = "", speed = 20 }: CarouselWrapperProps) {

    const entireClassName = `w-[35px] sm:w-[70px] lg:w-[120px] h-full z-200 relative h-[500px] overflow-hidden ${className}`

     const doubledAlbums = [...albums,...albums]
    return (
        <>
            <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        @keyframes scroll-reverse {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll-reverse {
          animation: scroll-reverse 30s linear infinite;
        }
      `}</style>

            <div className={entireClassName}>
                <div className={`flex flex-col ${direction === "forward" ? "animate-scroll-reverse" : "animate-scroll"}`}>
                    {doubledAlbums.map((album, idx) => (
                        <div key={`${album.id}-${idx}`} className="relative group py-3">
                            <Image
                                src={album.thumbnail}
                                alt={album.title}
                                width={120}
                                height={120}
                                style={{ transform: `scale(${album.scale / 100})` }}
                                className={`rounded-md w-[120px] h-[120px] object-cover aspect-square `}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
