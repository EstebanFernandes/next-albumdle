// app/admin/layout.tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { getAllGamemodes } from "@/src/lib/gamemode";
import { getGameModes } from "@/src/utils/supabase";
import { ReactNode } from "react";

export default async function  AdminLayout({ children }: { children: ReactNode }) {
  const allGamemode = await getAllGamemodes();
  console.log("gamemodes : ",allGamemode)
  return (
    <div>
      <header className="">
        <h1>Admin Dashboard</h1>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Gamemode" />
          </SelectTrigger>
          <SelectContent>
            {allGamemode.map((gamemode,index) => {
              return (
                <SelectItem value={gamemode.mode.id.toString()} key={gamemode.mode.id.toString().concat(index.toString())}>
                  {gamemode.mode.title}
                </SelectItem>)
            })}
          </SelectContent>
        </Select>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
