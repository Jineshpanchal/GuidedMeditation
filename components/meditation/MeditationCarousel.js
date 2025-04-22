import React from 'react';
import MeditationCard from './MeditationCard';

const MeditationCarousel = ({ title, meditations }) => {
  return (
    <div className="py-8">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-6">
          {title}
        </h2>
        
        <div className="relative">
          {/* Carousel container */}
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex space-x-6">
              {meditations.map((meditation) => (
                <div key={meditation.id} className="w-72 flex-shrink-0">
                  <MeditationCard meditation={meditation} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Gradient fade effect */}
          <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white pointer-events-none" />
          <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default MeditationCarousel; 