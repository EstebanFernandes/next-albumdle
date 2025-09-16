"use server";

import { cookies } from "next/headers";

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

const ADMIN_SECRET = process.env.ADMIN_SECRET!;

/**
 * Helper: derive a CryptoKey from the secret string
 */
async function getHmacKey() {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(ADMIN_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Signs any data with HMAC-SHA256
 */
export async function signState(data: unknown) {
  const payload = JSON.stringify(data);
  const key = await getHmacKey();
  const enc = new TextEncoder();

  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const signature = Buffer.from(sigBuf).toString("hex");

  return {
    payload,   // stringified data
    signature, // HMAC hex string
  };
}

/**
 * Verifies payload + signature
 */
export async function verifyState(payload: string, signature: string) {
  const key = await getHmacKey();
  const enc = new TextEncoder();

  const sigBuf = Buffer.from(signature, "hex");
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBuf,
    enc.encode(payload)
  );

  return ok;
}

/**
 * Encodes signed state into a cookie-safe base64 string
 */
export async function encodeAdminCookie(isAdmin: boolean) {
  const { payload, signature } = await signState({ isAdmin });
  return Buffer.from(JSON.stringify({ payload, signature })).toString("base64");
}

/**
 * Decodes + verifies cookie value
 */
export async function decodeAdminCookie(cookieValue: string) {
  try {
    const decoded = JSON.parse(
      Buffer.from(cookieValue, "base64").toString("utf8")
    );

    if (!decoded.payload || !decoded.signature) return false;
    const valid = await verifyState(decoded.payload, decoded.signature);
    if (!valid) return false;

    const data = JSON.parse(decoded.payload);
    return data.isAdmin === true;
  } catch {
    return false;
  }
}
