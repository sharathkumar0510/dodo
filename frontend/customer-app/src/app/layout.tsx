import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/auth-context';
import { OfflineNotification } from '@/components/offline-notification';
import { ServiceWorkerRegister } from '@/components/service-worker-register';
import { InstallPrompt } from '@/components/install-prompt';
import { AppShell } from '@/components/app-shell';
import { BackgroundSyncInit } from '@/components/background-sync-init';
import { NotificationPermission } from '@/components/notification-permission';
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
  metadataBase: new URL('https://dodoservices.com'),
  title: {
    default: 'Dodo Services - Home Services Booking Platform',
    template: '%s | Dodo Services',
  },
  description:
    'Book trusted home services like cleaning, plumbing, electrical, and more. Professional service providers at your doorstep with Dodo Services.',
  keywords: [
    'home services',
    'cleaning services',
    'plumbing services',
    'electrical services',
    'home maintenance',
    'service booking',
    'professional services',
  ],
  manifest: '/manifest.json',
  applicationName: 'Dodo Services',
  authors: [{ name: 'Dodo Services Team' }],
  creator: 'Dodo Services',
  publisher: 'Dodo Services',
  category: 'Home Services',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dodoservices.com',
    title: 'Dodo Services - Home Services Booking Platform',
    description:
      'Book trusted home services like cleaning, plumbing, electrical, and more. Professional service providers at your doorstep.',
    siteName: 'Dodo Services',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Dodo Services - Home Services Booking Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dodo Services - Home Services Booking Platform',
    description:
      'Book trusted home services like cleaning, plumbing, electrical, and more. Professional service providers at your doorstep.',
    images: ['/images/twitter-image.jpg'],
    creator: '@dodoservices',
    site: '@dodoservices',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dodo Services',
  },
  formatDetection: {
    telephone: true,
  },
  alternates: {
    canonical: 'https://dodoservices.com',
    languages: {
      'en-US': 'https://dodoservices.com/en-US',
      'es-ES': 'https://dodoservices.com/es-ES',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
    other: {
      me: ['info@dodoservices.com'],
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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
        <meta name="apple-mobile-web-app-title" content="Dodo Services" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <SplashScreen />
          <NetworkStatus />
          <SyncIndicator />
          <AppShell>{children}</AppShell>
          <OfflineNotification />
          <ServiceWorkerRegister />
          <InstallPrompt />
          <BackgroundSyncInit />
          <NotificationPermission />
        </AuthProvider>
      </body>
    </html>
  );
}
