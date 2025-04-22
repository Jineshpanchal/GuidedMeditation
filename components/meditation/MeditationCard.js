import React from 'react';
import Link from 'next/link';

const MeditationCard = ({ 
  meditation, 
  href = `/rajyog-meditation/meditations/${meditation.attributes.Slug}`,
  className = ''
}) => {
  return (
    <Link href={href} className={`block ${className}`}>
      <div className="meditation-card bg-white">
        <div className="aspect-w-16 aspect-h-9 bg-pastel-gradient-2 flex items-center justify-center p-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-white" 
              fill="none" 
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg text-gray-900 mb-2">
            {meditation.attributes.Title || 'Guided Meditation'}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{meditation.attributes.Duration || '5'} min</span>
            
            {/* Teacher info could be added here when available */}
            {/*
            <span className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
              Teacher Name
            </span>
            */}
          </div>
          
          {meditation.attributes.Trending && (
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-spiritual-light text-spiritual-dark">
                Trending
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MeditationCard; 