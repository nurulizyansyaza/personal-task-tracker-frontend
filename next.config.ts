import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["personal-task-tracker-core"],
};

export default nextConfig;
