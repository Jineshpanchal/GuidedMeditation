import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Create the context
const AudioPlayerContext = createContext();

// Helper to convert external URLs to local proxied URLs
const getProxiedAudioUrl = (url) => {
  if (!url) return '';
  
  // Check if it's a bkstrapiapp URL and proxy it
  if (url.includes('bkstrapiapp.blob.core.windows.net/strapi-uploads/assets/')) {
    // Extract the path after assets/
    const pathMatch = url.match(/assets\/(.*)/);
    if (pathMatch && pathMatch[1]) {
      return `/api/audio/${pathMatch[1]}`;
    }
  }
  
  return url;
};

// Context provider component
export const AudioPlayerProvider = ({ children }) => {
  const [audio] = useState(() => typeof Audio !== 'undefined' ? new Audio() : null);
  const [currentMeditation, setCurrentMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [playError, setPlayError] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const timeUpdateIntervalRef = useRef(null);

  // Load audio when meditation changes
  useEffect(() => {
    if (!audio) return;

    const setupAudio = () => {
      // Get audio URL from either AudioFile or Media field
      let audioUrl = currentMeditation?.attributes?.AudioFile?.data?.attributes?.url || 
                   currentMeditation?.attributes?.Media?.data?.attributes?.url;
      
      // Check if the media is a video
      const isVideoContent = audioUrl?.toLowerCase().endsWith('.mp4');
      setIsVideo(isVideoContent);

      console.log('[AudioPlayerContext] Setting up media for meditation:', {
        id: currentMeditation?.id,
        title: currentMeditation?.attributes?.Title,
        audioFile: currentMeditation?.attributes?.AudioFile?.data?.attributes?.url,
        mediaFile: currentMeditation?.attributes?.Media?.data?.attributes?.url,
        finalUrl: audioUrl,
        isVideo: isVideoContent
      });
      
      if (audioUrl) {
        // Proxy the URL through our local API to avoid CORS issues
        audioUrl = getProxiedAudioUrl(audioUrl);
        
        console.log('Loading audio file:', audioUrl);
        
        // Stop any currently playing audio
        audio.pause();
        setIsPlaying(false);
        setCurrentTime(0);
        setIsReady(false);
        setHasEnded(false);
        setPlayError(null);
        
        // Load new audio
        audio.src = audioUrl;
        audio.load();
        
        // Preload audio data
        audio.preload = "auto";
      } else {
        console.warn('No audio URL found for meditation:', currentMeditation?.attributes?.Title);
        setIsReady(false);
        audio.src = '';
      }
    };

    if (currentMeditation) {
      setupAudio();
    }

    // Cleanup function
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, [currentMeditation, audio]);

  // Set up audio event listeners
  useEffect(() => {
    if (!audio) return;

    const handleLoadedMetadata = () => {
      console.log('Audio metadata loaded, duration:', audio.duration);
      setDuration(audio.duration);
      setIsReady(true);
    };

    const handleEnded = () => {
      console.log('Audio playback ended');
      setIsPlaying(false);
      setCurrentTime(0);
      setHasEnded(true);
      audio.currentTime = 0;
    };

    const handleError = (e) => {
      console.error('Audio error:', e);
      setIsReady(false);
      setPlayError(e.message || 'Error loading audio');
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup event listeners
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audio]);

  // Use a custom interval for more frequent time updates
  useEffect(() => {
    // Clear any existing interval
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
    }

    // Only set up interval if audio is playing
    if (isPlaying && audio) {
      timeUpdateIntervalRef.current = setInterval(() => {
        setCurrentTime(audio.currentTime);
      }, 50); // Update 20 times per second for smooth UI
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current);
        timeUpdateIntervalRef.current = null;
      }
    };
  }, [isPlaying, audio]);

  // Handle play/pause
  const togglePlay = () => {
    if (!audio) {
      console.error('Cannot play: Audio element is not available');
      setPlayError('Audio element is not available');
      return;
    }
    
    if (!isReady) {
      console.warn('Cannot play: Audio not ready or initialized');
      // Check if we have valid audio source
      const audioSrc = audio.src;
      console.log('Current audio source:', audioSrc);
      
      // Check if meditation has valid audio URL
      const audioUrl = currentMeditation?.attributes?.AudioFile?.data?.attributes?.url || 
                    currentMeditation?.attributes?.Media?.data?.attributes?.url;
      console.log('Meditation audio URL:', audioUrl);
      
      if (!audioUrl) {
        setPlayError(`No audio URL found for meditation: ${currentMeditation?.attributes?.Title}`);
      } else {
        setPlayError('Audio is still loading. Please try again in a few seconds.');
      }
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        console.log('Attempting to play audio...');
        const playPromise = audio.play();
        
        // Modern browsers return a promise from play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio playback started successfully');
              setIsPlaying(true);
              setPlayError(null);
            })
            .catch(error => {
              console.error('Error playing audio:', error);
              setIsPlaying(false);
              setPlayError(error.message || 'Failed to play audio');
              
              // If it's an autoplay policy error, provide specific feedback
              if (error.name === 'NotAllowedError') {
                console.warn('Autoplay policy prevented playback. User interaction required.');
              }
            });
        } else {
          // Older browsers don't return a promise
          setIsPlaying(true);
        }
      } catch (error) {
        console.error('Unexpected error playing audio:', error);
        setIsPlaying(false);
        setPlayError(error.message || 'Failed to play audio');
      }
    }
  };

  // Handle seeking
  const seekTo = (seconds) => {
    if (!audio || !isReady) return;

    const validTime = Math.min(Math.max(0, seconds), duration);
    audio.currentTime = validTime;
    setCurrentTime(validTime);

    // If paused, update time display immediately
    if (!isPlaying) {
      setCurrentTime(audio.currentTime);
    }
  };

  // Format time for display (mm:ss)
  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds) || timeInSeconds === undefined) return '00:00';
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Play a specific meditation
  const playMeditation = (meditation) => {
    console.log('Playing meditation:', meditation?.attributes?.Title);
    setCurrentMeditation(meditation);
    setIsReady(false);
    setHasEnded(false);
    setPlayError(null);
  };

  const value = {
    currentMeditation,
    isPlaying,
    duration,
    currentTime,
    isReady,
    hasEnded,
    playError,
    isVideo,
    formatTime,
    togglePlay,
    seekTo,
    playMeditation,
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

// Custom hook to use the audio player context
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export default AudioPlayerContext; 