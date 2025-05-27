import React from 'react';
import { SWRConfig } from 'swr';
import '../styles/globals.css';
import { AudioPlayerProvider } from '../contexts/AudioPlayerContext';
import { DataProvider } from '../contexts/DataContext';
import GlobalAudioPlayer from '../components/meditation/GlobalAudioPlayer';

// SWR global configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0,
  dedupingInterval: 60000, // 1 minute
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  loadingTimeout: 10000,
  focusThrottleInterval: 5000,
};

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig value={swrConfig}>
      <DataProvider>
        <AudioPlayerProvider>
          <Component {...pageProps} />
          <GlobalAudioPlayer />
        </AudioPlayerProvider>
      </DataProvider>
    </SWRConfig>
  );
}

export default MyApp; 