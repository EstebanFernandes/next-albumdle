"use server";
import crypto from "crypto";
import sharp from "sharp";
import { uploadToSupabase } from "../utils/supabase";

const BUCKET = "images"; // create a bucket in Supabase Storage
let imageHint=""
export async function getHintImage(url: string, blur = 20): Promise<string> {
  const {buffer,key} = await processImage(url,blur)
  imageHint = await uploadToSupabase(key,buffer);
  return imageHint
}
export async function processImage(url: string, blur = 20): Promise<{ buffer: Buffer; key: string }> {
  const key = crypto.createHash("md5").update(url + blur).digest("hex");
  const fileName = `${key}.jpg`;

  // Fetch original image
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  // Process image
  const processed = await sharp(buffer)
    .resize(300, 300, { fit: "cover" })
    .blur(blur)
    .toFormat("jpeg")
    .toBuffer();

  return { buffer: processed, key: fileName };
}