import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["astrology-insights"],
  serverExternalPackages: ["swisseph"],
};

export default nextConfig;
