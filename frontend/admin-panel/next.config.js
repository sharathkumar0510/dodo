/** @type {import('next').NextConfig} */
const { ADMIN_PANEL_PORT } = require('../../ports.config');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['dodoservices.com'],
  },
  // PWA configuration
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: false,
  },
  // Ensure the app always runs on the standard port
  devServer: {
    port: ADMIN_PANEL_PORT,
  },
  // Custom webpack configuration
  webpack: (config, { isServer }) => {
    // Add any custom webpack configurations here
    return config;
  },
};

module.exports = nextConfig;
