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
  trendingMeditations,
  categoryMeditations 
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
      <section className="bg-pastel-gradient-2 py-12 md:py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <Link href="/rajyog-meditation" className="inline-flex items-center text-sm text-gray-700 hover:text-spiritual-dark mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Go back to Home Page
              </Link>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
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
                {/* Display featuredImage if available */}
                <div className="bg-white p-0 h-64 flex items-center justify-center relative">
                  {ageGroup.attributes.featuredimage?.data ? (
                    <div className="w-full h-full relative rounded-lg overflow-hidden" 
                         style={{
                           boxShadow: '0 0 10px rgba(134, 97, 255, 0.3), 0 0 0 1px rgba(134, 97, 255, 0.2)',
                           background: 'linear-gradient(to right, rgba(134, 97, 255, 0.05), rgba(230, 223, 255, 0.1))'
                         }}>
                      <Image 
                        src={ageGroup.attributes.featuredimage.data.attributes.url} 
                        alt={ageGroupName}
                        className="object-cover"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-spiritual-light flex items-center justify-center">
                      <span className="text-spiritual-dark font-bold text-2xl">BK</span>
                    </div>
                  )}
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

      {/* Category Carousels */}
      {categories.map((category) => {
        const meditations = categoryMeditations[category.id] || [];
        if (meditations.length === 0) return null;
        
        return (
          <MeditationCarousel
            key={category.id}
            title={category.attributes.CategoryDisplay || category.attributes.Category}
            meditations={meditations}
          />
        );
      })}
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
  
  // Get meditations for each category
  const categoryMeditations = {};
  await Promise.all(
    categories.map(async (category) => {
      const meditations = await getMeditationsByCategory(category.id);
      categoryMeditations[category.id] = meditations;
    })
  );
  
  return {
    props: {
      ageGroup,
      categories,
      trendingMeditations,
      categoryMeditations,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
} 