import React, { useEffect } from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import ScrollToTop from '../common/ScrollToTop';
import MetaTags from '../SEO/MetaTags';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import Script from 'next/script';

const Layout = ({ 
  children, 
  title = 'Guided Meditation | Brahma Kumaris', 
  description = 'Explore Rajyoga meditation with Brahma Kumaris. Guided audio meditations for all age groups and spiritual topics.',
  canonical = '',
  keywords = '',
  openGraph = {},
  twitter = {},
  structuredData = null,
  noindex = false,
  hideHeaderFooter = false 
}) => {
  const { currentMeditation } = useAudioPlayer();
  const hasActivePlayer = Boolean(currentMeditation);

  return (
    <>
      <MetaTags
        title={title}
        description={description}
        canonical={canonical}
        keywords={keywords}
        openGraph={openGraph}
        twitter={twitter}
        structuredData={structuredData}
        noindex={noindex}
      />
      
      <Head>
        {/* Fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700&family=Cinzel:wght@400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="BK Meditation" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* PWA icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
      </Head>
      
      <div className={`flex flex-col min-h-screen ${hasActivePlayer ? 'page-content-with-player' : ''}`}>
        {!hideHeaderFooter && <Header />}
        
        <main className={`flex-grow ${hideHeaderFooter ? 'h-screen' : ''}`}>
          {children}
        </main>
        
        {!hideHeaderFooter && <Footer />}
        
        {/* Scroll to Top Button */}
        {!hideHeaderFooter && <ScrollToTop />}
      </div>
      
      {/* PWA service worker registration */}
      <Script src="/pwa.js" strategy="lazyOnload" />
    </>
  );
};

export default Layout; 