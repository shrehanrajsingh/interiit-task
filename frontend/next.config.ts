import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // This enables the ability to see this app on other devices on the network
  // when developing by running `npm run dev` which is helpful for testing
  // mobile devices.
  reactStrictMode: true,
};

export default nextConfig;
