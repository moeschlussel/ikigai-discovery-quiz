import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Discover Your Ikigai',
  description: 'Discover your purpose with our AI-powered Ikigai quiz. Find the intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for.',
  keywords: 'ikigai, purpose, quiz, AI, self-discovery, career, passion, mission',
  authors: [{ name: 'Ikigai Discovery' }],
  openGraph: {
    title: 'Discover Your Ikigai - Find Your Purpose',
    description: 'AI-powered quiz to help you find your reason for being',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discover Your Ikigai - Find Your Purpose',
    description: 'AI-powered quiz to help you find your reason for being',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' }
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
      </head>
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
