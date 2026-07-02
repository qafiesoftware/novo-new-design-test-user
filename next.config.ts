import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "readymadeui.com",
      },
      {
        protocol: "https",
        hostname: "testmember.novotrend.co",
      },
      {
        protocol: "https",
        hostname: "flagsapi.com",
      },
      {
        protocol: "https",
        hostname: "sin1.contabostorage.com",
      },
      {
        protocol: "https",
        hostname: "newapi.novotrend.co",
      },
      {
        protocol: "https",
        hostname: "quickchart.io",
      },
      {
        protocol: "https",
        hostname: "ntapi.novotrend.co",
      },
      {
        protocol: "https",
        hostname: "mynewadmin.novotrend.co",
      },

      {
        protocol: "https",
        hostname: "**.novotrend.co",
      },
    ],
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;