import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
const nextConfig: NextConfig = {
  //Image config enable nextJs server to fetch image from the following URLs
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.discogs.com",
        port: "",       // optional
        pathname: "/**", // optional wildcard
      },
       {
        protocol: "https",
        hostname: "yswbiepvzlzxgyyuffpx.supabase.co",
        pathname: "/storage/v1/object/public/image_hint/**", // only this folder
      }
    ],
  },
};
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
