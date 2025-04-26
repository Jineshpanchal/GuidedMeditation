import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const CategoryCard = ({ category, ageGroup }) => {
  const { Category, CategoryDisplay, slug, ShortIntro, FeaturedImage } = category.attributes;
  const featuredImageUrl = FeaturedImage?.data?.attributes?.url;
  const categoryName = CategoryDisplay || Category;
  
  // Extract text from ShortIntro that could be a string or rich text object
  const shortIntroText = typeof ShortIntro === 'string' 
    ? ShortIntro 
    : (ShortIntro?.[0]?.children?.[0]?.text || 'Guided meditation for spiritual growth and inner peace.');

  return (
    <Link href={`/rajyog-meditation/${ageGroup}/${slug}`}>
      <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:transform hover:scale-[1.02] group h-full flex flex-col">
        <div className="h-32 bg-spiritual-light relative overflow-hidden">
          {featuredImageUrl ? (
            <Image 
              src={featuredImageUrl}
              alt={categoryName || 'Category'}
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-pastel-gradient-2"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        
        <div className="p-4 flex-grow">
          <h3 className="font-medium text-gray-900 mb-2 group-hover:text-spiritual-dark transition-colors">
            {categoryName || 'Meditation Category'}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {shortIntroText}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard; 