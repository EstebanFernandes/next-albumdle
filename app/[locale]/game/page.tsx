
import { MainComponent } from "@/src/components/main-component";
import { getAlbums } from "@/src/lib/csv";

export default function Page() {
  return (
    <div>
   <MainComponent albums={getAlbums()} />
         </div>
  );
}
