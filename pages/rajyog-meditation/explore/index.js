import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../../components/layout/Layout';
import MeditationCard from '../../../components/meditation/MeditationCard';
import { 
  getAgeGroups, 
  getCategories, 
  getMeditations, 
  getLanguages, 
  getLengths 
} from '../../../lib/api/strapi';

export default function ExplorePage({ 
  ageGroups, 
  categories, 
  meditations: initialMeditations, 
  languages, 
  lengths 
}) {
  const [activeFilters, setActiveFilters] = useState({
    ageGroup: '',
    category: '',
    language: '',
    length: '',
    searchQuery: '',
  });

  const [filteredMeditations, setFilteredMeditations] = useState(initialMeditations);
  const [isFiltering, setIsFiltering] = useState(false);

  // Apply filters when they change
  useEffect(() => {
    // In a real application, this would call the API with filters
    // Here, we'll do client-side filtering on the initial data as a simplified approach
    
    setIsFiltering(true);
    
    const filtered = initialMeditations.filter((meditation) => {
      // Filter by search query
      if (activeFilters.searchQuery) {
        const title = meditation.attributes.Title?.toLowerCase() || '';
        const description = meditation.attributes.DisplayTitle?.toLowerCase() || '';
        const query = activeFilters.searchQuery.toLowerCase();
        
        if (!title.includes(query) && !description.includes(query)) {
          return false;
        }
      }
      
      // Other filters would be implemented here in a real scenario
      // where the API supports filtering by these parameters
      
      return true;
    });
    
    setFilteredMeditations(filtered);
    setIsFiltering(false);
  }, [activeFilters, initialMeditations]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      ageGroup: '',
      category: '',
      language: '',
      length: '',
      searchQuery: '',
    });
  };

  return (
    <Layout
      title="Explore Meditations | Brahma Kumaris"
      description="Discover and explore a variety of guided Raja Yoga meditations by Brahma Kumaris. Filter by age group, category, length, and more."
    >
      <Head>
        <meta name="keywords" content="meditation, spirituality, brahma kumaris, raja yoga, guided meditation, explore, filter" />
      </Head>

      {/* Hero Section */}
      <section className="bg-pastel-gradient-1 py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Explore Guided Meditations
            </h1>
            <p className="text-lg text-gray-800">
              Find the perfect meditation for your spiritual journey. Filter by age group, category, duration, and more.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">
              Filter Meditations
            </h2>
            
            <button
              onClick={clearFilters}
              className="inline-flex items-center text-sm text-spiritual-dark hover:text-spiritual-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Clear all filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search meditations..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                value={activeFilters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>
            
            {/* Age Groups */}
            <div>
              <label htmlFor="age-group" className="block text-sm font-medium text-gray-700 mb-1">
                Age Group
              </label>
              <select
                id="age-group"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                value={activeFilters.ageGroup}
                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
              >
                <option value="">All Age Groups</option>
                {ageGroups.map((ageGroup) => (
                  <option key={ageGroup.id} value={ageGroup.attributes.slug}>
                    {ageGroup.attributes.name} ({ageGroup.attributes.spectrum})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Categories */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                value={activeFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.attributes.slug}>
                    {category.attributes.CategoryDisplay || category.attributes.Category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Length */}
            <div>
              <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Duration
              </label>
              <select
                id="length"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                value={activeFilters.length}
                onChange={(e) => handleFilterChange('length', e.target.value)}
              >
                <option value="">Any Duration</option>
                {lengths.map((length) => (
                  <option key={length.id} value={length.attributes.slug}>
                    {length.attributes.Length}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Language */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="language"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                value={activeFilters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
              >
                <option value="">All Languages</option>
                {languages.map((language) => (
                  <option key={language.id} value={language.attributes.Slug}>
                    {language.attributes.Language}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              Results
            </h2>
            
            <p className="text-sm text-gray-600">
              {filteredMeditations.length} meditation{filteredMeditations.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {isFiltering ? (
            <div className="text-center py-10">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : filteredMeditations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMeditations.map((meditation) => (
                <MeditationCard key={meditation.id} meditation={meditation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
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
              <h3 className="mt-2 text-lg font-medium text-gray-900">No meditations found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
              <div className="mt-6">
                <button
                  onClick={clearFilters}
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-spiritual-dark hover:bg-spiritual-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spiritual-dark"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  const ageGroups = await getAgeGroups();
  const categories = await getCategories();
  const meditations = await getMeditations();
  const languages = await getLanguages();
  const lengths = await getLengths();
  
  return {
    props: {
      ageGroups,
      categories,
      meditations,
      languages,
      lengths,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
}