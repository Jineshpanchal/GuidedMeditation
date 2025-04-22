import React from 'react';
import '../styles/globals.css';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import GlobalAudioPlayer from '../components/meditation/GlobalAudioPlayer';

function MyApp({ Component, pageProps }) {
  return (
    <AudioPlayerProvider>
      <Component {...pageProps} />
      <GlobalAudioPlayer />
    </AudioPlayerProvider>
  );
}

export default MyApp; 