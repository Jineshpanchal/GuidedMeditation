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
    if (imageData[0].attributes?.formats?.Thumbnail?.url) {
      return imageData[0].attributes.formats.Thumbnail.url;
    }
    if (imageData[0].attributes?.formats?.HD?.url) {
      return imageData[0].attributes.formats.HD.url;
    }
    if (imageData[0].attributes?.url) {
      return imageData[0].attributes.url;
    }
  } 
  // Handle object structure
  else if (imageData.attributes) {
    if (imageData.attributes.formats?.Thumbnail?.url) {
      return imageData.attributes.formats.Thumbnail.url;
    }
    if (imageData.attributes.formats?.HD?.url) {
      return imageData.attributes.formats.HD.url;
    }
    if (imageData.attributes.url) {
      return imageData.attributes.url;
    }
  }
  
  return '/images/placeholder.jpg';
};

const RelatedMeditationCard = ({ meditation }) => {
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const [listenedCount, setListenedCount] = useState(parseInt(meditation?.attributes?.Listened || '0', 10));
  const { playMeditation, togglePlay, currentMeditation, isPlaying, isReady } = useAudioPlayer();
  
  // Extract meditation details
  const title = meditation.attributes.Title || 'Guided Meditation';
  const slug = meditation.attributes.Slug;
  const featuredImageUrl = meditation.attributes.FeaturedImage?.data 
    ? getImageUrl(meditation.attributes.FeaturedImage.data) 
    : null;
  const coverImageUrl = meditation.attributes.CoverImage?.data 
    ? getImageUrl(meditation.attributes.CoverImage.data)
    : null;
  const imageUrl = featuredImageUrl || coverImageUrl;
  const duration = meditation.attributes.Duration || '5';
  
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
  
  // Extract benefits text
  const benefits = (() => {
    if (!meditation.attributes.BenefitsShort || !Array.isArray(meditation.attributes.BenefitsShort)) {
      return '';
    }
    const firstBlock = meditation.attributes.BenefitsShort[0];
    if (!firstBlock || !Array.isArray(firstBlock.children)) {
      return '';
    }
    const firstChild = firstBlock.children[0];
    return (firstChild && typeof firstChild.text === 'string') ? firstChild.text : '';
  })();
  
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
      
      // Increased delay to ensure the audio is loaded before playing
      setTimeout(() => {
        // Check if audio is ready before toggling play
        if (isReady) {
          togglePlay();
        } else {
          console.log('Waiting for audio to be ready...');
          // Additional wait and check
          setTimeout(() => {
            if (isReady) {
              togglePlay();
            } else {
              console.warn('Audio still not ready after extended wait');
            }
          }, 1000);
        }
      }, 500);
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <Link href={`/rajyog-meditation/meditations/${slug}`} onClick={handleNavigation}>
        <div className="cursor-pointer flex-1">
          {imageUrl ? (
            <div className="h-48 overflow-hidden relative">
              <Image 
                src={imageUrl} 
                alt={title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 rounded-full px-3 py-1 text-xs font-medium">
                {duration} min
              </div>
            </div>
          ) : (
            <div className="h-48 bg-spiritual-light flex items-center justify-center">
              <span className="text-spiritual-dark text-lg font-medium">Brahma Kumaris</span>
            </div>
          )}
          
          <div className="p-4 relative">
            <h3 className="font-medium text-lg text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {benefits || 'Experience the peace and tranquility of Raja Yoga meditation.'}
            </p>
            
            <div className="flex items-center mt-3 space-x-3 text-xs text-gray-500">
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
            </div>
            
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

export default RelatedMeditationCard; 