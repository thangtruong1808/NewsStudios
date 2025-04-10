/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["srv876-files.hstgr.io"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "srv876-files.hstgr.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // Ensure environment variables are loaded
  env: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignore specific files that cause issues
      config.resolve.alias = {
        ...config.resolve.alias,
        "@mapbox/node-pre-gyp": false,
        "oidc-token-hash": false,
      };

      // Add fallbacks for browser polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        util: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
