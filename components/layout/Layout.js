import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

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
      </Head>
      
      <div className={`flex flex-col min-h-screen ${hasActivePlayer ? 'page-content-with-player' : ''}`}>
        <Header />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Layout; 