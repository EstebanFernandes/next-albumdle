import AdminComponent from "@/src/components/admin";
import { getAlbums } from "@/src/lib/gamemode";

export  default async function Page() {
  const albums = await getAlbums(1) ?? []
  return (
      <AdminComponent albums={albums}></AdminComponent>
  );
}
