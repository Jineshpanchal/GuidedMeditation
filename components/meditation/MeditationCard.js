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

const MeditationCard = ({ 
  meditation, 
  href = `/rajyog-meditation/meditations/${meditation.attributes.Slug}`,
  className = ''
}) => {
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const [listenedCount, setListenedCount] = useState(parseInt(meditation?.attributes?.Listened || '0', 10));
  
  // Get image URL using the helper function
  const featuredImageUrl = meditation.attributes.FeaturedImage?.data
    ? getImageUrl(meditation.attributes.FeaturedImage.data)
    : null;
  
  const { playMeditation, togglePlay, currentMeditation, isPlaying, isReady, tryPlayWhenReady } = useAudioPlayer();
  
  // Get teacher information - simplified to handle our optimized data structure
  const teacher = meditation.attributes.gm_rajyoga_teachers?.data && 
                 meditation.attributes.gm_rajyoga_teachers.data.length > 0 ? 
                 meditation.attributes.gm_rajyoga_teachers.data[0].attributes.Name : 
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
    
    // Update listen count when playing a new meditation
    if (!currentMeditation || currentMeditation.id !== meditation.id) {
      updateListenedCount();
    }
    
    // If this is already the current meditation, just toggle play/pause
    if (currentMeditation && currentMeditation.id === meditation.id) {
      togglePlay();
    } else {
      // Otherwise, set this as the current meditation and play it
      playMeditation(meditation);
      
      // Use tryPlayWhenReady for immediate playback
      setTimeout(() => {
        tryPlayWhenReady();
      }, 50);
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
            
            <div className="flex items-center mt-2 space-x-3 text-xs text-gray-500">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
                {listenedCount}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                {meditation.attributes.like || '0'}
              </span>
              {meditation.attributes.Trending && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                  Trending
                </span>
              )}
            </div>
            
            {/* Play button in bottom right */}
            <button
              onClick={handlePlayClick}
              className={`absolute bottom-2 right-2 p-2 rounded-full w-9 h-9 flex items-center justify-center transition-colors ${
                isThisPlaying 
                  ? 'bg-spiritual-dark text-white' 
                  : 'bg-spiritual-light text-spiritual-dark hover:bg-spiritual-dark hover:text-white'
              }`}
              aria-label={isThisPlaying ? "Pause meditation" : "Play meditation"}
            >
              {isThisPlaying ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
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