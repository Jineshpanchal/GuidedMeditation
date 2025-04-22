import React from 'react';
import Link from 'next/link';

const AgeGroupCard = ({ 
  ageGroup, 
  href = `/rajyog-meditation/${ageGroup.attributes.slug}`,
  className = ''
}) => {
  return (
    <Link href={href} className={`block ${className}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="bg-pastel-gradient-3 p-6 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {ageGroup.attributes.name}
          </h3>
          
          <p className="text-sm text-gray-700 flex-grow">
            {ageGroup.attributes.ShortBio?.[0]?.children?.[0]?.text || `Age group: ${ageGroup.attributes.spectrum}`}
          </p>
          
          <div className="mt-4 flex items-center">
            <span className="inline-block py-1.5 px-3 bg-white bg-opacity-30 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800 mr-2">
              {ageGroup.attributes.spectrum}
            </span>
            
            <span className="inline-block py-1.5 px-3 bg-white bg-opacity-30 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
              Explore
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AgeGroupCard; 