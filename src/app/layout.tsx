import './globals.css';
import type { Metadata } from 'next';
import React from 'react';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Pomopuppy',
  description: 'Pomotoro timer with puppy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <link rel="web icon" href="/corgi.png" />

      <Head>
        <link
          rel="preload"
          href="EXEPixelPerfect.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </Head>
      {' '}
      <body>{children}</body>
    </html>
  );
}
