import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/why-trust-southernvt", destination: "/why-trust-madeinvt", permanent: true },
    ];
  },
};

export default nextConfig;
