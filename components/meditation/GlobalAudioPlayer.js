import React, { useState, useEffect, useRef } from 'react';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import { useRouter } from 'next/router';
import VideoPlayer from './VideoPlayer';

const GlobalAudioPlayer = () => {
  const router = useRouter();
  const { 
    currentMeditation,
    isPlaying,
    duration,
    currentTime,
    isReady,
    formatTime,
    togglePlay,
    seekTo,
    playError,
    hasEnded,
  } = useAudioPlayer();

  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [localTime, setLocalTime] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const progressUpdateIntervalRef = useRef(null);

  // Navigate to meditation page when clicking on title
  const navigateToMeditation = () => {
    if (currentMeditation?.attributes?.Slug) {
      router.push(`/rajyog-meditation/meditations/${currentMeditation.attributes.Slug}`);
    }
  };

  // Update local time and progress when current time changes
  useEffect(() => {
    if (!isDragging) {
      setLocalTime(currentTime);
      if (duration > 0) {
        setProgress((currentTime / duration) * 100);
      }
    }
  }, [currentTime, duration, isDragging]);

  // Set up interval for smooth UI updates when playing
  useEffect(() => {
    if (progressUpdateIntervalRef.current) {
      clearInterval(progressUpdateIntervalRef.current);
    }

    if (isPlaying && !isDragging) {
      progressUpdateIntervalRef.current = setInterval(() => {
        setLocalTime(prev => {
          const newTime = prev + 0.05; // 50ms interval
          if (duration > 0) {
            setProgress((newTime / duration) * 100);
          }
          return newTime;
        });
      }, 50);
    }

    return () => {
      if (progressUpdateIntervalRef.current) {
        clearInterval(progressUpdateIntervalRef.current);
      }
    };
  }, [isPlaying, isDragging, duration]);

  // Handle slider interaction
  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    const newTime = (value / 100) * duration;
    setLocalTime(newTime);
    setProgress(value);
  };

  const handleSliderStart = () => {
    setIsDragging(true);
  };

  const handleSliderEnd = () => {
    const newTime = (progress / 100) * duration;
    seekTo(newTime);
    setIsDragging(false);
  };

  // Skip forward/backward
  const skipForward = () => seekTo(Math.min(currentTime + 10, duration));
  const skipBackward = () => seekTo(Math.max(currentTime - 10, 0));

  // Toggle minimized state
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized);
    if (isMinimized) {
      setShowVideo(false);
    }
  };

  // If no current meditation, don't render the player
  if (!currentMeditation) {
    return null;
  }

  // Get meditation info
  const title = currentMeditation?.attributes?.Title || "Unknown Meditation";
  const teacherName = currentMeditation?.attributes?.gm_rajyoga_teacher?.data?.attributes?.Name || "";

  return (
    <>
      {showVideo && !isMinimized && <VideoPlayer isPlaying={isPlaying} />}
      <div className={`fixed bottom-0 left-0 right-0 bg-gradient-to-r from-pink-50 via-spiritual-light/10 to-blue-50 shadow-lg z-[10000] transition-all duration-300 backdrop-blur-sm ${
        isMinimized ? 'h-12' : ''
      }`}>
        <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.2\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")'}}></div>
        
        <div className="max-w-screen-xl mx-auto flex flex-col relative">
          {isMinimized ? (
            <div className="flex items-center justify-between h-12 px-3">
              <div className="flex-1 truncate mr-4" onClick={navigateToMeditation}>
                <h4 className="text-sm font-medium truncate cursor-pointer hover:text-spiritual-dark">{title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={togglePlay} className="bg-spiritual-dark text-white rounded-full w-8 h-8 flex items-center justify-center">
                  {isPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button onClick={toggleMinimized} className="text-gray-600 p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex-1 truncate mr-4" onClick={navigateToMeditation}>
                  <h4 className="text-sm font-medium truncate cursor-pointer hover:text-spiritual-dark">{title}</h4>
                  {teacherName && <p className="text-xs text-gray-500 truncate">{teacherName}</p>}
                </div>
                <div className="flex items-center space-x-3">
                  <button onClick={skipBackward} className="text-gray-600 hover:text-spiritual-dark p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button onClick={togglePlay} className="bg-spiritual-dark text-white rounded-full w-8 h-8 flex items-center justify-center">
                    {isPlaying ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  <button onClick={skipForward} className="text-gray-600 hover:text-spiritual-dark p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className={`bg-spiritual-dark text-white rounded-full w-8 h-8 flex items-center justify-center ${showVideo ? 'bg-opacity-70' : ''}`}
                    title={showVideo ? "Hide video" : "Show video"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                    </svg>
                  </button>
                  <button onClick={toggleMinimized} className="text-gray-600 hover:text-gray-900 p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative w-full h-4 flex items-center">
                <div className="w-full h-1 bg-white/50 rounded-full">
                  <div 
                    className="h-full bg-spiritual-dark rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSliderChange}
                  onMouseDown={handleSliderStart}
                  onMouseUp={handleSliderEnd}
                  onTouchStart={handleSliderStart}
                  onTouchEnd={handleSliderEnd}
                  className="absolute top-0 left-0 w-full h-4 opacity-0 cursor-pointer"
                />
                <div className="absolute bottom-4 left-0 text-xs text-gray-500">
                  {formatTime(localTime)}
                </div>
                <div className="absolute bottom-4 right-0 text-xs text-gray-500">
                  {formatTime(duration)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GlobalAudioPlayer; 