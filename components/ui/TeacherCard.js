import React from 'react';
import Link from 'next/link';

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

const TeacherCard = ({ teacher, meditationCount = 0 }) => {
  return (
    <Link href={`/rajyog-meditation/teacher/${teacher.attributes.Slug || ''}`}>
      <div className="group h-full">
        <div className="relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col transform group-hover:-translate-y-1">
          {/* Teacher Image Container - Respects original aspect ratio */}
          <div className="w-full relative overflow-hidden pt-[100%]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {teacher.attributes.FeaturedImage?.data ? (
              <img 
                src={getImageUrl(teacher.attributes.FeaturedImage.data)} 
                alt={teacher.attributes.Name || 'Raja Yoga Teacher'}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.classList.add('bg-gradient-to-br', 'from-spiritual-light', 'to-spiritual-dark/20');
                  const fallback = document.createElement('div');
                  fallback.className = 'absolute inset-0 w-full h-full flex items-center justify-center';
                  fallback.innerHTML = `<span class="text-spiritual-dark font-bold text-5xl">
                    ${teacher.attributes.Name ? teacher.attributes.Name.charAt(0) : 'BK'}
                  </span>`;
                  e.target.parentNode.appendChild(fallback);
                }}
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-spiritual-light to-spiritual-dark/20">
                <span className="text-spiritual-dark font-bold text-5xl">
                  {teacher.attributes.Name ? teacher.attributes.Name.charAt(0) : 'BK'}
                </span>
              </div>
            )}
            
            {/* Meditation Count Badge - Top Right */}
            <div className="absolute top-3 right-3 z-10">
              <div className="flex items-center px-2.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-spiritual-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8M12 4v16M8 8v8" />
                </svg>
                <span className="text-xs font-medium text-spiritual-dark">
                  {meditationCount}
                </span>
              </div>
            </div>
            
            {/* View Profile Button - On Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-spiritual-dark shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                View Profile
              </span>
            </div>
          </div>
          
          {/* Teacher Info */}
          <div className="p-5 flex-grow flex flex-col">
            <h3 className="font-display font-semibold text-lg text-gray-800 group-hover:text-spiritual-dark transition-colors">
              {teacher.attributes.Name || 'Raja Yoga Teacher'}
            </h3>
            
            {teacher.attributes.Designation && (
              <p className="text-sm text-gray-500 mt-1">{teacher.attributes.Designation}</p>
            )}
            
            {teacher.attributes.ShortIntro && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-3 flex-grow">
                {typeof teacher.attributes.ShortIntro === 'string' 
                  ? teacher.attributes.ShortIntro 
                  : teacher.attributes.ShortIntro.map((block, index) => 
                      block.children?.map((child, childIndex) => 
                        <span key={`${index}-${childIndex}`}>{child.text}</span>
                      )
                    )
                }
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TeacherCard; 