import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import CategoryCard from '../../../components/ui/CategoryCard';
import MeditationCarousel from '../../../components/meditation/MeditationCarousel';
import { 
  getAgeGroups, 
  getCategoriesByAgeGroup, 
  getTrendingMeditationsByAgeGroup,
  getMeditationsByCategory,
  getMeditations
} from '../../../lib/api/strapi';

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

export default function AgeGroupPage({ 
  ageGroup, 
  categories, 
  trendingMeditations,
  meditationCounts
}) {
  const [scrolled, setScrolled] = useState(false);
  
  // Add subtle parallax effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  if (!ageGroup) {
    return <div>Age group not found</div>;
  }

  const ageGroupName = ageGroup.attributes.name;
  
  // Handle all possible formats of ShortBio
  let ageGroupDescription = '';
  const shortBio = ageGroup.attributes.ShortBio;
  
  if (!shortBio) {
    ageGroupDescription = '';
  } else if (typeof shortBio === 'string') {
    ageGroupDescription = shortBio;
  } else if (Array.isArray(shortBio) && shortBio.length > 0) {
    // Handle rich text array format
    ageGroupDescription = shortBio[0]?.children?.[0]?.text || '';
  } else if (typeof shortBio === 'object') {
    // Handle other object formats
    ageGroupDescription = String(shortBio);
  }

  return (
    <Layout
      title={`${ageGroupName} Meditations | Brahma Kumaris`}
      description={`Guided meditations for ${ageGroupName} (${ageGroup.attributes.spectrum}). ${ageGroupDescription}`}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, ${ageGroupName.toLowerCase()}, guided meditation`} />
      </Head>

      {/* Spiritual Hero Section with Enhanced Visual Effects */}
      <section className="relative min-h-[60vh] md:min-h-[65vh] flex items-center py-12 md:py-16 overflow-hidden">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800 opacity-90"></div>
        
        {/* Spiritual Particle Effects */}
        <div className="absolute inset-0 bg-[url('/images/stars-bg.png')] bg-repeat opacity-30"></div>
        
        {/* Animated Gradient Orb */}
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-r from-purple-600/30 via-pink-500/20 to-indigo-600/40 blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-r from-blue-600/20 via-indigo-600/30 to-purple-700/20 blur-3xl opacity-50"></div>
        
        {/* Background Image with Advanced Effects */}
        {ageGroup.attributes.featuredimage?.data && (
          <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${scrolled ? 'scale-110' : 'scale-100'}`}>
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-soft-light"
              style={{ 
                backgroundImage: `url(${getImageUrl(ageGroup.attributes.featuredimage.data)})`,
                filter: 'blur(14px)',
                transform: 'scale(1.1)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {/* Extra blur layer */}
              <div className="absolute inset-0 backdrop-filter backdrop-blur-1xl bg-transparent"></div>
            </div>
          </div>
        )}
        
        {/* Subtle Sacred Geometry Pattern */}
        <div className="absolute inset-0 bg-[url('/images/sacred-geometry.png')] bg-repeat opacity-5"></div>
        
        {/* Content Container with Elegant Layout */}
        <div className="container-custom relative z-10">
          {/* Spiritual Glow Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-64 rounded-full bg-purple-300/10 blur-3xl"></div>
          
          {/* Breadcrumb Navigation - Elegant Redesign */}
          <div className="relative mb-8">
            <Link href="/rajyog-meditation" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 backdrop-blur-lg border border-white/20 text-sm font-medium text-white hover:bg-white/20 transition-all duration-300 group">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              <span>Return to Meditation Home</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Content Column - Enhanced Typography */}
            <div className="lg:col-span-6 relative text-center lg:text-left">
              {/* Removed Raja Yoga Meditation text indicator */}
              
              {/* Enhanced Heading with Outlined Typography and Increased Vertical Spacing */}
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-5">
                <span className="inline-block relative leading-tight">
                  {/* Text Shadow Effect */}
                  <span className="absolute inset-0 blur-sm text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-indigo-400">{ageGroupName}</span>
                  
                  {/* Main Text with Gradient */}
                  <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-300">{ageGroupName}</span>
                </span>
              </h1>
              
              {/* Decorative Element */}
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-pink-400 to-purple-500"></div>
                <div className="mx-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-300" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1h-3a1 1 0 01-1-1v-3a1 1 0 011-1h.5a1.5 1.5 0 000-3H5a1 1 0 01-1-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                </div>
                <div className="h-px w-12 bg-gradient-to-r from-purple-500 to-indigo-400"></div>
              </div>
              
              {/* Enhanced Description */}
              <p className="text-base md:text-lg text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6">
                {ageGroupDescription}
              </p>
              
              {/* Elegant Feature Badge */}
              <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-md border border-white/10 shadow-lg">
                <span className="mr-3 h-3 w-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 shadow-sm shadow-pink-500/30"></span>
                <span className="text-sm text-white/90">{ageGroup.attributes.spectrum}</span>
              </div>
            </div>
            
            {/* Image Column with Floating Effect and Thin Gradient Border */}
            <div className="lg:col-span-6 relative mt-6 lg:mt-0">
              {ageGroup.attributes.featuredimage?.data && (
                <div className={`relative aspect-[4/3] md:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20 transform transition-all duration-1000 hover:scale-[1.02] ${scrolled ? 'translate-y-2' : 'translate-y-0'}`}>
                  {/* Glow effects around the image */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-pink-500/30 blur-2xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-indigo-500/30 blur-2xl"></div>
                  
                  {/* Thin gradient border effect */}
                  <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-transparent via-white/20 to-pink-300/30 z-10 pointer-events-none">
                    <div className="w-full h-full rounded-2xl bg-transparent"></div>
                  </div>
                  
                  <Image
                    src={getImageUrl(ageGroup.attributes.featuredimage.data)}
                    alt={ageGroupName}
                    fill
                    className="object-cover object-center transition-all hover:scale-105 duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/20 to-transparent mix-blend-soft-light"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trending Meditations */}
      {trendingMeditations.length > 0 && (
        <MeditationCarousel 
          title="Trending Meditations"
          meditations={trendingMeditations}
        />
      )}

      {/* Categories Grid */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-8">
            Choose a topic
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id} 
                category={category} 
                ageGroup={ageGroup.attributes.slug}
                meditationCount={meditationCounts[category.id] || 0}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Category Carousels - Removed categoryMeditations pre-fetching for performance */}
      {/* 
      {categories.map((category) => {
        // Fetch meditations client-side here if needed
        // const meditations = categoryMeditations[category.id] || []; 
        // if (meditations.length === 0) return null;
        
        // return (
        //   <MeditationCarousel
        //     key={category.id}
        //     title={category.attributes.CategoryDisplay || category.attributes.Category}
        //     meditations={meditations}
        //   />
        // );
      })} 
      */}
    </Layout>
  );
}

