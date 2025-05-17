import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { getTeachers, getMeditations } from '../../../lib/api/strapi';

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

export default function TeachersIndexPage({ teachers, meditationCounts }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debug logging to see the structure of the data
  useEffect(() => {
    console.log('Teachers:', teachers);
    console.log('Meditation Counts:', meditationCounts);
    // Add staggered loading animation effect
    setIsLoaded(true);
  }, [teachers, meditationCounts]);
  
  // Sort and filter teachers
  const processedTeachers = React.useMemo(() => {
    let filtered = [...teachers];
    
    // Apply search filter if any
    if (searchTerm) {
      filtered = filtered.filter(teacher => 
        teacher.attributes.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.attributes.Designation?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch(sortBy) {
      case 'name':
        filtered.sort((a, b) => a.attributes.Name.localeCompare(b.attributes.Name));
        break;
      case 'meditations':
        filtered.sort((a, b) => (meditationCounts[b.id] || 0) - (meditationCounts[a.id] || 0));
        break;
      // default - keep original order
    }
    
    return filtered;
  }, [teachers, meditationCounts, sortBy, searchTerm]);
  
  return (
    <Layout
      title="Raja Yoga Teachers | Brahma Kumaris Meditation"
      description="Meet our experienced Raja Yoga meditation teachers from around the world."
    >
      <Head>
        <meta name="keywords" content="meditation, spirituality, brahma kumaris, raja yoga, teachers, guides" />
      </Head>

      {/* Hero Section - Enhanced with parallax effect */}
      <section className="relative bg-gradient-to-br from-purple-100 via-pink-50 to-spiritual-light py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/sacred-yantra.svg')] opacity-5 bg-repeat bg-[length:400px_400px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/30 to-transparent rounded-full blur-3xl" />
          
          {/* Decorative floating elements */}
          <div className="absolute top-20 left-[10%] w-16 h-16 bg-spiritual-purple/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-[10%] w-24 h-24 bg-spiritual-blue/10 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute top-1/3 right-[20%] w-12 h-12 bg-spiritual-dark/10 rounded-full blur-lg animate-pulse"></div>
        </div>

        <div className="container-custom relative z-10 text-center">
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-display font-bold mb-6 animate-fade-in relative">
            <span className="absolute inset-0 bg-gradient-to-r from-spiritual-dark via-spiritual-purple to-spiritual-blue bg-[length:200%_auto] bg-clip-text text-transparent blur-xl opacity-50 animate-gradient">
              Raja Yoga Teachers
            </span>
            <span className="bg-gradient-to-r from-spiritual-dark via-spiritual-purple to-spiritual-blue bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
              Raja Yoga Teachers
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto animate-fade-in-delayed leading-relaxed">
            Meet our experienced Raja Yoga meditation teachers who guide seekers on the journey to inner peace and spiritual growth.
          </p>
          <div className="h-1 w-20 bg-gradient-to-r from-spiritual-dark via-spiritual-purple to-spiritual-blue bg-[length:200%_auto] rounded-full mx-auto mt-8 animate-gradient" />
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="sticky top-0 z-20 bg-white shadow-md py-3 backdrop-blur-sm bg-opacity-90">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-64 md:w-80">
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-spiritual-dark/30"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-8 py-2 bg-gray-100 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-spiritual-dark/30 cursor-pointer"
                >
                  <option value="default">Default</option>
                  <option value="name">Name</option>
                  <option value="meditations">Meditation Count</option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              <div className="hidden md:block text-sm text-gray-500">
                {processedTeachers.length} {processedTeachers.length === 1 ? 'teacher' : 'teachers'} found
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          {processedTeachers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-8">
              {processedTeachers.map((teacher, index) => (
                <div 
                  key={teacher.id}
                  className={`transform transition-all duration-700 ${
                    isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span className="text-xs font-medium text-spiritual-dark">
                                {meditationCounts[teacher.id] || 0}
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
                                    block.children.map((child, childIndex) => 
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
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-600 mb-2 text-lg">No teachers found for your search</p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="mt-4 px-4 py-2 bg-spiritual-light text-spiritual-dark rounded-full text-sm font-medium hover:bg-spiritual-light/80 transition-colors"
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
  try {
    // Fetch all teachers with necessary fields
    const teachers = await getTeachers({
      'fields[0]': 'Name',
      'fields[1]': 'Slug',
      'fields[2]': 'Designation',
      'fields[3]': 'ShortIntro',
      'populate[FeaturedImage]': '*', // Get complete image data
      'pagination[limit]': 100 // Set a reasonable limit
    });
    
    console.log(`Found ${teachers.length} teachers`);
    
    // Create a map to store meditation counts for each teacher
    const meditationCounts = {};
    
    // Fetch all meditations with teacher relationships in a single query
    const allMeditations = await getMeditations({
      'fields[0]': 'id',  // Only get ID to minimize data
      'populate[gm_rajyoga_teachers][fields][0]': 'id', // Only populate teacher IDs
      'pagination[limit]': 500 // Higher limit to get all
    });
    
    console.log(`Found total ${allMeditations.length} meditations`);
    
    // Process all meditations and count by teacher
    allMeditations.forEach(meditation => {
      // Check if this meditation has teachers
      const meditationTeachers = meditation.attributes?.gm_rajyoga_teachers?.data;
      
      if (meditationTeachers) {
        // Can be either an array or single object
        if (Array.isArray(meditationTeachers)) {
          meditationTeachers.forEach(teacher => {
            if (teacher && teacher.id) {
              meditationCounts[teacher.id] = (meditationCounts[teacher.id] || 0) + 1;
            }
          });
        } else if (meditationTeachers.id) {
          // Single teacher case
          meditationCounts[meditationTeachers.id] = (meditationCounts[meditationTeachers.id] || 0) + 1;
        }
      }
    });
    
    // Log the final counts for debugging
    console.log('Final meditation counts:', meditationCounts);
    
    return {
      props: {
        teachers: teachers || [],
        meditationCounts: meditationCounts
      },
      // Revalidate every hour
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return {
      props: {
        teachers: [],
        meditationCounts: {}
      },
      revalidate: 60 * 10, // Try again in 10 minutes if there was an error
    };
  }
} 