import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../../components/layout/Layout';
import MeditationCard from '../../../components/meditation/MeditationCard';
import { getMeditations } from '../../../lib/api/strapi';

export default function ExplorePage({ meditations: initialMeditations }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc' or 'desc'
  const [isLoading, setIsLoading] = useState(false);
  const [displayedMeditations, setDisplayedMeditations] = useState(initialMeditations);

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
    let filtered = initialMeditations;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = initialMeditations.filter(meditation => {
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
  }, [searchQuery, sortOption, sortDirection, initialMeditations]);

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
      title="Explore Meditations | Brahma Kumaris"
      description="Discover and explore a variety of guided Raja Yoga meditations by Brahma Kumaris."
    >
      <Head>
        <meta name="keywords" content="meditation, spirituality, brahma kumaris, raja yoga, guided meditation, explore" />
      </Head>

      {/* Hero Section with search */}
      <section className="bg-gradient-to-r from-spiritual-light/50 to-spiritual-accent/20 py-12 md:py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Explore Guided Meditations
            </h1>
            <p className="text-lg text-gray-800 mb-8">
              Find the perfect meditation for your spiritual journey
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
                placeholder="Search meditations..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-full shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spiritual-accent focus:border-spiritual-accent text-gray-900"
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
                All Meditations
              </h2>
              
              {/* Horizontal scrollable area for sorting options */}
              <div className="w-full md:w-auto overflow-x-auto hide-scrollbar">
                <div className="flex items-center space-x-2 min-w-max py-1">
                  <button
                    onClick={() => handleSortChange('default')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                      sortOption === 'default' 
                        ? 'bg-spiritual-dark text-white' 
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
                        ? 'bg-spiritual-dark text-white' 
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
                        ? 'bg-spiritual-dark text-white' 
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
                        ? 'bg-spiritual-dark text-white' 
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
                        ? 'bg-spiritual-dark text-white' 
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
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No meditations found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search query to find what you're looking for.
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-spiritual-accent hover:bg-spiritual-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spiritual-accent"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  // Fetch meditations with Media field to ensure audio playability
  const meditations = await getMeditations({
    'fields[0]': 'Title',
    'fields[1]': 'Slug', 
    'fields[2]': 'DisplayTitle',
    'fields[3]': 'Duration',
    'fields[4]': 'Trending',
    'fields[5]': 'Listened',
    'fields[6]': 'like',
    'populate[FeaturedImage]': '*',
    'populate[Media]': '*',
    'populate[AudioFile]': '*',
    'populate[gm_rajyoga_teachers][fields][0]': 'Name',
    'populate[gm_rajyoga_teachers][fields][1]': 'Slug',
    'populate[Category]': '*',
    'populate[AgeGroup]': '*',
    'populate[Length]': '*',
    'populate[Language]': '*',
    'populate[gm_length]': '*',
    'pagination[pageSize]': 100
  });

  return {
    props: {
      meditations,
    },
    revalidate: 60, // Re-generate the page after 60 seconds
  };
}