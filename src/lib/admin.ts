"use server"

import crypto from 'crypto';
import { cookies } from "next/headers";

export async function  handleLogin(password: string): Promise<boolean> {
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieValue = await encodeAdminCookie(true);
    // cookies() is async here, so await it
    const cookieStore = await cookies();
    // Set signed cookie on the server
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
  // Remove the cookie
  cookieStore.delete("admin-auth");
}


const ADMIN_SECRET = process.env.ADMIN_SECRET!;

// Signs any data (not just isAdmin) safely
export async function signState(data: unknown) {
  const payload = JSON.stringify(data);
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");

  return {
    payload,    // stringified data
    signature,  // HMAC hash
  };
}

export async function  verifyState(payload: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(payload)
    .digest("hex");

  return expected === signature;
}

// Example helper: sign + encode for cookie
export async function encodeAdminCookie(isAdmin: boolean) {
  const { payload, signature } = await signState({ isAdmin });
  // Store both payload + signature in cookie
  return Buffer.from(
    JSON.stringify({ payload, signature })
  ).toString("base64");
}

// Decode + verify cookie
export async function decodeAdminCookie(cookieValue: string) {
  try {
    const decoded = JSON.parse(
      Buffer.from(cookieValue, "base64").toString("utf8")
    );

    if (!decoded.payload || !decoded.signature) return false;
    if (!verifyState(decoded.payload, decoded.signature)) return false;

    const data = JSON.parse(decoded.payload);
    return data.isAdmin === true;
  } catch {
    return false;
  }
}
