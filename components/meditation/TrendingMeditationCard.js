import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

// Helper function to handle different FeaturedImage data structures and get the best URL
const getImageUrl = (imageData) => {
  if (!imageData) return '/images/placeholder.jpg';
  
  // Handle array structure
  if (Array.isArray(imageData) && imageData.length > 0) {
    if (imageData[0].attributes?.formats?.HD?.url) {
      return imageData[0].attributes.formats.HD.url;
    }
    if (imageData[0].attributes?.url) {
      return imageData[0].attributes.url;
    }
  } 
  // Handle object structure
  else if (imageData.attributes) {
    if (imageData.attributes.formats?.HD?.url) {
      return imageData.attributes.formats.HD.url;
    }
    if (imageData.attributes.url) {
      return imageData.attributes.url;
    }
  }
  
  return '/images/placeholder.jpg';
};

const TrendingMeditationCard = ({ meditation }) => {
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const { playMeditation, togglePlay, currentMeditation, isPlaying } = useAudioPlayer();
  
  const featuredImageUrl = meditation.attributes.FeaturedImage?.data 
    ? getImageUrl(meditation.attributes.FeaturedImage.data)
    : null;
  const title = meditation.attributes.Title || 'Guided Meditation';
  const duration = meditation.attributes.Duration || '5';
  const href = `/rajyog-meditation/meditations/${meditation.attributes.Slug}`;
  
  // Log audio sources for debugging
  useEffect(() => {
    const audioUrl = meditation.attributes.AudioFile?.data?.attributes?.url;
    const mediaUrl = meditation.attributes.Media?.data?.attributes?.url;
    console.log(`[${title}] Audio sources:`, { 
      audioUrl, 
      mediaUrl,
      id: meditation.id
    });
  }, [meditation, title]);
  
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
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all h-full flex flex-col">
      <Link href={href} onClick={handleNavigation}>
        <div className="cursor-pointer h-full">
          <div className="relative bg-spiritual-light">
            {featuredImageUrl ? (
              <div className="aspect-w-16 aspect-h-9">
                <Image 
                  src={featuredImageUrl}
                  alt={title}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ) : (
              <div className="aspect-w-16 aspect-h-9 bg-pastel-gradient-2"></div>
            )}
            
            <div className="absolute bottom-2 left-2 bg-white/90 rounded-full px-3 py-1 text-xs font-medium">
              {duration} min
            </div>
            
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

export default TrendingMeditationCard; 