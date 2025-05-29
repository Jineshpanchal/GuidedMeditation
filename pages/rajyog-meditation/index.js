import React, { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import TrendingMeditationCard from '../../components/meditation/TrendingMeditationCard';
import { getHomePageData } from '../../lib/api/strapi-optimized';
import ParticlesBackground from '../../components/ParticlesBackground';

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

export default function RajyogMeditationHome({ ageGroups, featuredMeditations, teachers }) {
  const [showAllSections, setShowAllSections] = useState(false);
  
  // Add effect to prevent body scrolling
  React.useEffect(() => {
    // Prevent scrolling on the body
    document.body.style.overflow = 'hidden';
    
    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  return (
    <Layout
      title="Brahma Kumaris Rajyog Meditation App"
      description="Guided audio meditations for spiritual growth, peace, and self-awareness"
      hideHeaderFooter={true}
    >
      <Head>
        <meta name="keywords" content="meditation, spirituality, brahma kumaris, raja yoga, guided meditation, peace, calm, self-awareness" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      {/* Hero Section with Gradient Background and Particles */}
      <section className="hero-full-height relative bg-gradient-meditation h-screen flex items-center justify-center overflow-hidden">
        {/* Particles Background */}
        <ParticlesBackground />
        
        {/* Light Effect */}
        <div className="absolute top-16 right-1/2 transform translate-x-1/2 w-8 h-8 rounded-full bg-white opacity-70 blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-20" />
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10 my-auto">
          <div className="max-w-2xl mx-auto bg-white/15 backdrop-blur-md rounded-3xl p-6 sm:p-10 text-center shadow-2xl border border-white/20 animate-fade-in overflow-hidden">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6 text-shadow-lg">
              Meditation, made just for you!
            </h1>
            <p className="text-white text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed px-2 sm:px-4">
              Choose your age group and explore guided sessions
              crafted to match your journey—whether you're just
              starting, balancing life's hustle, or seeking deeper wisdom.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {ageGroups.slice(0, 4).map((ageGroup) => (
                <Link 
                  key={ageGroup.id}
                  href={`/rajyog-meditation/${ageGroup.attributes.slug}`}
                >
                  <div className="bg-white/90 hover:bg-white rounded-xl p-4 sm:p-6 text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-spiritual-dark">
                      {ageGroup.attributes.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800">
                      {ageGroup.attributes.spectrum}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Hidden sections that will only appear if showAllSections is true (which it never will be since we're hiding them) */}
      {showAllSections && (
        <>
          {/* Brahma Kumaris Introduction */}
          <section className="py-16 text-center">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold inline-block text-gray-900 mb-2">
                  Brahma Kumaris <span className="font-normal">meditation</span>
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  offers a unique and powerful approach to spiritual growth and self-awareness. 
                  By connecting with your true self and the Supreme Soul, you can transform your thoughts, 
                  emotions, and overall quality of life. The free 7-day introductory course is an excellent opportunity to 
                  explore this practice and integrate it into your daily life for lasting benefits.
                </p>
              </div>
            </div>
          </section>
          
          {/* Trending Commentaries */}
          <section className="py-10 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-10">
                Trending <span className="font-normal">Commentaries</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {featuredMeditations && featuredMeditations.length > 0 ? (
                  featuredMeditations.map((meditation) => (
                    <TrendingMeditationCard key={meditation.id} meditation={meditation} />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <p className="text-gray-500">No trending commentaries available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
          
          {/* Meet our Experts */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12">
                Meet <span className="font-normal">our Experts</span>
              </h2>
              
              <div className="flex overflow-x-auto pb-4 space-x-8 items-center">
                {teachers && teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <Link
                      key={teacher.id}
                      href={`/rajyog-meditation/teacher/${teacher.attributes.Slug}`}
                    >
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mb-3">
                          {teacher.attributes.FeaturedImage?.data && 
                           Array.isArray(teacher.attributes.FeaturedImage.data) && 
                           teacher.attributes.FeaturedImage.data.length > 0 ? (
                            <img 
                              src={getImageUrl(teacher.attributes.FeaturedImage.data[0])} 
                              alt={teacher.attributes.Name || 'Teacher'}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.classList.add('bg-spiritual-light');
                              }}
                            />
                          ) : teacher.attributes.FeaturedImage?.data && !Array.isArray(teacher.attributes.FeaturedImage.data) ? (
                            <img 
                              src={getImageUrl(teacher.attributes.FeaturedImage.data)} 
                              alt={teacher.attributes.Name || 'Teacher'}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.classList.add('bg-spiritual-light');
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-spiritual-light">
                              <span className="text-spiritual-dark font-bold text-2xl">
                                {teacher.attributes.Name ? teacher.attributes.Name.charAt(0) : 'BK'}
                              </span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-center">
                          {teacher.attributes.Name || 'BK Teacher'}
                        </h3>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="w-full text-center py-10">
                    <p className="text-gray-500">No teachers available at the moment.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
          
          {/* Explore More Commentaries */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-12">
                Explore <span className="font-normal">more commentaries</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* New & Trending */}
                <div className="bg-white rounded-xl overflow-hidden shadow p-6 relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">New & Trending</h3>
                    <p className="text-gray-600 mb-6">The latest meditation & top picks</p>
                    <Link href="/rajyog-meditation/explore?filter=trending">
                      <span className="inline-block py-2 px-4 bg-spiritual-light text-spiritual-dark rounded-lg font-medium">
                        Explore
                      </span>
                    </Link>
                  </div>
                  <div className="absolute bottom-0 right-0 w-36 h-36 bg-spiritual-light opacity-30 rounded-full -mb-10 -mr-10" />
                </div>
                
                {/* For Beginners */}
                <div className="bg-white rounded-xl overflow-hidden shadow p-6 relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">For Beginners</h3>
                    <p className="text-gray-600 mb-6">Learn the fundamentals</p>
                    <Link href="/rajyog-meditation/explore?filter=beginners">
                      <span className="inline-block py-2 px-4 bg-spiritual-light text-spiritual-dark rounded-lg font-medium">
                        Explore
                      </span>
                    </Link>
                  </div>
                  <div className="absolute bottom-0 right-0 w-36 h-36 bg-spiritual-light opacity-30 rounded-full -mb-10 -mr-10" />
                </div>
                
                {/* Quick Meditations */}
                <div className="bg-white rounded-xl overflow-hidden shadow p-6 relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">Quick Meditations</h3>
                    <p className="text-gray-600 mb-6">Choose a length and press play</p>
                    <Link href="/rajyog-meditation/explore?filter=quick">
                      <span className="inline-block py-2 px-4 bg-spiritual-light text-spiritual-dark rounded-lg font-medium">
                        Explore
                      </span>
                    </Link>
                  </div>
                  <div className="absolute bottom-0 right-0 w-36 h-36 bg-spiritual-light opacity-30 rounded-full -mb-10 -mr-10" />
                </div>
                
                {/* Based on Experts */}
                <div className="bg-white rounded-xl overflow-hidden shadow p-6 relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-1">Based on Meditation Experts</h3>
                    <p className="text-gray-600 mb-6">Guided meditations from our experts, each offering a unique path to peace and self-discovery</p>
                    <Link href="/rajyog-meditation/explore?filter=experts">
                      <span className="inline-block py-2 px-4 bg-spiritual-light text-spiritual-dark rounded-lg font-medium">
                        Explore
                      </span>
                    </Link>
                  </div>
                  <div className="absolute bottom-0 right-0 w-36 h-36 bg-spiritual-light opacity-30 rounded-full -mb-10 -mr-10" />
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    console.log('Fetching optimized home page data...');
    const startTime = Date.now();
    
    // Fetch all data using the optimized single call
    const { ageGroups, featuredMeditations, teachers } = await getHomePageData();
    
    const endTime = Date.now();
    console.log(`Home page data fetched in ${endTime - startTime}ms`);
    
    return {
      props: {
        ageGroups: ageGroups || [],
        featuredMeditations: featuredMeditations || [],
        teachers: teachers || [],
      },
      revalidate: 60, // Reduced from 10 minutes to 60 seconds for fresher data
    };
  } catch (error) {
    console.error('Error fetching data for home page:', error);
    return {
      props: {
        ageGroups: [],
        featuredMeditations: [],
        teachers: [],
      },
      revalidate: 60, // Try again sooner if there was an error
    };
  }
} 