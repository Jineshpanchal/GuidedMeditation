import React from 'react';
import MeditationCard from './MeditationCard';

const MeditationCarousel = ({ 
  title, 
  meditations, 
  CardComponent = MeditationCard,
  showViewAllButton = false,
  viewAllLink = '',
  viewAllText = 'View All',
  backgroundColor = 'bg-white',
  showHeaderButton = false,
  headerButtonText = 'More'
}) => {
  return (
    <section className={`py-8 ${backgroundColor}`}>
      <div className="container-custom">
        {/* Header with title and optional More button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900">
          {title}
        </h2>
          
          {/* Header More button */}
          {showHeaderButton && viewAllLink && (
            <a 
              href={viewAllLink} 
              className="flex items-center text-spiritual-dark hover:text-spiritual-accent transition-colors group"
            >
              <span className="text-sm font-medium mr-1">{headerButtonText}</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
        
        <div className="relative">
          {/* Carousel container */}
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-4 pb-2">
              {meditations.map((meditation) => (
                <div key={meditation.id} className="min-w-[260px] md:min-w-[300px] max-w-[300px] flex-shrink-0">
                  <CardComponent meditation={meditation} />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Optional View All Button (only show if not using header button) */}
        {!showHeaderButton && showViewAllButton && viewAllLink && (
          <div className="mt-8 text-center">
            <a href={viewAllLink} className="inline-block py-3 px-6 bg-spiritual-dark hover:bg-spiritual-accent text-white rounded-md transition-colors cursor-pointer">
              {viewAllText}
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default MeditationCarousel; 