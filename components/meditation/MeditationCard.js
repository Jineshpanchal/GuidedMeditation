import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

const MeditationCard = ({ 
  meditation, 
  href = `/rajyog-meditation/meditations/${meditation.attributes.Slug}`,
  className = ''
}) => {
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const featuredImageUrl = meditation.attributes.FeaturedImage?.data?.attributes?.url;
  const { playMeditation, togglePlay, currentMeditation, isPlaying } = useAudioPlayer();
  
  // Check if this is the currently playing meditation
  useEffect(() => {
    setIsThisPlaying(
      isPlaying && 
      currentMeditation && 
      currentMeditation.id === meditation.id
    );
  }, [isPlaying, currentMeditation, meditation.id]);
  
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If this is already the current meditation, just toggle play/pause
    if (currentMeditation && currentMeditation.id === meditation.id) {
      togglePlay();
    } else {
      // Otherwise, set this as the current meditation and play it
      playMeditation(meditation);
      // Small delay to ensure the audio is loaded before playing
      setTimeout(() => {
        togglePlay();
      }, 100);
    }
  };

  return (
    <Link href={href} className={`block ${className}`}>
      <div className="meditation-card bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-[340px] flex flex-col">
        <div className="aspect-w-16 aspect-h-9 relative bg-gray-100">
          {featuredImageUrl ? (
            <Image 
              src={featuredImageUrl}
              alt={meditation.attributes.Title || 'Meditation thumbnail'}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <div className="w-full h-full bg-pastel-gradient-2"></div>
          )}
        </div>
        
        <div className="p-4 flex-grow flex flex-col relative">
          <h3 className="font-medium text-lg text-gray-900 mb-2">
            {meditation.attributes.Title || 'Guided Meditation'}
          </h3>
          
          <div className="flex items-center text-sm text-gray-500 mt-auto">
            <span>{meditation.attributes.Duration || '5'} min</span>
          </div>
          
          {meditation.attributes.Trending && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-spiritual-light text-spiritual-dark">
                Trending
              </span>
            </div>
          )}
          
          {/* Play button in the bottom right corner */}
          <button 
            className="absolute bottom-4 right-4 w-10 h-10 bg-spiritual-dark rounded-full flex items-center justify-center shadow-md hover:bg-spiritual-dark/90 transition-colors"
            onClick={handlePlayClick}
            aria-label={isThisPlaying ? "Pause meditation" : "Play meditation"}
          >
            {isThisPlaying ? (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
};

export default MeditationCard; 