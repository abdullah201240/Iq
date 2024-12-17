import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,

  images: {
    domains: ["localhost", "tailwindcss.com", "192.168.68.188"],
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /\.(mp4|webm|ogg|mov)$/,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[hash][ext]",
        },
      });
    }

    return config;
  },

  async headers() {
    return [
      {
        source: "/:path*.mp4", // Match .mp4 files
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.webm", // Match .webm files
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.ogg", // Match .ogg files
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.mov", // Match .mov files
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
