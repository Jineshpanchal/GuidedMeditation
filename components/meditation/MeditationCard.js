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
  
  // Get teacher information
  const teacher = meditation.attributes.gm_rajyoga_teachers?.data && 
                 meditation.attributes.gm_rajyoga_teachers.data.length > 0 ? 
                  `${meditation.attributes.gm_rajyoga_teachers.data[0].attributes.Name}` : 
                  '';
  
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

  // Add handleNavigation function
  const handleNavigation = (e) => {
    // Only navigate if not clicking on the play button
    if (e.target.closest('button')) {
      e.preventDefault();
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <Link href={href} onClick={handleNavigation} className="block">
        <div className="cursor-pointer">
          <div className="aspect-w-16 aspect-h-9 bg-spiritual-light relative">
            {featuredImageUrl ? (
              <Image 
                src={featuredImageUrl}
                alt={meditation.attributes.Title || 'Meditation thumbnail'}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-pastel-gradient-2"></div>
            )}
          </div>
          
          <div className="p-4 flex-grow flex flex-col relative">
            <div className="text-xs text-gray-500 mb-1">AUDIO: {meditation.attributes.Duration || '5'} Minutes</div>
            <h3 className="font-medium text-gray-900 mb-1">
              {meditation.attributes.Title || 'Guided Meditation'}
            </h3>
            <div className="text-xs text-gray-500 flex items-center">
              <span>{teacher}</span>
            </div>
            
            {meditation.attributes.Trending && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-spiritual-light text-spiritual-dark">
                  Trending
                </span>
              </div>
            )}
            
            {/* Play button in bottom right */}
            <button 
              className="absolute bottom-4 right-4 w-12 h-12 bg-spiritual-dark rounded-full flex items-center justify-center shadow-md hover:bg-spiritual-dark/90 transition-colors z-10"
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
    </div>
  );
};

export default MeditationCard; 