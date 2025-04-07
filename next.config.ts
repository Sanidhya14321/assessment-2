import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://your-production-domain.com",
  },
};

export default nextConfig;
