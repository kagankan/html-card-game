/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: process.env.BASE_PATH ?? "",
  assetPrefix: process.env.BASE_PATH ? `${process.env.BASE_PATH}/` : "",
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
