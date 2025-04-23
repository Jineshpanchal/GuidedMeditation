import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../../components/layout/Layout';
import MeditationCard from '../../../../components/meditation/MeditationCard';
import { getAgeGroups, getCategories, getMeditations, getMeditationsByCategory } from '../../../../lib/api/strapi';

export default function CategoryPage({ ageGroup, category, meditations }) {
  if (!category || !ageGroup) {
    return <div>Category or age group not found</div>;
  }

  const categoryName = category.attributes.CategoryDisplay || category.attributes.Category;
  const categoryDescription = category.attributes.ShortIntro?.[0]?.children?.[0]?.text || '';
  const ageGroupName = ageGroup.attributes.name;

  return (
    <Layout
      title={`${categoryName} Meditations for ${ageGroupName} | Brahma Kumaris`}
      description={`${categoryDescription} Guided meditations for ${ageGroupName} (${ageGroup.attributes.spectrum}).`}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, ${categoryName.toLowerCase()}, ${ageGroupName.toLowerCase()}, guided meditation`} />
      </Head>

      {/* Hero Section */}
      <section className="bg-pastel-gradient-1 py-12 md:py-20">
        <div className="container-custom">
          <Link 
            href={`/rajyog-meditation/${ageGroup.attributes.slug}`}
            className="inline-flex items-center text-sm text-gray-700 hover:text-spiritual-dark mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go back to {ageGroupName}
          </Link>
          
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {categoryName}
            </h1>
            <p className="text-lg text-gray-800 mb-6">
              {categoryDescription}
            </p>
            <div className="inline-block rounded-full bg-white bg-opacity-30 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-800">
              For {ageGroupName} ({ageGroup.attributes.spectrum})
            </div>
          </div>
        </div>
      </section>

      {/* Meditations */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-10">
            Guided <span className="font-normal">commentaries</span>
          </h2>
          
          {meditations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meditations.map((meditation) => (
                <MeditationCard key={meditation.id} meditation={meditation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No meditations found for this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-6 text-center">
              How to Practice
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Find a quiet place where you won't be disturbed. Sit comfortably with your back straight, either on a chair or on the floor. Close your eyes and disconnect from external distractions.
              </p>
              
              <p>
                Allow the guided commentary to lead you into a state of soul-consciousness. Breathe naturally and let thoughts come and go without judgment. If your mind wanders, gently bring it back to the meditation.
              </p>
              
              <p>
                After completing the meditation, take a moment to sit in silence before opening your eyes. Notice how you feel and try to carry this awareness into your day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const ageGroups = await getAgeGroups();
  const categories = await getCategories();
  
  const paths = [];
  
  for (const ageGroup of ageGroups) {
    for (const category of categories) {
      paths.push({
        params: {
          ageGroup: ageGroup.attributes.slug,
          category: category.attributes.slug,
        },
      });
    }
  }
  
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { ageGroup: ageGroupSlug, category: categorySlug } = params;
  
  // Get the age group data
  const ageGroups = await getAgeGroups();
  const ageGroup = ageGroups.find(
    (group) => group.attributes.slug === ageGroupSlug
  );
  
  if (!ageGroup) {
    return {
      notFound: true,
    };
  }
  
  // Get the category data
  const categories = await getCategories({
    'populate': ['gm_meditations']
  });
  const category = categories.find(
    (cat) => cat.attributes.slug === categorySlug
  );
  
  if (!category) {
    return {
      notFound: true,
    };
  }
  
  // Fetch meditations with proper filters and population 
  let meditations = await getMeditations({
    'filters[gm_categories][id][$eq]': category.id,
    'populate': ['gm_categories', 'gm_rajyoga_teachers', 'Media', 'FeaturedImage', 'gm_language'],
  });
  
  // If no meditations found by ID, try fetching by slug as fallback
  if (!meditations || meditations.length === 0) {
    console.log(`No meditations found by category ID. Trying by slug: ${categorySlug}`);
    meditations = await getMeditations({
      'filters[gm_categories][slug][$eq]': categorySlug,
      'populate': ['gm_categories', 'gm_rajyoga_teachers', 'Media', 'FeaturedImage', 'gm_language'],
    });
    
    // If still no results, try the dedicated helper function as final fallback
    if (!meditations || meditations.length === 0) {
      console.log(`Still no meditations found. Trying getMeditationsByCategory helper...`);
      meditations = await getMeditationsByCategory(category.id, categorySlug, {
        'populate': ['gm_categories', 'gm_rajyoga_teachers', 'Media', 'FeaturedImage', 'gm_language'],
      });
    }
  }
  
  console.log(`Fetched ${meditations.length} meditations for category: ${categorySlug} (ID: ${category.id})`);
  
  return {
    props: {
      ageGroup,
      category,
      meditations,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
} 