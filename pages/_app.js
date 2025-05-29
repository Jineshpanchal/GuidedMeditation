import React from 'react';
import '../styles/globals.css';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
// Remove DataProvider import since we're simplifying caching strategy
// import { DataProvider } from '../contexts/DataContext';
import GlobalAudioPlayer from '../components/meditation/GlobalAudioPlayer';

function MyApp({ Component, pageProps }) {
  return (
    // Remove DataProvider wrapper since we're using static generation with getStaticProps
    <AudioPlayerProvider>
      <Component {...pageProps} />
      <GlobalAudioPlayer />
    </AudioPlayerProvider>
  );
}

export default MyApp; 