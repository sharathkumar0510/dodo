import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  /* config options here */
};

// Define custom cache strategies for different types of content
const runtimeCaching = [
  {
    // Cache static assets like images, fonts, and stylesheets
    urlPattern:
      /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      },
    },
  },
  {
    // Cache API responses
    urlPattern: /^https:\/\/.*\/api\/.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      },
      networkTimeoutSeconds: 10,
    },
  },
  {
    // Cache Google Fonts stylesheets
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'google-fonts-stylesheets',
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  },
  {
    // Cache Google Fonts webfont files
    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-webfonts',
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      },
    },
  },
  {
    // Cache pages
    urlPattern: /^https:\/\/.*\/(?!api\/)/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'pages-cache',
      expiration: {
        maxEntries: 30,
        maxAgeSeconds: 60 * 60, // 1 hour
      },
    },
  },
  {
    // Fallback cache for everything else
    urlPattern: /.*$/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'fallback-cache',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 5, // 5 minutes
      },
    },
  },
];

const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching,
})(nextConfig);

export default pwaConfig;
