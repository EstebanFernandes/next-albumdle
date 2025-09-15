import sharp from "sharp";
import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

// where cached images will live (inside .next/cache or your own folder)
const CACHE_DIR = path.join(process.cwd(), "public", "cache",);

export async function getHintImage(url: string, blur = 20) {

    console.log("Getting hint image for url:", url);
  await fs.mkdir(CACHE_DIR, { recursive: true });

  // hash the url+blur as cache key
  const key = crypto.createHash("md5").update(url + blur).digest("hex");
  const cacheFile = path.join(CACHE_DIR, `${key}.jpg`);

  // if cached, return path
  try {
    await fs.access(cacheFile);
    return `/cache/${key}.jpg`;
  } catch {
    // not cached, generate it
  }

  // fetch image
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());

  // process with sharp
  const processed = await sharp(buffer)
    .resize(300, 300, { fit: "cover" }) // adjust as needed
    .blur(blur) // apply blur
    .toFormat("jpeg")
    .toBuffer();

  // write to cache
  await fs.writeFile(cacheFile, processed);

  return `/cache/${key}.jpg`;
}
