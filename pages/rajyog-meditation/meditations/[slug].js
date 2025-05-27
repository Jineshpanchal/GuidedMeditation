import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import WaveformPlayer from '../../../components/meditation/WaveformPlayer';
import RelatedMeditationCard from '../../../components/meditation/RelatedMeditationCard';
import TeacherCard from '../../../components/ui/TeacherCard';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import axios from 'axios';
import { 
  getMeditationPageData
} from '../../../lib/api/strapi-optimized';

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

export default function MeditationPage({ meditation, relatedMeditations, teacher, teacherMeditations, teachers, meditationCounts }) {
  const { playMeditation, togglePlay, isPlaying, currentMeditation, hasEnded } = useAudioPlayer();
  
  if (!meditation) {
    return <div>Meditation not found</div>;
  }

  const isCurrentlyPlaying = 
    currentMeditation && 
    currentMeditation.id === meditation.id && 
    isPlaying;

  // Extract metadata
  const meditationTitle = meditation.attributes.Title || 'Guided Meditation';
  const displayTitle = meditation.attributes.DisplayTitle || '';
  const meditationBenefits = (() => {
    if (!meditation.attributes.BenefitsShort || !Array.isArray(meditation.attributes.BenefitsShort)) {
      return '';
    }
    const firstBlock = meditation.attributes.BenefitsShort[0];
    if (!firstBlock || !Array.isArray(firstBlock.children)) {
      return '';
    }
    const firstChild = firstBlock.children[0];
    return (firstChild && typeof firstChild.text === 'string') ? firstChild.text : '';
  })();
  const duration = meditation.attributes.Duration || '5';
  const trending = meditation.attributes.Trending || false;
  
  // Media
  const mediaUrl = meditation.attributes.Media?.data?.attributes?.url;
  const coverImageUrl = meditation.attributes.CoverImage?.data?.attributes?.url;
  const featuredImageUrl = meditation.attributes.FeaturedImage?.data?.attributes?.url;
  
  // Related entities
  const categories = meditation.attributes.gm_categories?.data || [];
  const language = meditation.attributes.gm_language?.data?.attributes?.Name || 'English';
  const teacherInfo = teacher ? {
    name: teacher.attributes.Name,
    image: teacher.attributes.FeaturedImage?.data ? 
           getImageUrl(teacher.attributes.FeaturedImage.data) : null,
    shortIntro: typeof teacher.attributes.ShortIntro === 'string' 
      ? teacher.attributes.ShortIntro 
      : (typeof teacher.attributes.Bio === 'string' 
          ? teacher.attributes.Bio.substring(0, 150) 
          : 'Brahma Kumaris Meditation Teacher'),
    designation: teacher.attributes.Designation || 'Brahma Kumaris Teacher',
    slug: teacher.attributes.Slug || '',
  } : null;

  // Handle play click
  const handlePlayClick = () => {
    if (currentMeditation && currentMeditation.id === meditation.id) {
      togglePlay();
    } else {
      playMeditation(meditation);
      setTimeout(togglePlay, 100); // Small delay to ensure meditation is loaded
    }
  };

  return (
    <Layout
      title={`${meditationTitle} | Brahma Kumaris Meditation`}
      description={meditationBenefits}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, guided meditation, ${meditationTitle.toLowerCase()}`} />
      </Head>

      {/* Hero Section with Featured Image */}
      <section className="relative">
        {/* Featured Image or Cover Image */}
        <div className="h-64 md:h-96 w-full relative bg-spiritual-light overflow-hidden">
          {(featuredImageUrl || coverImageUrl) ? (
            <Image 
              src={featuredImageUrl || coverImageUrl}
              alt={meditationTitle}
              className="object-cover"
              fill
              sizes="100vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-meditation" />
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-30" />
        </div>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="container-custom text-white">
            <Link href="/rajyog-meditation" className="inline-flex items-center text-sm text-white hover:text-gray-200 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Meditations
            </Link>
            
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-display font-bold mb-2 drop-shadow-md">
                {meditationTitle}
              </h1>
              
              {displayTitle && (
                <p className="text-xl md:text-2xl mb-6 drop-shadow-md">
                  {displayTitle}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="inline-block rounded-full bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                  {duration} minutes
                </div>
                
                {trending && (
                  <div className="inline-block rounded-full bg-spiritual-light bg-opacity-90 px-4 py-2 text-sm font-medium text-spiritual-dark">
                    Trending
                  </div>
                )}
                
                <div className="inline-block rounded-full bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 text-sm font-medium">
                  {language}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-white py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main content */}
            <div className="md:w-2/3">
              {/* Waveform Player */}
              <WaveformPlayer meditation={meditation} />
              
              {/* Teacher info in a nice card */}
              {teacherInfo && (
                <div className="mb-8 mt-6">
                  <Link href={`/rajyog-meditation/teacher/${teacherInfo.slug}`}>
                    <div className="flex items-start bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer">
                      <div className="flex-shrink-0 w-24 aspect-square rounded-full overflow-hidden bg-spiritual-light mr-5">
                        {teacherInfo.image ? (
                          <img 
                            src={teacherInfo.image}
                            alt={teacherInfo.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-spiritual-light"><span class="text-spiritual-dark font-bold text-2xl">${teacherInfo.name ? teacherInfo.name.charAt(0) : 'BK'}</span></div>`;
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <span className="text-spiritual-dark font-bold text-2xl">
                              {teacherInfo.name ? teacherInfo.name.charAt(0) : 'BK'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-medium">{teacherInfo.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{teacherInfo.designation}</p>
                        <p className="text-gray-700 line-clamp-2">
                          {typeof teacherInfo.shortIntro === 'string' 
                            ? teacherInfo.shortIntro 
                            : 'Brahma Kumaris Meditation Teacher'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              
              {/* Commentary lyrics */}
              {meditation.attributes.CommentaryLyrics && Array.isArray(meditation.attributes.CommentaryLyrics) && meditation.attributes.CommentaryLyrics.length > 0 && (
                <div className="mb-10">
                  <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                    Commentary
                  </h2>
                  
                  <div className="prose prose-lg max-w-none">
                    {meditation.attributes.CommentaryLyrics.map((block, index) => (
                      <p key={index} className="mb-4">
                        {block.children?.map((child, childIndex) => (
                          <span key={childIndex}>{typeof child.text === 'string' ? child.text : ''}</span>
                        ))}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Benefits */}
              <div className="mb-10">
                <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
                  Benefits
                </h2>
                
                <div className="prose prose-lg max-w-none">
                  {meditation.attributes.BenefitsBig && Array.isArray(meditation.attributes.BenefitsBig) && meditation.attributes.BenefitsBig.length > 0 ? (
                    meditation.attributes.BenefitsBig.map((block, index) => (
                      <p key={index} className="mb-4">
                        {block.children?.map((child, childIndex) => (
                          <span key={childIndex}>{typeof child.text === 'string' ? child.text : ''}</span>
                        ))}
                      </p>
                    ))
                  ) : (
                    <p>
                      {typeof meditationBenefits === 'string' ? meditationBenefits : 'Experience deep inner calm, mental clarity, and spiritual connection.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="md:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Meditation Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{duration} minutes</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-medium">{language}</p>
                  </div>
                  
                  {categories.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Categories</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {categories.map(category => (
                          <span key={category.id} className="inline-block text-sm bg-gray-200 px-2 py-1 rounded">
                            {category.attributes.CategoryDisplay || category.attributes.Category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {teacher && (
                    <div>
                      <p className="text-sm text-gray-500">Teacher</p>
                      <p className="font-medium">{teacher.attributes.Name}</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={handlePlayClick}
                    className="w-full py-3 flex items-center justify-center rounded-md bg-pink-400 hover:bg-pink-500 text-white transition-colors"
                  >
                    {isCurrentlyPlaying ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Pause Meditation
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                        Play Meditation
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More Meditations Like This Section */}
      {relatedMeditations && relatedMeditations.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-6">
              More Meditations Like This
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedMeditations.map((relMeditation) => (
                <RelatedMeditationCard 
                  key={relMeditation.id} 
                  meditation={relMeditation} 
                />
              ))}
            </div>
            
            <div className="mt-8 text-center">
              <Link href="/rajyog-meditation/explore">
                <span className="inline-block py-3 px-6 bg-spiritual-dark hover:bg-spiritual-accent text-white rounded-md transition-colors cursor-pointer">
                  Explore All Meditations
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* More from Teacher Section */}
      {teacher && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-6">
              {teacherMeditations.length > 0 ? `More from ${teacher.attributes.Name}` : `About ${teacher.attributes.Name}`}
            </h2>
            
            <div className="flex flex-col md:flex-row items-start md:items-center mb-8">
              <div className="flex-shrink-0 w-32 aspect-square rounded-full overflow-hidden bg-spiritual-light mr-4 mb-4 md:mb-0">
                {teacher.attributes.FeaturedImage?.data ? (
                  <img 
                    src={getImageUrl(teacher.attributes.FeaturedImage.data)}
                    alt={teacher.attributes.Name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-spiritual-light"><span class="text-spiritual-dark font-bold text-2xl">${teacher.attributes.Name ? teacher.attributes.Name.charAt(0) : 'BK'}</span></div>`;
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-spiritual-light">
                    <span className="text-spiritual-dark font-bold text-2xl">
                      {teacher.attributes.Name ? teacher.attributes.Name.charAt(0) : 'BK'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-medium">{teacher.attributes.Name}</h3>
                {teacher.attributes.Designation && (
                  <p className="text-sm text-gray-600 mb-2">{teacher.attributes.Designation}</p>
                )}
                <p className="text-gray-700">
                  {typeof teacher.attributes.ShortIntro === 'string' && teacher.attributes.ShortIntro
                    ? teacher.attributes.ShortIntro
                    : (typeof teacher.attributes.Bio === 'string' 
                        ? (teacher.attributes.Bio.substring(0, 180) + (teacher.attributes.Bio.length > 180 ? '...' : ''))
                        : 'Brahma Kumaris Teacher who guides meditations with deep spiritual insights.')}
                </p>
              </div>
            </div>
            
            {teacherMeditations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teacherMeditations.map((teacherMeditation) => (
                  <RelatedMeditationCard 
                    key={teacherMeditation.id} 
                    meditation={teacherMeditation} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center bg-gray-50 p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">
                  Explore more meditations from BK {teacher.attributes.Name} coming soon.
                </p>
                <Link href="/rajyog-meditation/explore">
                  <span className="inline-block py-2 px-6 bg-spiritual-dark hover:bg-spiritual-accent text-white rounded-md transition-colors cursor-pointer">
                    Explore All Meditations
                  </span>
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Teachers Grid Section */}
      {teachers && teachers.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-spiritual-light/10 to-blue-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-8 text-left">
              Rajyoga Meditation Teachers
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teachers.map(t => (
                <TeacherCard 
                  key={t.id} 
                  teacher={t} 
                  meditationCount={meditationCounts[t.id] || 0}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    // Import here to avoid circular dependency
    const { getMeditations } = await import('../../../lib/api/strapi-optimized');
    const meditations = await getMeditations('minimal');
    
    const paths = meditations.map((meditation) => ({
      params: { slug: meditation.attributes.Slug },
    }));
    
    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error("Error generating paths:", error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const { slug } = params;
    console.log(`Fetching optimized meditation page data for: ${slug}`);
    const startTime = Date.now();
    
    // Fetch all data using the optimized single call
    const pageData = await getMeditationPageData(slug);
    
    if (!pageData) {
      console.error(`No meditation found with slug: ${slug}`);
      return {
        notFound: true,
      };
    }
    
    const { meditation, relatedMeditations, teachers, meditationCounts } = pageData;
    
    const endTime = Date.now();
    console.log(`Meditation page data fetched in ${endTime - startTime}ms`);
    
    return {
      props: {
        meditation,
        relatedMeditations,
        teacher: teachers.length > 0 ? teachers[0] : null, // For backward compatibility
        teacherMeditations: [], // Not needed anymore
        teachers,
        meditationCounts
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (error) {
    console.error("Error getting meditation:", error);
    return {
      notFound: true,
    };
  }
} 