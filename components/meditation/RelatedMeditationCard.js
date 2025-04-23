import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

const RelatedMeditationCard = ({ meditation }) => {
  const [isThisPlaying, setIsThisPlaying] = useState(false);
  const { playMeditation, togglePlay, currentMeditation, isPlaying } = useAudioPlayer();
  
  // Extract meditation details
  const title = meditation.attributes.Title || 'Guided Meditation';
  const slug = meditation.attributes.Slug;
  const featuredImageUrl = meditation.attributes.FeaturedImage?.data?.attributes?.url;
  const coverImageUrl = meditation.attributes.CoverImage?.data?.attributes?.url;
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
  
  const handlePlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("Play button clicked for:", title);
    
    // If this is already the current meditation, just toggle play/pause
    if (currentMeditation && currentMeditation.id === meditation.id) {
      console.log("Toggling play/pause for current meditation");
      togglePlay();
    } else {
      // Otherwise, set this as the current meditation and play it
      console.log("Setting new meditation and playing:", title);
      playMeditation(meditation);
      // Small delay to ensure the audio is loaded before playing
      setTimeout(() => {
        console.log("Calling toggle play after delay");
        togglePlay();
      }, 100);
    }
  };

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