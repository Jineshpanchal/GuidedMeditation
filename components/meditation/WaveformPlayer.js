import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import axios from 'axios';

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
        
        const response = await axios.post('/api/meditation/interaction', {
          meditationId: meditation.id,
          action: 'like',
          value: newLikedState
        });
        
        if (response.data.success) {
          const newCount = response.data.data.like;
          console.log('New like count:', newCount);
          setIsLiked(newLikedState);
          setLikeCount(newCount);
        } else {
          // Revert UI state if the API call fails
          setIsLiked(!newLikedState);
        }
      }
    } catch (error) {
      console.error('Failed to update like count:', error);
      // Revert UI state if the API call fails
      setIsLiked(!isLiked);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    updateListenedCount();
    
    if (!isCurrentMeditation) {
      // Set up the meditation first
      playMeditation(meditation);
      
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
      playMeditation(meditation);
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
      playMeditation(meditation);
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
      playMeditation(meditation);
      setTimeout(() => seekTo(newTime), 300);
    } else {
      seekTo(newTime);
    }
    
    setLocalTime(newTime);
    setProgress((newTime / displayDuration) * 100);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-spiritual-light/20 to-spiritual-accent/20 p-6 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-display font-semibold text-gray-900">
            Listen Now
          </h3>
          
          <div className="text-sm font-medium text-gray-600 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
            {formatTime(localTime)} / {formatTime(displayDuration)}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
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
          
          {/* Stats and info row */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Stats display - Enhanced */}
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center px-3 py-2 bg-gradient-to-br from-spiritual-light/10 to-spiritual-accent/10 rounded-lg border border-spiritual-light/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-spiritual-dark" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-gray-700">{listenedCount}</span>
              </div>
              
              <div className={`flex items-center px-3 py-2 rounded-lg border ${
                isLiked 
                  ? 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200' 
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${isLiked ? 'text-red-500' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className={`font-medium ${isLiked ? 'text-red-600' : 'text-gray-700'}`}>{likeCount}</span>
              </div>
            </div>
            
            {/* Language and duration info */}
            <div className="text-sm font-medium text-gray-600 bg-gradient-to-br from-spiritual-purple/10 to-spiritual-blue/10 px-4 py-2 rounded-lg border border-spiritual-purple/20">
              <span className="text-spiritual-purple">{meditation.attributes.gm_language?.data?.attributes?.Name || 'English'}</span>
              <span className="text-gray-400 mx-2">|</span>
              <span className="text-spiritual-blue">{meditation.attributes.Duration || '5'} min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveformPlayer; 