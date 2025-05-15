import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { OfflineNotification } from '@/components/offline-notification';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { BackgroundSyncInit } from '@/components/background-sync-init';
import { NotificationPermission } from '@/components/notification-permission';
import { InstallPrompt } from '@/components/install-prompt';
import { SplashScreen } from '@/components/splash-screen';
import { NetworkStatus } from '@/components/network-status';
import { SyncIndicator } from '@/components/sync-indicator';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vendor.dodoservices.com'),
  title: {
    default: 'Dodo Services - Vendor Portal',
    template: '%s | Dodo Vendor Portal',
  },
  description:
    'Manage your services, bookings, and customer interactions as a service provider on Dodo Services. Join our network of trusted professionals.',
  keywords: [
    'vendor portal',
    'service provider',
    'home services',
    'manage bookings',
    'service management',
    'professional services',
  ],
  manifest: '/manifest.json',
  applicationName: 'Dodo Services Vendor Portal',
  authors: [{ name: 'Dodo Services Team' }],
  creator: 'Dodo Services',
  publisher: 'Dodo Services',
  category: 'Home Services',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vendor.dodoservices.com',
    title: 'Dodo Services - Vendor Portal',
    description:
      'Manage your services, bookings, and customer interactions as a service provider on Dodo Services.',
    siteName: 'Dodo Services Vendor Portal',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dodo Services - Vendor Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dodo Services - Vendor Portal',
    description:
      'Manage your services, bookings, and customer interactions as a service provider on Dodo Services.',
    images: ['/images/twitter-image.jpg'],
    creator: '@dodoservices',
    site: '@dodoservices',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dodo Vendor',
  },
  formatDetection: {
    telephone: true,
  },
  alternates: {
    canonical: 'https://vendor.dodoservices.com',
    languages: {
      'en-US': 'https://vendor.dodoservices.com/en-US',
      'es-ES': 'https://vendor.dodoservices.com/es-ES',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      me: ['vendors@dodoservices.com'],
    },
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Dodo Vendor" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SplashScreen />
        <NetworkStatus />
        <SyncIndicator />
        {children}
        <OfflineNotification />
        <ServiceWorkerRegister />
        <InstallPrompt />
        <BackgroundSyncInit />
        <NotificationPermission />
      </body>
    </html>
  );
}
