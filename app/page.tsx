
import { MainComponent } from "@/src/components/main-component";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { getAlbums } from "@/src/lib/csv";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="lg:w-[70vw] sm:w-[100vw] flex flex-col justify-center items-center gap-10 mt-50 mb-10">
      <p className=" lg:text-4xl md:text-3xl ">Your guessing game about music albums</p>
      <p className="text-2xl">Try to guess today's random album from the Rollings stone's best 500 albums of all time</p>
      <Button className="h-15 rounded-2xl px-6 text-2xl"><Link href="/game">Right here </Link></Button>
        </div>
  );
}
