/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    minimumCacheTTL: 60,
    unoptimized: process.env.NODE_ENV === "development",

    // Allow Cloudinary domain
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
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
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
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

    // Ignore punycode warning
    config.ignoreWarnings = [{ module: /node_modules\/punycode/ }];

    return config;
  },
};

module.exports = nextConfig;
