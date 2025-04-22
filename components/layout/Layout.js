import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import Script from 'next/script';

const Layout = ({ children, title = 'Guided Meditation | Brahma Kumaris', description = 'Explore Raja Yoga meditation with Brahma Kumaris. Guided audio meditations for all age groups and spiritual topics.' }) => {
  const { currentMeditation } = useAudioPlayer();
  const hasActivePlayer = Boolean(currentMeditation);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap" rel="stylesheet" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="BK Meditation" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BK Meditation" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#5a67d8" />
        
        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <div className={`flex flex-col min-h-screen ${hasActivePlayer ? 'page-content-with-player' : ''}`}>
        <Header />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </div>
      
      {/* PWA service worker registration */}
      <Script src="/pwa.js" strategy="lazyOnload" />
    </>
  );
};

export default Layout; 