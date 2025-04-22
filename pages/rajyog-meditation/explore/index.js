import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const filtersRef = useRef(null);

  // Handle clicks outside of the mobile filter panel
  useEffect(() => {
    function handleClickOutside(event) {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowMobileFilters(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply filters when they change
  useEffect(() => {
    setIsFiltering(true);
    
    const filtered = initialMeditations.filter((meditation) => {
      // Filter by tab category
      if (activeTab !== 'all' && meditation.attributes.Category?.data?.attributes?.slug !== activeTab) {
        return false;
      }
      
      // Filter by search query
      if (activeFilters.searchQuery) {
        const title = meditation.attributes.Title?.toLowerCase() || '';
        const description = meditation.attributes.DisplayTitle?.toLowerCase() || '';
        const query = activeFilters.searchQuery.toLowerCase();
        
        if (!title.includes(query) && !description.includes(query)) {
          return false;
        }
      }
      
      // Filter by age group
      if (activeFilters.ageGroup && meditation.attributes.AgeGroup?.data?.attributes?.slug !== activeFilters.ageGroup) {
        return false;
      }
      
      // Filter by category
      if (activeFilters.category && meditation.attributes.Category?.data?.attributes?.slug !== activeFilters.category) {
        return false;
      }
      
      // Filter by language
      if (activeFilters.language && meditation.attributes.Language?.data?.attributes?.Slug !== activeFilters.language) {
        return false;
      }
      
      // Filter by length
      if (activeFilters.length && meditation.attributes.Length?.data?.attributes?.slug !== activeFilters.length) {
        return false;
      }
      
      return true;
    });
    
    setFilteredMeditations(filtered);
    setIsFiltering(false);
  }, [activeFilters, initialMeditations, activeTab]);

  // Get available options for each filter based on current selections
  const availableFilters = useMemo(() => {
    // Start with all meditations
    let filteredSet = [...initialMeditations];
    
    // Apply current tab filter
    if (activeTab !== 'all') {
      filteredSet = filteredSet.filter(meditation => 
        meditation.attributes.Category?.data?.attributes?.slug === activeTab
      );
    }
    
    // Apply current search query
    if (activeFilters.searchQuery) {
      const query = activeFilters.searchQuery.toLowerCase();
      filteredSet = filteredSet.filter(meditation => {
        const title = meditation.attributes.Title?.toLowerCase() || '';
        const description = meditation.attributes.DisplayTitle?.toLowerCase() || '';
        return title.includes(query) || description.includes(query);
      });
    }
    
    // Create filtered sets for each filter type
    const ageGroupFiltered = activeFilters.ageGroup 
      ? filteredSet.filter(m => m.attributes.AgeGroup?.data?.attributes?.slug === activeFilters.ageGroup)
      : filteredSet;
      
    const categoryFiltered = activeFilters.category
      ? filteredSet.filter(m => m.attributes.Category?.data?.attributes?.slug === activeFilters.category)
      : filteredSet;
      
    const languageFiltered = activeFilters.language
      ? filteredSet.filter(m => m.attributes.Language?.data?.attributes?.Slug === activeFilters.language)
      : filteredSet;
      
    const lengthFiltered = activeFilters.length
      ? filteredSet.filter(m => m.attributes.Length?.data?.attributes?.slug === activeFilters.length)
      : filteredSet;
    
    // Get unique available values for each filter type
    // For Age Groups
    const availableAgeGroups = new Set();
    filteredSet.filter(m => !activeFilters.ageGroup).forEach(m => {
      if (m.attributes.AgeGroup?.data?.attributes?.slug) {
        availableAgeGroups.add(m.attributes.AgeGroup.data.attributes.slug);
      }
    });
    
    // For Categories - Respect parent/child relationship with age groups
    const availableCategories = new Set();
    (activeFilters.ageGroup ? ageGroupFiltered : filteredSet).forEach(m => {
      if (m.attributes.Category?.data?.attributes?.slug) {
        availableCategories.add(m.attributes.Category.data.attributes.slug);
      }
    });
    
    // For Languages
    const availableLanguages = new Set();
    filteredSet.filter(m => !activeFilters.language).forEach(m => {
      if (m.attributes.Language?.data?.attributes?.Slug) {
        availableLanguages.add(m.attributes.Language.data.attributes.Slug);
      }
    });
    
    // For Lengths
    const availableLengths = new Set();
    filteredSet.filter(m => !activeFilters.length).forEach(m => {
      if (m.attributes.Length?.data?.attributes?.slug) {
        availableLengths.add(m.attributes.Length.data.attributes.slug);
      }
    });
    
    return {
      ageGroups: Array.from(availableAgeGroups),
      categories: Array.from(availableCategories),
      languages: Array.from(availableLanguages),
      lengths: Array.from(availableLengths)
    };
  }, [initialMeditations, activeFilters, activeTab]);

  const handleFilterChange = (filterType, value) => {
    setActiveFilters((prev) => {
      // If changing age group and we have a category selected, 
      // check if that category will still be valid with the new age group
      if (filterType === 'ageGroup' && prev.category) {
        // Find meditations with the new age group
        const medsWithNewAgeGroup = initialMeditations.filter(
          m => m.attributes.AgeGroup?.data?.attributes?.slug === value
        );
        
        // Check if any of these meditations have the currently selected category
        const categoryStillValid = medsWithNewAgeGroup.some(
          m => m.attributes.Category?.data?.attributes?.slug === prev.category
        );
        
        // If the category is no longer valid, clear it
        if (!categoryStillValid) {
          return {
            ...prev,
            [filterType]: value,
            category: ''
          };
        }
      }
      
      return {
        ...prev,
        [filterType]: value,
      };
    });
  };

  const clearFilters = () => {
    setActiveFilters({
      ageGroup: '',
      category: '',
      language: '',
      length: '',
      searchQuery: '',
    });
    setActiveTab('all');
  };

  // Get popular categories for tabs based on meditation count
  const mainCategories = useMemo(() => {
    // Count meditations per category
    const categoryCounts = {};
    initialMeditations.forEach(meditation => {
      const categorySlug = meditation.attributes.Category?.data?.attributes?.slug;
      if (categorySlug) {
        categoryCounts[categorySlug] = (categoryCounts[categorySlug] || 0) + 1;
      }
    });
    
    // Sort categories by count and get top 5
    return categories
      .filter(category => categoryCounts[category.attributes.slug])
      .sort((a, b) => 
        (categoryCounts[b.attributes.slug] || 0) - (categoryCounts[a.attributes.slug] || 0)
      )
      .slice(0, 5);
  }, [categories, initialMeditations]);

  return (
    <Layout
      title="Explore Meditations | Brahma Kumaris"
      description="Discover and explore a variety of guided Raja Yoga meditations by Brahma Kumaris. Filter by age group, category, length, and more."
    >
      <Head>
        <meta name="keywords" content="meditation, spirituality, brahma kumaris, raja yoga, guided meditation, explore, filter" />
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
                value={activeFilters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="bg-white sticky top-16 z-10 border-b shadow-sm">
        <div className="container-custom py-2">
          <div className="flex items-center space-x-1 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition duration-150 ${
                activeTab === 'all' 
                  ? 'bg-spiritual-accent text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Meditations
            </button>
            
            {mainCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.attributes.slug)}
                className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition duration-150 ${
                  activeTab === category.attributes.slug 
                    ? 'bg-spiritual-accent text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category.attributes.CategoryDisplay || category.attributes.Category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container-custom">
          {/* Mobile filter toggle button */}
          <div className="md:hidden mb-6">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md bg-white shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Meditations ({Object.values(activeFilters).filter(v => v).length})
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Desktop Filters sidebar */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-36">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                  
                  <button
                    onClick={clearFilters}
                    className="text-sm text-spiritual-dark hover:text-spiritual-accent"
                  >
                    Clear all
                  </button>
                </div>
                
                {/* Age Groups */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age Group
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                    value={activeFilters.ageGroup}
                    onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                  >
                    <option value="">All Age Groups</option>
                    {ageGroups.map((ageGroup) => (
                      <option 
                        key={ageGroup.id} 
                        value={ageGroup.attributes.slug}
                        disabled={!availableFilters.ageGroups.includes(ageGroup.attributes.slug) && availableFilters.ageGroups.length > 0}
                      >
                        {ageGroup.attributes.name} ({ageGroup.attributes.spectrum})
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                    value={activeFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option 
                        key={category.id} 
                        value={category.attributes.slug}
                        disabled={!availableFilters.categories.includes(category.attributes.slug) && availableFilters.categories.length > 0}
                      >
                        {category.attributes.CategoryDisplay || category.attributes.Category}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Length */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                    value={activeFilters.length}
                    onChange={(e) => handleFilterChange('length', e.target.value)}
                  >
                    <option value="">Any Duration</option>
                    {lengths.map((length) => (
                      <option 
                        key={length.id} 
                        value={length.attributes.slug}
                        disabled={!availableFilters.lengths.includes(length.attributes.slug) && availableFilters.lengths.length > 0}
                      >
                        {length.attributes.Length}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                    value={activeFilters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                  >
                    <option value="">All Languages</option>
                    {languages.map((language) => (
                      <option 
                        key={language.id} 
                        value={language.attributes.Slug}
                        disabled={!availableFilters.languages.includes(language.attributes.Slug) && availableFilters.languages.length > 0}
                      >
                        {language.attributes.Language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Mobile Filters Sidebar */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-40 flex md:hidden">
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setShowMobileFilters(false)}></div>
                
                <div 
                  ref={filtersRef}
                  className="relative w-4/5 max-w-xs bg-white h-full overflow-y-auto shadow-xl flex flex-col"
                >
                  <div className="px-4 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                    <button 
                      onClick={() => setShowMobileFilters(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    {/* Age Groups */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Age Group
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                        value={activeFilters.ageGroup}
                        onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                      >
                        <option value="">All Age Groups</option>
                        {ageGroups.map((ageGroup) => (
                          <option 
                            key={ageGroup.id} 
                            value={ageGroup.attributes.slug}
                            disabled={!availableFilters.ageGroups.includes(ageGroup.attributes.slug) && availableFilters.ageGroups.length > 0}
                          >
                            {ageGroup.attributes.name} ({ageGroup.attributes.spectrum})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Categories */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                        value={activeFilters.category}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                      >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                          <option 
                            key={category.id} 
                            value={category.attributes.slug}
                            disabled={!availableFilters.categories.includes(category.attributes.slug) && availableFilters.categories.length > 0}
                          >
                            {category.attributes.CategoryDisplay || category.attributes.Category}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Length */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                        value={activeFilters.length}
                        onChange={(e) => handleFilterChange('length', e.target.value)}
                      >
                        <option value="">Any Duration</option>
                        {lengths.map((length) => (
                          <option 
                            key={length.id} 
                            value={length.attributes.slug}
                            disabled={!availableFilters.lengths.includes(length.attributes.slug) && availableFilters.lengths.length > 0}
                          >
                            {length.attributes.Length}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Language */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-spiritual-dark focus:ring-spiritual-dark"
                        value={activeFilters.language}
                        onChange={(e) => handleFilterChange('language', e.target.value)}
                      >
                        <option value="">All Languages</option>
                        {languages.map((language) => (
                          <option 
                            key={language.id} 
                            value={language.attributes.Slug}
                            disabled={!availableFilters.languages.includes(language.attributes.Slug) && availableFilters.languages.length > 0}
                          >
                            {language.attributes.Language}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={clearFilters}
                        className="text-sm font-medium text-spiritual-dark hover:text-spiritual-accent"
                      >
                        Clear all filters
                      </button>
                      
                      <button
                        onClick={() => setShowMobileFilters(false)}
                        className="px-4 py-2 bg-spiritual-accent text-white rounded-md shadow-sm text-sm font-medium hover:bg-spiritual-dark transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Results */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {activeTab === 'all' ? 'All Meditations' : categories.find(c => c.attributes.slug === activeTab)?.attributes.CategoryDisplay || 'Meditations'}
                </h2>
                
                <p className="text-sm text-gray-600">
                  {filteredMeditations.length} meditation{filteredMeditations.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {isFiltering ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-spiritual-accent"></div>
                </div>
              ) : filteredMeditations.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMeditations.map((meditation) => (
                    <MeditationCard 
                      key={meditation.id} 
                      meditation={meditation} 
                      className="h-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
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
                    Try adjusting your filters or search query to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-spiritual-accent hover:bg-spiritual-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spiritual-accent"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticProps() {
  // Fetch data from API
  const [ageGroups, categories, meditations, languages, lengths] = await Promise.all([
    getAgeGroups(),
    getCategories(),
    getMeditations({ pageSize: 100 }), // Adjust page size as needed
    getLanguages(),
    getLengths(),
  ]);

  return {
    props: {
      ageGroups: ageGroups.data || [],
      categories: categories.data || [],
      meditations: meditations.data || [],
      languages: languages.data || [],
      lengths: lengths.data || [],
    },
    revalidate: 60, // Re-generate the page after 60 seconds
  };
}