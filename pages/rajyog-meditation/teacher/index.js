import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import { getTeachersPageData } from '../../../lib/api/strapi-optimized';
import TeacherCard from '../../../components/ui/TeacherCard';

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
      <section className="hero-section relative bg-gradient-to-br from-purple-100 via-pink-50 to-spiritual-light overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/patterns/sacred-yantra.svg')] opacity-5 bg-repeat bg-[length:400px_400px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/30 to-transparent rounded-full blur-3xl" />
          
          {/* Decorative floating elements */}
          <div className="absolute top-20 left-[10%] w-16 h-16 bg-spiritual-purple/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-[10%] w-24 h-24 bg-spiritual-blue/10 rounded-full blur-xl animate-float-delayed"></div>
          <div className="absolute top-1/3 right-[20%] w-12 h-12 bg-spiritual-dark/10 rounded-full blur-lg animate-pulse"></div>
        </div>
      
        <div className="container-custom relative z-10 text-center py-12 md:py-12 pt-20 md:pt-20">
          <h1 className="text-3xl md:text-5xl xl:text-6xl font-display font-bold mb-6 animate-fade-in relative">
            <span className="absolute inset-0 bg-gradient-to-r from-spiritual-dark via-spiritual-purple to-spiritual-blue bg-[length:200%_auto] bg-clip-text text-transparent blur-xl opacity-50 animate-gradient">
              Rajyoga Teachers
            </span>
            <span className="bg-gradient-to-r from-spiritual-dark via-spiritual-purple to-spiritual-blue bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient">
              Rajyoga Teachers
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
                  <TeacherCard 
                    teacher={teacher} 
                    meditationCount={meditationCounts[teacher.id] || 0} 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl text-gray-300 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl text-gray-500 font-medium">No teachers found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')} 
                  className="mt-4 px-4 py-2 bg-spiritual-dark hover:bg-spiritual-accent text-white rounded-full transition-colors"
                >
                  Clear Search
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
    console.log('Fetching optimized teachers page data...');
    const startTime = Date.now();
    
    // Fetch all data using the optimized single call
    const { teachers, meditationCounts } = await getTeachersPageData();
    
    const endTime = Date.now();
    console.log(`Teachers page data fetched in ${endTime - startTime}ms`);
    
    return {
      props: {
        teachers,
        meditationCounts
      },
      revalidate: 300, // Reduced from 1 hour to 5 minutes for fresher data
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        teachers: [],
        meditationCounts: {}
      },
    };
  }
} 