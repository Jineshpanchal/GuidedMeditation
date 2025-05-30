import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import axios from 'axios';

// Helper functions for managing liked meditations in localStorage
const getLikedMeditations = () => {
  try {
    const liked = localStorage.getItem('liked_meditations');
    return liked ? JSON.parse(liked) : [];
  } catch (e) {
    console.warn('Error reading liked meditations from localStorage:', e);
    return [];
  }
};

const addLikedMeditation = (meditationId) => {
  try {
    const liked = getLikedMeditations();
    const id = meditationId.toString();
    if (!liked.includes(id)) {
      liked.push(id);
      localStorage.setItem('liked_meditations', JSON.stringify(liked));
    }
  } catch (e) {
    console.warn('Error storing liked meditation:', e);
  }
};

const removeLikedMeditation = (meditationId) => {
  try {
    const liked = getLikedMeditations();
    const id = meditationId.toString();
    const filtered = liked.filter(item => item !== id);
    localStorage.setItem('liked_meditations', JSON.stringify(filtered));
  } catch (e) {
    console.warn('Error removing liked meditation:', e);
  }
};

const WaveformPlayer = ({ meditation }) => {
  const { 
    currentMeditation, 
    isPlaying, 
    currentTime, 
    duration, 
    togglePlay, 
    seekTo, 
    formatTime,
    playMeditation,
    tryPlayWhenReady,
    isReady,
    playError 
  } = useAudioPlayer();
  
  // Local state for UI
  const [localTime, setLocalTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [listenedCount, setListenedCount] = useState(parseInt(meditation?.attributes?.Listened || '0', 10));
  const [likeCount, setLikeCount] = useState(parseInt(meditation?.attributes?.like || '0', 10));
  const [isLiked, setIsLiked] = useState(false);
  const [playClicked, setPlayClicked] = useState(false);
  const [showResumeNotification, setShowResumeNotification] = useState(false);
  const [showGuidelineModal, setShowGuidelineModal] = useState(false);
  const intervalRef = useRef(null);
  
  const isCurrentMeditation = currentMeditation && currentMeditation.id === meditation.id;
  const displayDuration = isCurrentMeditation ? duration : (meditation.attributes.Duration * 60) || 300;
  
  // Extract audio URL and initialize counts on component mount
  useEffect(() => {
    const url = meditation?.attributes?.Media?.data?.attributes?.url || 
                meditation?.attributes?.AudioFile?.data?.attributes?.url;
    
    if (url) {
      setAudioUrl(url);
    } else {
      console.warn(`No audio URL found for meditation: ${meditation?.attributes?.Title}`);
    }

    // Initialize listened and like counts from meditation data
    setListenedCount(parseInt(meditation?.attributes?.Listened || '0', 10));
    setLikeCount(parseInt(meditation?.attributes?.like || '0', 10));
    
    // Check if this meditation is liked from localStorage
    const likedMeditations = getLikedMeditations();
    setIsLiked(likedMeditations.includes(meditation.id.toString()) || likedMeditations.includes(meditation.id));
    
    // Reset local state when meditation changes
    setLocalTime(0);
    setProgress(0);
    setPlayClicked(false);
  }, [meditation]);

  // Reset state when this meditation is no longer the current one
  useEffect(() => {
    if (!isCurrentMeditation) {
      setLocalTime(0);
      setProgress(0);
    }
  }, [isCurrentMeditation]);

  // Update progress based on current time
  useEffect(() => {
    if (!isDragging && isCurrentMeditation) {
      setLocalTime(currentTime);
      const calculatedProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
      setProgress(calculatedProgress);
    }
  }, [currentTime, duration, isCurrentMeditation, isDragging]);

  // Initialize position when this becomes the current meditation
  useEffect(() => {
    if (isCurrentMeditation && currentTime > 0) {
      setLocalTime(currentTime);
      const calculatedProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
      setProgress(calculatedProgress);
      
      // Show resume notification if position is significant (more than 30 seconds)
      if (currentTime > 30) {
        setShowResumeNotification(true);
        setTimeout(() => setShowResumeNotification(false), 5000);
      }
    }
  }, [isCurrentMeditation]);

  // Set up continuous update interval when playing
  useEffect(() => {
    if (isPlaying && isCurrentMeditation) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Create new interval that updates every 50ms for smooth slider animation
      intervalRef.current = setInterval(() => {
        if (!isDragging) {
          setLocalTime(prev => {
            const newTime = currentTime;
            setProgress(duration > 0 ? (newTime / duration) * 100 : 0);
            return newTime;
          });
        }
      }, 50);
    }
    
    // Cleanup interval on component unmount or when playback stops
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, isCurrentMeditation, currentTime, duration, isDragging]);

  // Function to update Listened count when play is clicked
  const updateListenedCount = async () => {
    try {
      if (!playClicked && meditation?.id) {
        const response = await axios.post('/api/meditation/interaction', {
          meditationId: meditation.id,
          action: 'listened',
        });
        
        if (response.data.success) {
          const newCount = response.data.data.listened;
          console.log('New listened count:', newCount);
          setListenedCount(newCount);
          setPlayClicked(true);
        }
      }
    } catch (error) {
      console.error('Failed to update listened count:', error);
    }
  };

  // Function to toggle like status
  const toggleLike = async () => {
    try {
      if (meditation?.id) {
        const newLikedState = !isLiked;
        
        // Update localStorage immediately for instant UI feedback
        if (newLikedState) {
          addLikedMeditation(meditation.id);
        } else {
          removeLikedMeditation(meditation.id);
        }
        
        // Update local state
        setIsLiked(newLikedState);
        
        const response = await axios.post('/api/meditation/interaction', {
          meditationId: meditation.id,
          action: 'like',
          value: newLikedState
        });
        
        if (response.data.success) {
          const newCount = response.data.data.like;
          console.log('New like count:', newCount);
          setLikeCount(newCount);
        } else {
          // Revert UI state if the API call fails
          setIsLiked(!newLikedState);
          if (!newLikedState) {
            addLikedMeditation(meditation.id);
          } else {
            removeLikedMeditation(meditation.id);
          }
        }
      }
    } catch (error) {
      console.error('Failed to update like count:', error);
      // Revert UI state if the API call fails
      setIsLiked(!isLiked);
      if (!isLiked) {
        removeLikedMeditation(meditation.id);
      } else {
        addLikedMeditation(meditation.id);
      }
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    updateListenedCount();
    
    if (!isCurrentMeditation) {
      // Set up the meditation first - start from beginning when user clicks play on a card
      playMeditation(meditation, true); // true = start from beginning
      
      // Use tryPlayWhenReady for better handling of not-ready audio
      setTimeout(() => {
          tryPlayWhenReady();
      }, 50);
    } else {
      // Already the current meditation, just toggle play state
      togglePlay();
    }
  };

  // Handle slider interaction
  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setLocalTime(value);
    setProgress((value / displayDuration) * 100);
  };

  const handleSliderStart = () => {
    setIsDragging(true);
  };

  const handleSliderEnd = (e) => {
    const value = parseFloat(e.target.value);
    
    if (!isCurrentMeditation) {
      playMeditation(meditation, true); // Start from beginning when user interacts with slider on non-current meditation
      // Delay seeking to ensure meditation loads
      setTimeout(() => {
        seekTo(value);
      }, 300);
    } else {
      seekTo(value);
    }
    
    setIsDragging(false);
  };

  // Rewind 10 seconds
  const handleRewind = () => {
    const newTime = Math.max(0, localTime - 10);
    
    if (!isCurrentMeditation) {
      playMeditation(meditation, true); // Start from beginning
      setTimeout(() => seekTo(newTime), 300);
    } else {
      seekTo(newTime);
    }
    
    setLocalTime(newTime);
    setProgress((newTime / displayDuration) * 100);
  };

  // Fast forward 10 seconds
  const handleFastForward = () => {
    const newTime = Math.min(displayDuration, localTime + 10);
    
    if (!isCurrentMeditation) {
      playMeditation(meditation, true); // Start from beginning
      setTimeout(() => seekTo(newTime), 300);
    } else {
      seekTo(newTime);
    }
    
    setLocalTime(newTime);
    setProgress((newTime / displayDuration) * 100);
  };

  // Start from beginning function
  const startFromBeginning = () => {
    if (!isCurrentMeditation) {
      playMeditation(meditation, true); // Start from beginning
      setTimeout(() => seekTo(0), 300);
    } else {
      seekTo(0);
    }
    setLocalTime(0);
    setProgress(0);
    setShowResumeNotification(false);
  };

  // Effect to handle background scrolling when modal is open
  useEffect(() => {
    if (showGuidelineModal) {
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent layout shift from scrollbar
    } else {
      // Restore background scrolling
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [showGuidelineModal]);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-spiritual-light/20 to-spiritual-accent/20 p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-display font-semibold text-gray-900">
            Listen Now
          </h3>
          
          <div className="flex items-center space-x-3">
            {/* Guidelines button */}
            <button
              onClick={() => setShowGuidelineModal(true)}
              className="flex items-center space-x-2 px-3 py-1.5 text-xs font-medium text-spiritual-dark bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-spiritual-light/20 rounded-full transition-all duration-200 hover:shadow-sm"
              aria-label="How to Practice Guidelines"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">How to Practice</span>
            </button>
            
            <div className="text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {formatTime(localTime)} / {formatTime(displayDuration)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Resume notification */}
        {showResumeNotification && (
          <div className="mb-4 bg-spiritual-light/10 border border-spiritual-accent/20 text-spiritual-dark p-3 rounded-xl text-sm flex items-center justify-between">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-spiritual-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Resuming from {formatTime(currentTime)}
            </div>
            <button
              onClick={startFromBeginning}
              className="text-xs bg-white hover:bg-gray-50 border border-gray-200 px-2 py-1 rounded-md transition-colors"
            >
              Start from beginning
            </button>
          </div>
        )}
        
        {/* Show error message if playback failed */}
        {playError && isCurrentMeditation && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Unable to play audio: {playError}. Please try again or check that your browser supports audio playback.
            </div>
          </div>
        )}
        
        {/* Enhanced progress bar */}
        <div className="mb-6 w-full h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full relative overflow-hidden shadow-inner">
          {/* Track progress with gradient */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-spiritual-dark to-spiritual-purple rounded-full transition-all duration-100 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          ></div>
          
          {/* Progress indicator dot */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-spiritual-dark rounded-full shadow-lg transition-all duration-100 ease-out"
            style={{ left: `calc(${progress}% - 8px)` }}
          ></div>
          
          {/* Invisible range input on top for interaction */}
          <input
            type="range"
            min="0"
            max={displayDuration}
            value={localTime}
            onChange={handleSliderChange}
            onMouseDown={handleSliderStart}
            onTouchStart={handleSliderStart}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer m-0"
            aria-label="Audio progress"
          />
        </div>
        
        {/* Controls section */}
        <div className="space-y-4">
          {/* Control buttons row */}
          <div className="flex items-center justify-center space-x-2">
            {/* Rewind button */}
            <button
              onClick={handleRewind}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none border border-gray-200"
              aria-label="Rewind 10 seconds"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Play/Pause button - Enhanced */}
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-r from-spiritual-dark to-spiritual-purple hover:from-spiritual-purple hover:to-spiritual-blue text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
              aria-label={isCurrentMeditation && isPlaying ? 'Pause' : 'Play'}
            >
              {isCurrentMeditation && isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-7 md:w-7 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {/* Fast forward button */}
            <button
              onClick={handleFastForward}
              className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none border border-gray-200"
              aria-label="Fast forward 10 seconds"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Like button - Enhanced */}
            <button
              onClick={toggleLike}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none border ${
                isLiked 
                  ? 'bg-gradient-to-br from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-500 border-red-200' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border-gray-200'
              }`}
              aria-label={isLiked ? "Unlike" : "Like"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {/* Stats and info row - Redesigned layout */}
          <div className="flex items-center justify-between">
            {/* Left side - Like and Listen stats */}
            <div className="flex items-center space-x-2">
              {/* Listen count */}
              <div className="flex items-center px-2 py-1.5 bg-gradient-to-br from-spiritual-light/10 to-spiritual-accent/10 rounded-lg border border-spiritual-light/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-spiritual-dark" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-700 text-xs">{listenedCount}</span>
              </div>
              
              {/* Like count */}
              <div className={`flex items-center px-2 py-1.5 rounded-lg border ${
                isLiked 
                  ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 mr-1.5 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className={`font-medium text-xs ${isLiked ? 'text-red-600' : 'text-gray-700'}`}>{likeCount}</span>
              </div>
            </div>
            
            {/* Right side - Language and Duration */}
            <div className="flex items-center space-x-2">
              {/* Language */}
              <div className="flex items-center px-2 py-1.5 bg-gradient-to-br from-spiritual-purple/10 to-spiritual-blue/10 rounded-lg border border-spiritual-purple/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-spiritual-purple" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-spiritual-purple text-xs">{meditation.attributes.gm_language?.data?.attributes?.Name || 'English'}</span>
              </div>
              
              {/* Duration */}
              <div className="flex items-center px-2 py-1.5 bg-gradient-to-br from-spiritual-blue/10 to-spiritual-purple/10 rounded-lg border border-spiritual-blue/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-spiritual-blue" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-spiritual-blue text-xs">{meditation.attributes.Duration || '5'} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Practice Guidelines Modal */}
      {showGuidelineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg sm:text-xl font-display font-semibold text-gray-900">
                  How to Practice Rajyoga Meditation
                </h3>
                <button
                  onClick={() => setShowGuidelineModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close modal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <div className="text-gray-700 leading-relaxed text-sm sm:text-base space-y-3">
                <p>
                  <strong>Find a quiet space</strong> where you can sit comfortably and undisturbed. Sit with your back upright, either on a chair or on the floor. Keep your eyes gently open or slightly lowered, as <strong>Rajyoga</strong> is practised with open eyes to remain alert and aware.
                </p>
                
                <p>
                  Gently withdraw your attention from the outside world. Using the guided meditation commentary on this website, begin to create <em>elevated thoughts</em>. Let each thought guide the mind inward—towards the awareness of the self and connection with the <strong>Supreme</strong>.
                </p>
                
                <p>
                  If the mind wanders, gently bring it back by creating the next <em>powerful thought</em>. Stay patient and loving with yourself.
                </p>
                
                <p className="mb-0">
                  When the commentary ends, remain seated in silence for a few moments. Absorb the stillness, and carry this <em>inner awareness</em> into every action of your day.
                </p>
              </div>
              
              {/* Close button */}
              <div className="mt-4 sm:mt-6 text-center">
                <button
                  onClick={() => setShowGuidelineModal(false)}
                  className="px-6 py-2 bg-spiritual-dark text-white rounded-full hover:bg-spiritual-purple transition-colors font-medium text-sm sm:text-base"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaveformPlayer; 