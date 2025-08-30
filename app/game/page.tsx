
import { MainComponent } from "@/src/components/main-component";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { getAlbums } from "@/src/lib/csv";
import Image from "next/image";

export default function Page() {
  return (
    <div>
   <MainComponent albums={getAlbums()} />
         </div>
  );
}
