import AdminComponent from "@/src/components/admin";
import { getAlbums } from "@/src/lib/csv";

export default function Page() {
  return (
      <AdminComponent albums={getAlbums()}></AdminComponent>
  );
}
