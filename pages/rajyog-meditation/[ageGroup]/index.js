import React from 'react';
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
  getMeditationsByCategory 
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
  trendingMeditations
  // categoryMeditations removed for performance
}) {
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

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-spiritual-light/10 to-white py-16 md:py-24">
        {/* Background Image with Parallax Effect */}
        {ageGroup.attributes.featuredimage?.data && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 md:opacity-30"
            style={{ 
              backgroundImage: `url(${getImageUrl(ageGroup.attributes.featuredimage.data)})`,
              transform: 'translateZ(0)',
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-radial from-spiritual-light/30 to-transparent"></div>
            
            {/* Subtle geometric patterns */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.07) 0%, transparent 25%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 25%)'
            }}></div>
          </div>
        )}
        
        {/* Content Container */}
        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-6xl">
            {/* Breadcrumb Navigation */}
            <nav className="mb-8 transition-all hover:opacity-80">
              <Link href="/rajyog-meditation" className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-spiritual-dark">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go back to Home Page
              </Link>
            </nav>
            
            <div className="flex flex-col-reverse gap-12 md:flex-row md:items-center">
              {/* Content Column */}
              <div className="md:w-1/2">
                <div className="relative">
                  <div className="absolute -left-6 top-0 h-20 w-20 rounded-full bg-spiritual-light/20 blur-xl"></div>
                  <h1 className="relative text-4xl font-display font-bold md:text-5xl lg:text-6xl">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 animate-gradient-flow">
                      {ageGroupName}
                    </span>
                  </h1>
                </div>
                
                <p className="mt-6 text-lg leading-relaxed text-gray-700 md:pr-8">
                  {ageGroupDescription}
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <div className="inline-flex items-center rounded-full bg-white/90 px-5 py-2.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur-sm">
                    <span className="mr-2 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"></span>
                    {ageGroup.attributes.spectrum}
                  </div>
                </div>
              </div>
              
              {/* Image Column */}
              <div className="md:w-1/2">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  {ageGroup.attributes.featuredimage?.data && (
                    <div className="absolute inset-0 bg-cover bg-center transform transition-all"
                      style={{ 
                        backgroundImage: `url(${getImageUrl(ageGroup.attributes.featuredimage.data)})`,
                      }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/30 to-transparent mix-blend-multiply"></div>
                </div>
              </div>
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
  
  // Get the age group data with only necessary fields populated
  // Ensure we get a properly formatted ShortBio field
  try {
    const ageGroups = await getAgeGroups({
      'filters[slug][$eq]': ageGroupSlug,
      'fields[0]': 'name',
      'fields[1]': 'spectrum',
      'fields[2]': 'slug',
      'fields[3]': 'ShortBio',
      'populate[featuredimage][fields][0]': 'url', // Only get the URL, not all image formats
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
      // Handle non-array object format
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
    
    return {
      props: {
        ageGroup,
        categories,
        trendingMeditations,
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