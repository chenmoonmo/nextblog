/** @type {import('next').NextConfig} */
const path = require("path");

const withPWA = require("next-pwa");

const nextConfig = {
  pwa: {
    dest: "public",
    customWorkerDir: "./worker",
  },
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    domains: ["www.notion.so", "s3.us-west-2.amazonaws.com"],
  },
  compress: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
