import path from "node:path";
import type { NextConfig } from "next";

const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:5000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The repo root holds the Fastify server and its own lockfile; keep Turbopack scoped to web/.
  turbopack: { root: path.resolve(import.meta.dirname) },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
      {
        source: "/health",
        destination: `${apiOrigin}/health`,
      },
    ];
  },
};

export default nextConfig;
