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
  const ageGroupDescription = ageGroup.attributes.ShortBio?.[0]?.children?.[0]?.text || '';

  return (
    <Layout
      title={`${ageGroupName} Meditations | Brahma Kumaris`}
      description={`Guided meditations for ${ageGroupName} (${ageGroup.attributes.spectrum}). ${ageGroupDescription}`}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, ${ageGroupName.toLowerCase()}, guided meditation`} />
      </Head>

      {/* Hero Section */}
      <section 
        className="relative py-12 md:py-20 overflow-hidden"
        style={{
          backgroundImage: ageGroup.attributes.featuredimage?.data 
            ? `url(${ageGroup.attributes.featuredimage.data.attributes.url})` 
            : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Blurred Background Overlay */}
        {ageGroup.attributes.featuredimage?.data && (
          <div className="absolute inset-0 bg-cover bg-center backdrop-blur-lg" 
               style={{ backgroundImage: `url(${ageGroup.attributes.featuredimage.data.attributes.url})` }}>
          </div>
        )}
        
        {/* Gradient Overlay - Fades from white */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/80 to-white md:bg-gradient-to-l md:from-white/0 md:via-white/10 md:to-white"></div>

        {/* Content Container */}
        <div className="container-custom relative z-10"> {/* Added relative and z-10 */}
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Link href="/rajyog-meditation" className="inline-flex items-center text-sm text-gray-700 hover:text-spiritual-dark mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go back to Home Page
              </Link>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500 mb-4 animate-gradient-flow">
                {ageGroupName}
              </h1>
              <p className="text-lg text-gray-800 mb-6">
                {ageGroupDescription}
              </p>
              <div className="inline-block rounded-full bg-white bg-opacity-30 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-800">
                {ageGroup.attributes.spectrum}
              </div>
            </div>
            <div className="md:w-1/2 md:pl-12">
              <div className="rounded-lg overflow-hidden shadow-lg">
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
  
  // Get the age group data with featuredImage populated
  const ageGroups = await getAgeGroups({
    'populate[featuredimage]': '*' // Use lowercase 'i' to match API field name
  });
  const ageGroup = ageGroups.find(
    (group) => group.attributes.slug === ageGroupSlug
  );
  
  if (!ageGroup) {
    return {
      notFound: true,
    };
  }
  
  // Get categories for this age group
  const categories = await getCategoriesByAgeGroup(ageGroupSlug);
  
  // Get trending meditations for this age group
  const trendingMeditations = await getTrendingMeditationsByAgeGroup(ageGroupSlug);
  
  // Removed fetching all category meditations in getStaticProps for performance
  // const categoryMeditations = {};
  // await Promise.all(
  //   categories.map(async (category) => {
  //     const meditations = await getMeditationsByCategory(category.id);
  //     categoryMeditations[category.id] = meditations;
  //   })
  // );
  
  return {
    props: {
      ageGroup,
      categories,
      trendingMeditations,
      // categoryMeditations, // Removed
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
}