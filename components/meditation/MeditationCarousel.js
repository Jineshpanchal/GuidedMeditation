import React from 'react';
import MeditationCard from './MeditationCard';

const MeditationCarousel = ({ title, meditations }) => {
  return (
    <section className="py-8 bg-white">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-6">
          {title}
        </h2>
        
        <div className="relative">
          {/* Carousel container */}
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="flex gap-4 pb-2">
              {meditations.map((meditation) => (
                <div key={meditation.id} className="min-w-[260px] md:min-w-[300px] max-w-[300px] flex-shrink-0">
                  <MeditationCard meditation={meditation} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeditationCarousel; 