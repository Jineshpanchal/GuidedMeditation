import React from 'react';
import '../styles/globals.css';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import { DataProvider } from '../contexts/DataContext';
import GlobalAudioPlayer from '../components/meditation/GlobalAudioPlayer';

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <AudioPlayerProvider>
        <Component {...pageProps} />
        <GlobalAudioPlayer />
      </AudioPlayerProvider>
    </DataProvider>
  );
}

export default MyApp; 