export async function getStaticPaths() {
  const ageGroups = await getAgeGroups();
  
  const paths = ageGroups.map((ageGroup) => ({
    params: { ageGroup: ageGroup.attributes.slug },
  }));
  
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { ageGroup: ageGroupSlug } = params;
  
  try {
    const ageGroups = await getAgeGroups({
      'filters[slug][$eq]': ageGroupSlug,
      'fields[0]': 'name',
      'fields[1]': 'spectrum',
      'fields[2]': 'slug',
      'fields[3]': 'ShortBio',
      'populate[featuredimage][fields][0]': 'url',
    });
    
    let ageGroup = ageGroups.find(
      (group) => group.attributes.slug === ageGroupSlug
    );
    
    if (!ageGroup) {
      return {
        notFound: true,
      };
    }
    
    // Convert complex ShortBio to simple string if needed
    if (ageGroup.attributes.ShortBio && 
        typeof ageGroup.attributes.ShortBio === 'object' && 
        !Array.isArray(ageGroup.attributes.ShortBio)) {
      ageGroup = {
        ...ageGroup,
        attributes: {
          ...ageGroup.attributes,
          ShortBio: ageGroup.attributes.ShortBio.toString()
        }
      };
    }
    
    // Get categories for this age group
    const categories = await getCategoriesByAgeGroup(ageGroupSlug);
    
    // Get trending meditations for this age group
    const trendingMeditations = await getTrendingMeditationsByAgeGroup(ageGroupSlug);

    // Create a map to store meditation counts for each category
    const meditationCounts = {};
    
    // Fetch meditation counts for each category
    await Promise.all(categories.map(async (category) => {
      try {
        // Get meditations by category ID instead of slug
        const meditations = await getMeditations({
          'filters[gm_categories][id][$eq]': category.id,
          'fields[0]': 'id' // Only fetch IDs for counting
        });
        meditationCounts[category.id] = meditations.length;
      } catch (error) {
        console.error(`Error fetching meditations for category ${category.attributes.slug}:`, error);
        meditationCounts[category.id] = 0;
      }
    }));
    
    return {
      props: {
        ageGroup,
        categories,
        trendingMeditations,
        meditationCounts
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (error) {
    console.error(`Error in getStaticProps for age group ${ageGroupSlug}:`, error);
    return {
      notFound: true,
    };
  }
}