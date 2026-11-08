import type { NextConfig } from "next";

// Every page reads live Postgres data per request, so Cache Components/PPR are off (pages use `dynamic = 'force-dynamic'`).
const nextConfig: NextConfig = { basePath: "/app" };

export default nextConfig;
