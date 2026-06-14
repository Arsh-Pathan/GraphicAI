import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  // @ts-expect-error - allowedDevOrigins might not be in the types yet
  allowedDevOrigins: ["192.168.11.92"],
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "clsx", "tailwind-merge"],
  },
};

export default nextConfig;
