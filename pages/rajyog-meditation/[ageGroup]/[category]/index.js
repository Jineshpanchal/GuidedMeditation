import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../../components/layout/Layout';
import MeditationCard from '../../../../components/meditation/MeditationCard';
import Image from 'next/image';
import { getAgeGroups, getCategories, getMeditations } from '../../../../lib/api/strapi-optimized';

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

export default function CategoryPage({ ageGroup, category, meditations: initialMeditations }) {
  const [sortOption, setSortOption] = useState('default');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [isLoading, setIsLoading] = useState(false);
  const [displayedMeditations, setDisplayedMeditations] = useState(initialMeditations);
  
  if (!category || !ageGroup) {
    return <div>Category or age group not found</div>;
  }

  const categoryName = category.attributes.CategoryDisplay || category.attributes.Category;
  const categoryDescription = category.attributes.ShortIntro?.[0]?.children?.[0]?.text || '';
  const ageGroupName = ageGroup.attributes.name;
  
  // Toggle sort direction when clicking on the same option
  const handleSortChange = (option) => {
    if (option === sortOption) {
      // Toggle direction if clicking the same option
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new option and reset to descending order
      setSortOption(option);
      setSortDirection('desc');
    }
  };

  // Apply sorting
  useEffect(() => {
    setIsLoading(true);
    
    // Sort by selected option
    let sorted = [...initialMeditations];
    const multiplier = sortDirection === 'asc' ? 1 : -1;
    
    switch (sortOption) {
      case 'listened':
        sorted.sort((a, b) => {
          const countA = parseInt(a.attributes.Listened || '0', 10);
          const countB = parseInt(b.attributes.Listened || '0', 10);
          return multiplier * (countB - countA);
        });
        break;
      case 'likes':
        sorted.sort((a, b) => {
          const countA = parseInt(a.attributes.like || '0', 10);
          const countB = parseInt(b.attributes.like || '0', 10);
          return multiplier * (countB - countA);
        });
        break;
      case 'trending':
        if (sortDirection === 'desc') {
          sorted = sorted.filter(m => m.attributes.Trending)
            .concat(sorted.filter(m => !m.attributes.Trending));
        } else {
          sorted = sorted.filter(m => !m.attributes.Trending)
            .concat(sorted.filter(m => m.attributes.Trending));
        }
        break;
      case 'duration':
        sorted.sort((a, b) => {
          const durationA = parseInt(a.attributes.Duration || '0', 10);
          const durationB = parseInt(b.attributes.Duration || '0', 10);
          return multiplier * (durationA - durationB);
        });
        break;
      default:
        // Leave in default order
        break;
    }
    
    setDisplayedMeditations(sorted);
    setIsLoading(false);
  }, [sortOption, sortDirection, initialMeditations]);

  // Helper to render sort direction icon - only for non-default sorts
  const renderSortIcon = (option) => {
    if (sortOption !== option || option === 'default') return null;
    
    return sortDirection === 'asc' 
      ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
      : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 inline" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>;
  };

  return (
    <Layout
      title={`${categoryName} Meditations for ${ageGroupName} | Brahma Kumaris`}
      description={`${categoryDescription} Guided meditations for ${ageGroupName} (${ageGroup.attributes.spectrum}).`}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, ${categoryName.toLowerCase()}, ${ageGroupName.toLowerCase()}, guided meditation`} />
      </Head>

      {/* Hero Section - Modern Asymmetric Design */}
      <section className="relative bg-gradient-to-br from-indigo-50 to-purple-50 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-indigo-100 to-transparent opacity-70"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-purple-100 to-transparent opacity-50"></div>
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-bl from-pink-200 to-indigo-200 blur-xl opacity-30"></div>
        <div className="absolute -bottom-8 left-1/4 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-300 to-purple-200 blur-lg opacity-20"></div>
        
        <div className="container-custom relative z-10 py-10 md:py-16">
          {/* Two Column Layout for Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Content Column */}
            <div className="lg:col-span-7 relative">
              {/* Breadcrumb Navigation */}
              <nav className="mb-4 md:mb-6">
                <Link 
                  href={`/rajyog-meditation/${ageGroup.attributes.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to {ageGroupName}
                </Link>
              </nav>
              
              {/* Indication Badge */}
              <div className="mb-4 inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 px-4 py-1.5 text-xs font-medium text-indigo-800">
                <span className="mr-2 h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                For {ageGroupName} ({ageGroup.attributes.spectrum})
              </div>
              
              {/* Title with Gradient Text */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600">
                {categoryName}
              </h1>
              
              {/* Divider */}
              <div className="relative">
                <div className="h-1 w-24 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 mb-6"></div>
              </div>
              
              {/* Description */}
              {categoryDescription && (
                <p className="text-gray-700 text-lg md:text-xl max-w-2xl leading-relaxed">
                  {categoryDescription}
                </p>
              )}
            </div>
            
            {/* Image Column */}
            <div className="lg:col-span-5 relative">
              {category.attributes.FeaturedImage?.data && (
                <div className="relative rounded-2xl overflow-hidden shadow-xl transform lg:translate-x-4 aspect-[4/3] max-h-80">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/30 to-purple-500/20 mix-blend-multiply z-10 rounded-2xl"></div>
                    <Image 
                      src={getImageUrl(category.attributes.FeaturedImage.data)} 
                      alt={categoryName}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-2xl"
                      priority
                    />
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full bg-pink-300 blur opacity-40"></div>
                  <div className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full bg-indigo-400 blur opacity-40"></div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Bottom Border with Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 30" className="w-full h-auto">
            <path 
              d="M0,0 C300,20 600,30 900,20 C1050,15 1150,10 1200,5 L1200,30 L0,30 Z" 
              className="fill-white"
            />
          </svg>
        </div>
      </section>

      {/* Meditations */}
      <section className="py-12">
        <div className="container-custom">
          <div className="mb-8">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">
                Guided <span className="font-normal">commentaries</span>
              </h2>
              
              {/* Horizontal scrollable area for sorting options */}
              <div className="w-full md:w-auto overflow-x-auto hide-scrollbar">
                <div className="flex items-center space-x-2 min-w-max py-1">
                  <button
                    onClick={() => handleSortChange('default')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'default' 
                        ? 'bg-spiritual-dark text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Default
                    {renderSortIcon('default')}
                  </button>
                  <button
                    onClick={() => handleSortChange('trending')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'trending' 
                        ? 'bg-spiritual-dark text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Trending
                    {renderSortIcon('trending')}
                  </button>
                  <button
                    onClick={() => handleSortChange('listened')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'listened' 
                        ? 'bg-spiritual-dark text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Most Listened
                    {renderSortIcon('listened')}
                  </button>
                  <button
                    onClick={() => handleSortChange('likes')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'likes' 
                        ? 'bg-spiritual-dark text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Most Liked
                    {renderSortIcon('likes')}
                  </button>
                  <button
                    onClick={() => handleSortChange('duration')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'duration' 
                        ? 'bg-spiritual-dark text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Duration
                    {renderSortIcon('duration')}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Meditations count */}
            <p className="text-sm text-gray-600">
              {displayedMeditations.length} meditation{displayedMeditations.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* Meditation Cards */}
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-spiritual-accent"></div>
            </div>
          ) : displayedMeditations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMeditations.map((meditation) => (
                <MeditationCard key={meditation.id} meditation={meditation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No meditations found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-6 text-center">
              How to Practice
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Find a quiet place where you won't be disturbed. Sit comfortably with your back straight, either on a chair or on the floor. Close your eyes and disconnect from external distractions.
              </p>
              
              <p>
                Allow the guided commentary to lead you into a state of soul-consciousness. Breathe naturally and let thoughts come and go without judgment. If your mind wanders, gently bring it back to the meditation.
              </p>
              
              <p>
                After completing the meditation, take a moment to sit in silence before opening your eyes. Notice how you feel and try to carry this awareness into your day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const ageGroups = await getAgeGroups();
    const categories = await getCategories();
    
    const paths = [];
    
    for (const ageGroup of ageGroups) {
      // Ensure ageGroup slug is a string
      const ageGroupSlug = typeof ageGroup.attributes?.slug === 'string' 
        ? ageGroup.attributes.slug 
        : String(ageGroup.attributes?.slug || '');
        
      if (!ageGroupSlug) {
        console.warn('Skipping ageGroup with missing slug:', ageGroup);
        continue;
      }
      
      for (const category of categories) {
        // Ensure category slug is a string
        const categorySlug = typeof category.attributes?.slug === 'string' 
          ? category.attributes.slug 
          : String(category.attributes?.slug || '');
          
        if (!categorySlug) {
          console.warn('Skipping category with missing slug:', category);
          continue;
        }
        
        paths.push({
          params: {
            ageGroup: ageGroupSlug,
            category: categorySlug,
          },
        });
      }
    }
    
    console.log(`Generated ${paths.length} static paths for category pages`);
    
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error in getStaticPaths for category page:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { ageGroup: ageGroupSlug, category: categorySlug } = params;
    
    // Get the age group data using optimized function
    const ageGroups = await getAgeGroups('withImage');
    const ageGroup = ageGroups.find(
      (group) => group.attributes.slug === ageGroupSlug
    );
    
    if (!ageGroup) {
      return {
        notFound: true,
      };
    }
    
    // Get the category data using optimized function
    const categories = await getCategories('withImage');
    const category = categories.find(
      (cat) => cat.attributes.slug === categorySlug
    );
    
    if (!category) {
      return {
        notFound: true,
      };
    }
    
    // Fetch meditations using optimized function with filters
    let meditations = await getMeditations('full', {
      'filters[gm_categories][id][$eq]': category.id,
    });
    
    // If no meditations found by ID, try fetching by slug as fallback
    if (!meditations || meditations.length === 0) {
      console.log(`No meditations found by category ID. Trying by slug: ${categorySlug}`);
      meditations = await getMeditations('full', {
        'filters[gm_categories][slug][$eq]': categorySlug,
      });
    }
    
    console.log(`Fetched ${meditations.length} meditations for category: ${categorySlug} (ID: ${category.id})`);
    
    return {
      props: {
        ageGroup,
        category,
        meditations: meditations || [],
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps for category page:', error);
    return {
      props: {
        ageGroup: null,
        category: null,
        meditations: [],
      },
      revalidate: 60, // Try again sooner if there was an error
    };
  }
}