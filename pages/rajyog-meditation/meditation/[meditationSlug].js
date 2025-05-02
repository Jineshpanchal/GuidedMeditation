import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import AudioPlayer from '../../../components/meditation/AudioPlayer';
import { getMeditations, getMeditationBySlug, getTeachers, getLanguages } from '../../../lib/api/strapi';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import WaveformPlayer from '../../../components/meditation/WaveformPlayer';
import ParticlesBackground from '../../../components/ParticlesBackground';

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

export default function MeditationPage({ meditation, teachers, languages }) {
  const { playMeditation, togglePlay, isPlaying, currentMeditation } = useAudioPlayer();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  useEffect(() => {
    // Set the selected language based on the meditation's language
    if (meditation?.attributes?.gm_language?.data) {
      setSelectedLanguage(meditation.attributes.gm_language.data);
    }
  }, [meditation]);
  
  if (!meditation) {
    return <div>Meditation not found</div>;
  }

  const meditationTitle = meditation.attributes.Title || 'Guided Meditation';
  const meditationBenefits = meditation.attributes.BenefitsShort?.[0]?.children?.[0]?.text || '';
  
  // Media
  const mediaUrl = meditation.attributes.Media?.data?.attributes?.url;
  
  // Handle play directly with the context
  const handlePlayClick = () => {
    if (currentMeditation && currentMeditation.id === meditation.id) {
      togglePlay();
    } else {
      playMeditation(meditation);
      setTimeout(togglePlay, 300); // Small delay to ensure meditation is loaded
    }
  };

  // Get language name
  const languageName = selectedLanguage?.attributes?.Name || 'English';

  return (
    <Layout
      title={`${meditationTitle} | Brahma Kumaris Meditation`}
      description={meditationBenefits}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, guided meditation, ${meditationTitle.toLowerCase()}`} />
      </Head>

      {/* Hero Section */}
      <section className="bg-pastel-gradient-3 py-12 md:py-20 relative">
        <ParticlesBackground />
        <div className="container-custom relative z-10">
          <Link 
            href="/rajyog-meditation"
            className="inline-flex items-center text-sm text-gray-700 hover:text-spiritual-dark mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go back to Home Page
          </Link>
          
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {meditationTitle}
            </h1>
            <p className="text-lg text-gray-800 mb-6">
              {meditation.attributes.DisplayTitle || 'Guided Meditation'}
            </p>
            <div className="flex justify-center space-x-4">
              <div className="inline-block rounded-full bg-white bg-opacity-30 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-800">
                {meditation.attributes.Duration || '5'} min
              </div>
              
              {meditation.attributes.Trending && (
                <div className="inline-block rounded-full bg-spiritual-light px-4 py-2 text-sm font-medium text-spiritual-dark">
                  Trending
                </div>
              )}
              
              {selectedLanguage && (
                <div className="inline-block rounded-full bg-white bg-opacity-30 backdrop-blur-sm px-4 py-2 text-sm font-medium text-gray-800">
                  {languageName}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Audio Player */}
      <section className="py-10 bg-white">
        <div className="container-custom">
          <WaveformPlayer meditation={meditation} />
        </div>
      </section>

      {/* Meditation Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              Commentary Lyrics
            </h2>
            
            <div className="prose prose-lg max-w-none mb-10">
              {meditation.attributes.CommentaryLyrics ? (
                meditation.attributes.CommentaryLyrics.map((block, index) => (
                  <p key={index}>
                    {block.children.map((child, childIndex) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </p>
                ))
              ) : (
                <p>No commentary lyrics available for this meditation.</p>
              )}
            </div>
            
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              Benefits
            </h2>
            
            <div className="prose prose-lg max-w-none">
              {meditation.attributes.BenefitsBig ? (
                meditation.attributes.BenefitsBig.map((block, index) => (
                  <p key={index}>
                    {block.children.map((child, childIndex) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </p>
                ))
              ) : (
                <p>Experience deep inner calm, mental clarity, and spiritual connection.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Meditations */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
            Practice Tips
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-spiritual-dark mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Find a quiet place where you won't be disturbed for the duration of the meditation.</p>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-spiritual-dark mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Sit comfortably with your back straight, either on a chair or on the floor.</p>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-spiritual-dark mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Gently close your eyes and take a few deep breaths to settle your mind.</p>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-spiritual-dark mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p>After the meditation, take a moment to sit in silence before opening your eyes.</p>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-spiritual-dark mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <p>Try to continue the awareness you gained during meditation into your daily activities.</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Teachers Section */}
      {teachers && teachers.length > 0 && (
        <section className="py-12 bg-gradient-to-br from-spiritual-light/10 to-blue-50">
          <div className="container-custom">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
              Brahma Kumaris Rajyoga Teachers
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <Link 
                  key={teacher.id}
                  href={`/rajyog-meditation/teacher/${teacher.attributes.Slug}`}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    {teacher.attributes.FeaturedImage?.data?.attributes?.url ? (
                      <img
                        src={getImageUrl(teacher.attributes.FeaturedImage.data)}
                        alt={teacher.attributes.Name || "Teacher"}
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
                  <h3 className="text-lg font-medium text-gray-900 text-center">
                    {teacher.attributes.Name || "Brahma Kumaris Teacher"}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {teacher.attributes.Designation || "Meditation Guide"}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Language Section */}
      {languages && languages.length > 0 && (
        <section className="py-8 bg-gray-50">
          <div className="container-custom">
            <h3 className="text-lg font-medium text-gray-900 mb-3 text-center">
              Available Languages
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {languages.map(language => (
                <span
                  key={language.id}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedLanguage && selectedLanguage.id === language.id
                      ? 'bg-spiritual-dark text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {language.attributes.Name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export async function getStaticPaths() {
  const meditations = await getMeditations();
  
  const paths = meditations.map((meditation) => ({
    params: { meditationSlug: meditation.attributes.Slug },
  }));
  
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { meditationSlug } = params;
  
  const meditation = await getMeditationBySlug(meditationSlug);
  
  if (!meditation) {
    return {
      notFound: true,
    };
  }
  
  // Fetch all teachers
  const teachers = await getTeachers({
    'populate[FeaturedImage]': '*',
  });
  
  // Fetch all languages
  const languages = await getLanguages();
  
  return {
    props: {
      meditation,
      teachers: teachers || [],
      languages: languages || [],
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
} 