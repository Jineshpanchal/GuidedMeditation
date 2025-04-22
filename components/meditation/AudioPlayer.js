import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

const AudioPlayer = ({ audioSrc, title = 'Guided Meditation' }) => {
  const { 
    currentTime, 
    duration, 
    isPlaying, 
    togglePlay, 
    seekTo, 
    formatTime,
    playError 
  } = useAudioPlayer();
  
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  
  // Create a temp meditation object for the context
  const tempMeditation = useRef({
    id: 'local-player-' + Date.now(),
    attributes: {
      Title: title,
      Media: {
        data: {
          attributes: {
            url: audioSrc
          }
        }
      }
    }
  });
  
  const { playMeditation } = useAudioPlayer();
  
  // Initialize by sending the audio source to the context
  useEffect(() => {
    if (audioSrc) {
      // Update the URL if it changes
      tempMeditation.current.attributes.Media.data.attributes.url = audioSrc;
      playMeditation(tempMeditation.current);
    }
  }, [audioSrc, playMeditation]);
  
  // Update progress based on time
  useEffect(() => {
    if (!isDragging) {
      setLocalTime(currentTime);
      const calculatedProgress = duration > 0 ? (currentTime / duration) * 100 : 0;
      setProgress(calculatedProgress);
    }
  }, [currentTime, duration, isDragging]);

  const handleTogglePlay = () => {
    togglePlay();
  };

  const handleTimeChange = (e) => {
    const value = parseFloat(e.target.value);
    seekTo(value);
    setLocalTime(value);
  };

  const handleSliderStart = () => {
    setIsDragging(true);
  };

  const handleSliderEnd = (e) => {
    setIsDragging(false);
  };

  return (
    <div className="audio-player bg-white p-4 rounded-xl shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-medium text-gray-900 mb-3">{title}</h3>
      
      {playError && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 p-2 rounded">
          {playError}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-2">
        <button 
          onClick={handleTogglePlay}
          className="w-10 h-10 bg-spiritual-dark text-white rounded-full flex items-center justify-center shadow-sm hover:bg-spiritual-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spiritual-dark transition-colors"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1 mx-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={localTime}
            onChange={handleTimeChange}
            onMouseDown={handleSliderStart}
            onTouchStart={handleSliderStart}
            onMouseUp={handleSliderEnd}
            onTouchEnd={handleSliderEnd}
            className="w-full h-2 rounded-full bg-gray-200 appearance-none cursor-pointer"
          />
        </div>
        
        <div className="text-xs text-gray-500 w-16 text-right">
          {formatTime(localTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <button
          onClick={() => seekTo(Math.max(currentTime - 10, 0))}
          className="flex items-center hover:text-spiritual-dark"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
          </svg>
          10s
        </button>
        
        <button
          onClick={() => seekTo(Math.min(currentTime + 10, duration))}
          className="flex items-center hover:text-spiritual-dark"
        >
          10s
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer; 