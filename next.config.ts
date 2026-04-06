import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["personal-task-tracker-core"],
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
