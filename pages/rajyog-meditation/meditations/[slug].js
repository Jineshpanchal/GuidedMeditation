import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import WaveformPlayer from '../../../components/meditation/WaveformPlayer';
import RelatedMeditationCard from '../../../components/meditation/RelatedMeditationCard';
import MeditationCarousel from '../../../components/meditation/MeditationCarousel';
import TeacherCard from '../../../components/ui/TeacherCard';
import RichTextRenderer from '../../../components/ui/RichTextRenderer';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import { 
  getMeditationSchema, 
  getTeacherSchema, 
  getBreadcrumbSchema,
  getOrganizationSchema 
} from '../../../lib/seo/structuredData';
import axios from 'axios';
import { 
  getMeditationPageData
} from '../../../lib/api/strapi-optimized';

// Collapsible Section Component
const CollapsibleSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header with toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-gradient-to-r from-spiritual-light/20 to-spiritual-accent/20 p-6 border-b border-gray-100 text-left hover:from-spiritual-light/30 hover:to-spiritual-accent/30 transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display font-semibold text-gray-900">
              {title}
            </h2>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 text-spiritual-dark transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        
        {/* Content with smooth animation */}
        <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default function MeditationPage({ meditation, relatedMeditations, teacherMeditations, teacher, teachers, meditationCounts }) {
  const { playMeditation, togglePlay, isPlaying, currentMeditation, hasEnded } = useAudioPlayer();
  
  if (!meditation) {
    return <div>Meditation not found</div>;
  }

  // Debug: Log the meditation data structure
  console.log('Meditation data:', {
    title: meditation.attributes.Title,
    commentaryLyrics: meditation.attributes.CommentaryLyrics,
    benefitsBig: meditation.attributes.BenefitsBig
  });

  const isCurrentlyPlaying = 
    currentMeditation && 
    currentMeditation.id === meditation.id && 
    isPlaying;

  // Extract metadata
  const meditationTitle = meditation.attributes.Title || 'Guided Meditation';
  const displayTitle = meditation.attributes.DisplayTitle || '';
  
  // Enhanced BenefitsShort extraction for SEO metadata
  const meditationBenefits = (() => {
    const benefitsShort = meditation.attributes.BenefitsShort;
    
    // Handle null/undefined
    if (!benefitsShort) return '';
    
    // Handle string format
    if (typeof benefitsShort === 'string') {
      return benefitsShort.trim();
    }
    
    // Handle array format (rich text blocks)
    if (Array.isArray(benefitsShort)) {
      let extractedText = '';
      
      for (const block of benefitsShort) {
        if (block && typeof block === 'object') {
          // Handle block with children array
          if (Array.isArray(block.children)) {
            for (const child of block.children) {
              if (child && typeof child.text === 'string') {
                extractedText += child.text;
              }
            }
          }
          // Handle direct text property
          else if (typeof block.text === 'string') {
            extractedText += block.text;
          }
        }
        // Handle direct string in array
        else if (typeof block === 'string') {
          extractedText += block;
        }
      }
      
      return extractedText.trim();
    }
    
    // Handle object format
    if (typeof benefitsShort === 'object') {
      // Try to extract text from object
      if (typeof benefitsShort.text === 'string') {
        return benefitsShort.text.trim();
      }
      // Try to extract from children
      if (Array.isArray(benefitsShort.children)) {
        let extractedText = '';
        for (const child of benefitsShort.children) {
          if (child && typeof child.text === 'string') {
            extractedText += child.text;
          }
        }
        return extractedText.trim();
      }
    }
    
    return '';
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
          : 'Brahma Kumaris Rajyoga Meditation Teacher'),
    designation: teacher.attributes.Designation || 'Brahma Kumaris Teacher',
    slug: teacher.attributes.Slug || '',
  } : null;

  // Debug: Log the meditation data structure for BenefitsShort
  console.log('Meditation BenefitsShort data:', {
    title: meditation.attributes.Title,
    benefitsShort: meditation.attributes.BenefitsShort,
    extractedBenefits: meditationBenefits,
    benefitsShortType: typeof meditation.attributes.BenefitsShort
  });

  // SEO Data
  const canonical = `https://www.brahmakumaris.com/rajyog-meditation/meditations/${meditation.attributes.Slug}`;
  const keywords = `meditation, spirituality, brahma kumaris, rajyoga, guided meditation, ${meditationTitle.toLowerCase()}, ${teacherInfo?.name?.toLowerCase() || 'teacher'}`;
  
  // Create enhanced descriptions for SEO that prioritize BenefitsShort
  const seoDescription = meditationBenefits 
    ? (meditationBenefits.length > 155 ? `${meditationBenefits.substring(0, 152)}...` : meditationBenefits)
    : `Experience a ${duration}-minute guided Rajyoga meditation by ${teacherInfo?.name || 'Brahma Kumaris'} for spiritual growth and inner peace.`;

  const shortSeoDescription = meditationBenefits 
    ? (meditationBenefits.length > 120 ? `${meditationBenefits.substring(0, 117)}...` : meditationBenefits)
    : `${duration}-minute guided meditation by ${teacherInfo?.name || 'Brahma Kumaris'}`;
  
  // Open Graph data
  const openGraph = {
    title: `${meditationTitle} | Rajyoga Meditation | Brahma Kumaris`,
    description: shortSeoDescription,
    url: canonical,
    type: 'article',
    image: featuredImageUrl || coverImageUrl || '/rajyoga-meditation/images/og-meditation-default.jpg',
    imageAlt: `${meditationTitle} - Guided Meditation`,
    article: {
      author: teacherInfo?.name || 'Brahma Kumaris',
      section: 'Meditation',
      tag: categories.map(cat => cat.attributes?.Category || '').filter(Boolean).join(', ')
    }
  };

  // Twitter data
  const twitter = {
    title: meditationTitle.length > 60 ? `${meditationTitle.substring(0, 57)}...` : meditationTitle,
    description: meditationBenefits ? 
      (meditationBenefits.length > 120 ? `${meditationBenefits.substring(0, 117)}...` : meditationBenefits) :
      `${duration}-minute guided meditation`
  };

  // Structured Data
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.brahmakumaris.com/rajyog-meditation' },
    { name: 'Meditations', url: 'https://www.brahmakumaris.com/rajyog-meditation/explore' },
    { name: meditationTitle, url: canonical }
  ];

  const structuredData = [
    getOrganizationSchema(),
    getMeditationSchema(meditation, teacherInfo?.name),
    getBreadcrumbSchema(breadcrumbs)
  ];

  if (teacherInfo && teacher) {
    structuredData.push(getTeacherSchema(teacher));
  }

  // Handle play click
  const handlePlayClick = () => {
    if (currentMeditation && currentMeditation.id === meditation.id) {
      togglePlay();
    } else {
      playMeditation(meditation, true); // Start from beginning when clicking play on detail page
      setTimeout(togglePlay, 100); // Small delay to ensure meditation is loaded
    }
  };

  return (
    <Layout
      title={`${meditationTitle} | Rajyoga Meditation | Brahma Kumaris`}
      description={seoDescription}
      canonical={canonical}
      keywords={keywords}
      openGraph={openGraph}
      twitter={twitter}
      structuredData={structuredData}
    >
      {/* Hero Section with Featured Image */}
      <section className="relative">
        {/* Featured Image or Cover Image - starts from very top */}
        <div className="h-96 md:h-[32rem] w-full relative bg-spiritual-light overflow-hidden">
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
        
        {/* Content overlay - positioned below header */}
        <div className="absolute inset-0 flex items-center pt-28 md:pt-32">
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main content */}
            <div className="lg:w-3/4">
              {/* Waveform Player */}
              <WaveformPlayer meditation={meditation} />
              
              {/* Commentary lyrics */}
              {meditation.attributes.CommentaryLyrics && Array.isArray(meditation.attributes.CommentaryLyrics) && meditation.attributes.CommentaryLyrics.length > 0 && (
                <CollapsibleSection title="Commentary" defaultOpen={false}>
                  <div className="prose prose-lg max-w-none">
                    <RichTextRenderer content={meditation.attributes.CommentaryLyrics} />
                  </div>
                </CollapsibleSection>
              )}
              
              {/* Benefits */}
              <CollapsibleSection title="Benefits" defaultOpen={true}>
                <div className="prose prose-lg max-w-none">
                  {meditation.attributes.BenefitsBig && Array.isArray(meditation.attributes.BenefitsBig) && meditation.attributes.BenefitsBig.length > 0 ? (
                    <RichTextRenderer content={meditation.attributes.BenefitsBig} />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {typeof meditationBenefits === 'string' ? meditationBenefits : 'Experience deep inner calm, mental clarity, and spiritual connection.'}
                    </p>
                  )}
                </div>
              </CollapsibleSection>
            </div>
            
            {/* Teacher Card Sidebar */}
            <div className="lg:w-1/4">
              {teacherInfo && (
                <div className="sticky top-24">
                  <Link href={`/rajyog-meditation/teacher/${teacherInfo.slug}`}>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 cursor-pointer p-6">
                      <div className="text-center">
                        {/* Profile Image */}
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 shadow-md mb-4">
                          {teacherInfo.image ? (
                            <img 
                              src={teacherInfo.image}
                              alt={teacherInfo.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `<div class="h-full w-full flex items-center justify-center bg-gray-100"><span class="text-gray-600 font-bold text-2xl">${teacherInfo.name ? teacherInfo.name.charAt(0) : 'BK'}</span></div>`;
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <span className="text-gray-600 font-bold text-2xl">
                                {teacherInfo.name ? teacherInfo.name.charAt(0) : 'BK'}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Name */}
                        <h4 className="text-xl font-display font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {teacherInfo.name}
                        </h4>
                        
                        {/* Designation */}
                        <p className="text-sm text-gray-600 mb-4 font-medium">
                          {teacherInfo.designation}
                        </p>
                        
                        {/* Short Intro */}
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                          {typeof teacherInfo.shortIntro === 'string' 
                            ? teacherInfo.shortIntro 
                            : 'Brahma Kumaris Rajyoga Meditation Teacher'}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* More Meditations Like This Section */}
      {relatedMeditations && relatedMeditations.length > 0 && (
        <MeditationCarousel
          title="Meditations Like This"
          meditations={relatedMeditations}
          CardComponent={RelatedMeditationCard}
          showHeaderButton={true}
          viewAllLink="/rajyog-meditation/explore"
          headerButtonText="More"
          backgroundColor="bg-gray-50"
        />
      )}

      {/* More Meditations by This Teacher */}
      {teacherInfo && teacherMeditations && teacherMeditations.length > 0 && (
        <MeditationCarousel
          title={`Meditations by ${teacherInfo.name}`}
          meditations={teacherMeditations.slice(0, 8)}
          CardComponent={RelatedMeditationCard}
          showHeaderButton={true}
          viewAllLink={`/rajyog-meditation/teacher/${teacherInfo.slug}`}
          headerButtonText="More"
          backgroundColor="bg-gray-50"
        />
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
    
    const { meditation, relatedMeditations, teacherMeditations, teachers, meditationCounts } = pageData;
    
    const endTime = Date.now();
    console.log(`Meditation page data fetched in ${endTime - startTime}ms`);
    
    return {
      props: {
        meditation,
        relatedMeditations,
        teacherMeditations,
        teacher: teachers.length > 0 ? teachers[0] : null, // For backward compatibility
        teachers,
        meditationCounts
      },
      revalidate: 300, // Keep at 5 minutes for fresh meditation data
    };
  } catch (error) {
    console.error("Error getting meditation:", error);
    return {
      notFound: true,
    };
  }
} 