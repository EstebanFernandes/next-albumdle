import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.discogs.com",
        port: "",       // optional
        pathname: "/**", // optional wildcard
      },
    ],
  },
};

export default nextConfig;
