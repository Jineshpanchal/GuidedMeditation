import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';
import axios from 'axios';

// Helper function to handle different FeaturedImage data structures and get the best URL
const getImageUrl = (imageData) => {
  if (!imageData) return '/images/placeholder.jpg';
  
  // Handle array structure
  if (Array.isArray(imageData) && imageData.length > 0) {
    if (imageData[0].attributes?.formats?.HD?.url) {
      return imageData[0].attributes.formats.HD.url;
    }
    if (imageData[0].attributes?.formats?.Thumbnail?.url) {
      return imageData[0].attributes.formats.Thumbnail.url;
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
    if (imageData.attributes.formats?.Thumbnail?.url) {
      return imageData.attributes.formats.Thumbnail.url;
    }
    if (imageData.attributes.url) {
      return imageData.attributes.url;
    }
  }
  
  return '/images/placeholder.jpg';
};

const TrendingMeditationCard = ({ meditation }) => {
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const [listenedCount, setListenedCount] = useState(parseInt(meditation?.attributes?.Listened || '0', 10));
  const { playMeditation, togglePlay, currentMeditation, isPlaying, isReady, tryPlayWhenReady } = useAudioPlayer();
  
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
  
  // Function to update Listened count when play is clicked
  const updateListenedCount = async () => {
    try {
      const response = await axios.post('/api/meditation/interaction', {
        meditationId: meditation.id,
        action: 'listened',
      });
      
      if (response.data.success) {
        const newCount = response.data.data.listened;
        setListenedCount(newCount);
      }
    } catch (error) {
      console.error('Failed to update listened count:', error);
    }
  };
  
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    updateListenedCount();
    
    if (!currentMeditation || currentMeditation.id !== meditation.id) {
      // Start new meditation from beginning
      playMeditation(meditation, true);
      
      // Use tryPlayWhenReady for better handling of not-ready audio
      setTimeout(() => {
        tryPlayWhenReady();
      }, 50);
    } else {
      // Already current meditation, just toggle
          togglePlay();
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
            
            <div className="absolute bottom-2 left-20 flex items-center space-x-3">
              <span className="flex items-center bg-white/90 rounded-full px-2 py-1 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {listenedCount}
              </span>
              <span className="flex items-center bg-white/90 rounded-full px-2 py-1 text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {meditation.attributes.like || '0'}
              </span>
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