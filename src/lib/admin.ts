"use server";

import { cookies } from "next/headers";
import { DBretrieveAlbumById, getMonthPick } from "../utils/supabase";
import { encodeAdminCookie } from "../utils/crypto.helper";

export async function handleLogin(password: string): Promise<boolean> {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieValue = await encodeAdminCookie(true);
    const cookieStore = await cookies();

    cookieStore.set("admin-auth", cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return true;
  }

  return false;
}

export async function handleLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-auth");
}



//Get each id for a given day of the month, input as format yyyymm
export async function getMonthDate(yearmonth: number): Promise<
  {
    id: number;
    date: number | null;
  }[]>
  {
    return getMonthPick(yearmonth);
}

export async function retrieveAlbumById(id:number) {
  console.log(`Retrieving album of the day from DB with id : ${id}`)
 return DBretrieveAlbumById(id)
}
