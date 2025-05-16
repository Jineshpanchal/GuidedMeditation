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
  }, [meditation]);

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
      playMeditation(meditation);
      // Allow time for the meditation to load before playing
      setTimeout(() => {
        togglePlay();
      }, 300);
    } else {
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
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-xl font-medium text-gray-900">
          Listen Now
        </h3>
        
        <div className="text-sm text-gray-500">
          {formatTime(localTime)} / {formatTime(displayDuration)}
        </div>
      </div>
      
      {/* Show error message if playback failed */}
      {playError && isCurrentMeditation && (
        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded text-sm">
          Unable to play audio: {playError}. Please try again or check that your browser supports audio playback.
        </div>
      )}
      
      {/* Custom progress bar for better visualization */}
      <div className="mb-4 w-full h-2 bg-gray-200 rounded-full relative">
        {/* Track progress with absolute positioning for more reliable visual */}
        <div 
          className="absolute top-0 left-0 h-full bg-spiritual-dark rounded-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
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
      
      {/* Controls with added Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Rewind button */}
          <button
            onClick={handleRewind}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition-colors focus:outline-none"
            aria-label="Rewind 10 seconds"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Play/Pause button */}
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-spiritual-dark hover:bg-spiritual-accent text-white shadow-sm transition-colors focus:outline-none"
            aria-label={isCurrentMeditation && isPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentMeditation && isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {/* Fast forward button */}
          <button
            onClick={handleFastForward}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition-colors focus:outline-none"
            aria-label="Fast forward 10 seconds"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Like button */}
          <button
            onClick={toggleLike}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 shadow-sm transition-colors focus:outline-none ml-2"
            aria-label={isLiked ? "Unlike" : "Like"}
          >
            {isLiked ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Stats display */}
          <div className="flex items-center text-sm text-gray-500">
            <span className="flex items-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
              </svg>
              {listenedCount}
            </span>
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${isLiked ? 'text-red-500' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              {likeCount}
            </span>
          </div>
          
          <div className="text-sm font-medium text-gray-700">
            {meditation.attributes.gm_language?.data?.attributes?.Name || 'English'} | {meditation.attributes.Duration || '5'} min
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveformPlayer; 