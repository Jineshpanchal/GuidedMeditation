import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/layout/Layout';
import { getAgeGroups, getMeditations, getTeachers } from '../../lib/api/strapi';

export default function RajyogMeditationHome({ ageGroups, featuredMeditations, teachers }) {
  return (
    <Layout
      title="Brahma Kumaris Rajyog Meditation App"
      description="Guided audio meditations for spiritual growth, peace, and self-awareness"
    >
      <Head>
        <meta name="keywords" content="meditation, spirituality, brahma kumaris, raja yoga, guided meditation, peace, calm, self-awareness" />
      </Head>

      {/* Hero Section with Gradient Background */}
      <section className="relative bg-gradient-meditation py-24 md:py-32 overflow-hidden">
        {/* Light Effect */}
        <div className="absolute top-16 right-1/2 transform translate-x-1/2 w-8 h-8 rounded-full bg-white opacity-70 blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-20" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-10 text-center shadow-lg">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Meditation, made just for you!
            </h1>
            <p className="text-white text-lg mb-10">
              Choose your age group and explore guided sessions
              crafted to match your journey—whether you're just
              starting, balancing life's hustle, or seeking deeper wisdom.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ageGroups.slice(0, 4).map((ageGroup) => (
                <Link 
                  key={ageGroup.id}
                  href={`/rajyog-meditation/${ageGroup.attributes.slug}`}
                >
                  <div className="bg-white rounded-xl p-5 text-center cursor-pointer transform transition hover:scale-105">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {ageGroup.attributes.name || "Emerging Adulthood"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {ageGroup.attributes.spectrum || "12-24"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
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
      
      {/* Featured Commentaries */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">
            Trending <span className="font-normal">Commentaries</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredMeditations.length > 0 ? (
              featuredMeditations.map((meditation) => (
                <Link
                  key={meditation.id}
                  href={`/rajyog-meditation/meditations/${meditation.attributes.Slug}`}
                >
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative">
                      <div className="aspect-w-16 aspect-h-9 bg-spiritual-light">
                        {meditation.attributes.CoverImage?.data?.attributes ? (
                          <img 
                            src={meditation.attributes.CoverImage.data.attributes.url} 
                            alt={meditation.attributes.Title}
                            className="object-cover w-full h-full"
                          />
                        ) : null}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-spiritual-dark" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-xs text-gray-500 mb-1">AUDIO: {meditation.attributes.Duration || 5} Minutes</div>
                        <h3 className="font-medium text-gray-900 mb-1">{meditation.attributes.Title}</h3>
                        <div className="text-xs text-gray-500 flex items-center">
                          <span>BK {meditation.attributes.Teacher || 'Shivani'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-4 text-center py-10">
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
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <Link
                  key={teacher.id}
                  href={`/rajyog-meditation/teacher/${teacher.attributes.Slug}`}
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden mb-3">
                      {teacher.attributes.FeaturedImage?.data?.attributes ? (
                        <img 
                          src={teacher.attributes.FeaturedImage.data.attributes.url} 
                          alt={teacher.attributes.Name}
                          className="object-cover w-full h-full"
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
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Fetch age groups for the main navigation
    const ageGroups = await getAgeGroups();
    
    // Fetch trending meditations with cover images
    const featuredMeditations = await getMeditations({
      'filters[Trending][$eq]': true,
      'pagination[limit]': 4
      // populate CoverImage is already set as default in the updated API
    });
    
    // Fetch meditation teachers with featured images
    const teachers = await getTeachers();
    // populate FeaturedImage is already set as default in the updated API
    
    return {
      props: {
        ageGroups: ageGroups || [],
        featuredMeditations: featuredMeditations || [],
        teachers: teachers || [],
      },
      revalidate: 60 * 10, // Revalidate every 10 minutes
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