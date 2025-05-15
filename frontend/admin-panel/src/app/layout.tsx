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
  title: 'Dodo Services - Admin Panel',
  description: 'Admin panel for managing Dodo Services platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dodo Admin',
  },
  formatDetection: {
    telephone: true,
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
        <meta name="apple-mobile-web-app-title" content="Dodo Admin" />
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
