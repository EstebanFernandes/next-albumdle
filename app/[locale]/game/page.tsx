import { MainComponent } from "@/src/components/main-component";
import { getAlbums, getGamemode } from "@/src/lib/gamemode";

interface GamePageProps {
  searchParams: { gID?: number; };
}

export default async function GamePage({ searchParams }: GamePageProps) {
  let { gID } = await searchParams;
  if(gID===undefined)
    gID = 1
  const albums = await getAlbums(gID) ?? []
  const gamemode = await getGamemode(gID)
  if (gamemode) {
    return (
        <MainComponent albums={albums} gamemode={gamemode} />
    );

  } return (
    <div>
      There has been a problem
    </div>
  );
}
