/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === "production" ? "/html-card-game" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/html-card-game/" : "",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
