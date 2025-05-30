import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import MeditationCard from '../../../components/meditation/MeditationCard';
import LoadingSpinner, { SkeletonGrid } from '../../../components/ui/LoadingSpinner';
import { getExplorePageData } from '../../../lib/api/strapi-optimized';

// Helper functions for managing liked meditations in localStorage
const getLikedMeditations = () => {
  try {
    const liked = localStorage.getItem('liked_meditations');
    return liked ? JSON.parse(liked) : [];
  } catch (e) {
    console.warn('Error reading liked meditations from localStorage:', e);
    return [];
  }
};

export default function LikedMeditationsPage({ allMeditations = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [isLoading, setIsLoading] = useState(true);
  const [likedMeditations, setLikedMeditations] = useState([]);
  const [displayedMeditations, setDisplayedMeditations] = useState([]);

  // Load liked meditations from localStorage
  useEffect(() => {
    const likedIds = getLikedMeditations();
    const filtered = allMeditations.filter(meditation => 
      likedIds.includes(meditation.id.toString()) || likedIds.includes(meditation.id)
    );
    setLikedMeditations(filtered);
    setDisplayedMeditations(filtered);
    setIsLoading(false);
  }, [allMeditations]);

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

  // Apply search and sorting
  useEffect(() => {
    setIsLoading(true);
    
    // First, filter by search query
    let filtered = likedMeditations;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = likedMeditations.filter(meditation => {
        const title = meditation.attributes.Title?.toLowerCase() || '';
        const description = meditation.attributes.DisplayTitle?.toLowerCase() || '';
        return title.includes(query) || description.includes(query);
      });
    }
    
    // Then sort by selected option
    let sorted = [...filtered];
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
  }, [searchQuery, sortOption, sortDirection, likedMeditations]);

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
      title="Liked Meditations | Brahma Kumaris Rajyoga Meditation"
      description="Your collection of liked guided Rajyoga meditations by Brahma Kumaris."
    >
      <Head>
        <meta name="keywords" content="meditation, spirituality, brahma kumaris, rajyoga, guided meditation, liked, favorites" />
      </Head>

      {/* Hero Section with search */}
      <section className="hero-section relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/90 via-spiritual-dark/80 to-rose-900/90"></div>
        <div className="absolute inset-0 bg-[url('/patterns/sacred-yantra.svg')] opacity-10 bg-repeat bg-[length:400px_400px] rotate-45"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-1/3 right-[15%] w-72 h-72 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/10 blur-3xl"></div>
        <div className="absolute -bottom-16 left-[10%] w-56 h-56 rounded-full bg-gradient-to-tr from-spiritual-purple/20 to-red-400/20 blur-2xl"></div>
        <div className="absolute top-1/4 left-[25%] w-40 h-40 rounded-full bg-gradient-radial from-rose-400/20 to-transparent blur-xl animate-pulse"></div>
        
        {/* Content Container */}
        <div className="container-custom py-8 md:py-12 pt-20 md:pt-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link 
                href="/rajyog-meditation/explore"
                className="inline-flex items-center px-4 py-2 text-sm text-white hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all shadow-sm hover:shadow-md border border-white/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Explore
              </Link>
            </div>

            <div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-white">
                Liked Meditations
              </h1>
            </div>
            <p className="text-lg text-gray-100 mb-8">
              Your personal collection of favorite meditations
            </p>
            
            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search your liked meditations..."
                className="block w-full pl-10 pr-3 py-3 border border-white/20 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white/90 backdrop-blur-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main content area */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container-custom">
          {/* Sort options and result count */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Liked Meditations
              </h2>
              
              {/* Horizontal scrollable area for sorting options */}
              <div className="w-full md:w-auto overflow-x-auto hide-scrollbar">
                <div className="flex items-center space-x-2 min-w-max py-1">
                  <button
                    onClick={() => handleSortChange('default')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'default' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Default
                    {renderSortIcon('default')}
                  </button>
                  <button
                    onClick={() => handleSortChange('trending')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'trending' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Trending
                    {renderSortIcon('trending')}
                  </button>
                  <button
                    onClick={() => handleSortChange('listened')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'listened' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Most Listened
                    {renderSortIcon('listened')}
                  </button>
                  <button
                    onClick={() => handleSortChange('likes')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'likes' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Most Liked
                    {renderSortIcon('likes')}
                  </button>
                  <button
                    onClick={() => handleSortChange('duration')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'duration' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-100'
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
              {displayedMeditations.length} meditation{displayedMeditations.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>
          
          {/* Meditation Cards */}
          {isLoading ? (
            <SkeletonGrid count={6} />
          ) : displayedMeditations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMeditations.map((meditation) => (
                <MeditationCard 
                  key={meditation.id} 
                  meditation={meditation} 
                  className="h-full"
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <svg
                className="mx-auto h-16 w-16 text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchQuery ? 'No matching meditations found' : 'No liked meditations yet'}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchQuery 
                  ? "Try adjusting your search query to find what you're looking for."
                  : "Start exploring meditations and click the heart icon to add them to your collection."
                }
              </p>
              <div className="mt-6 space-y-3">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Clear search
                  </button>
                ) : (
                  <Link
                    href="/rajyog-meditation/explore"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                    Explore Meditations
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    console.log('Fetching meditations data for liked page...');
    const startTime = Date.now();
    
    // Fetch all meditations so we can filter them client-side for liked ones
    const { meditations } = await getExplorePageData();
    
    const endTime = Date.now();
    console.log(`Liked page data fetched in ${endTime - startTime}ms`);

    return {
      props: {
        allMeditations: meditations,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error('Error fetching liked page data:', error);
    return {
      props: {
        allMeditations: [],
      },
      revalidate: 60, // Try again sooner if there was an error
    };
  }
}