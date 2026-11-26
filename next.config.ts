import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the work list lives on the home page; old /work links land there
  async redirects() {
    return [{ source: "/work", destination: "/#work", permanent: true }];
  },
};

export default nextConfig;
