import React from 'react';
import Link from 'next/link';

const CategoryCard = ({ 
  category, 
  ageGroup,
  href = `/rajyog-meditation/${ageGroup}/${category.attributes.slug}`,
  className = ''
}) => {
  return (
    <Link href={href} className={`block ${className}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
        <div className="bg-pastel-gradient-1 p-6 h-full flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 mb-2">
            {category.attributes.CategoryDisplay || category.attributes.Category}
          </h3>
          
          <p className="text-sm text-gray-700 flex-grow">
            {category.attributes.ShortIntro?.[0]?.children?.[0]?.text || 'Explore guided meditations in this category.'}
          </p>
          
          <div className="mt-4">
            <span className="inline-block py-1.5 px-3 bg-white bg-opacity-30 backdrop-blur-sm rounded-full text-xs font-medium text-gray-800">
              Explore meditations
            </span>
          </div>
          
          {category.attributes.Trending && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-spiritual-light text-spiritual-dark">
                Trending
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 