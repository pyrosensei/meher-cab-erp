import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We rewrite /api to the backend for local development, avoiding CORS issues.
  // Note: For WebSocket, we don't rely on Next.js rewrites since standard fetch()
  // uses HTTP, and WS goes directly to ws://localhost:8000
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
