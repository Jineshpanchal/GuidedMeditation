import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../../components/layout/Layout';
import AudioPlayer from '../../../components/meditation/AudioPlayer';
import { getMeditations, getMeditationBySlug, getTeachers, getLanguages } from '../../../lib/api/strapi';
import { useAudioPlayer } from '../../../contexts/AudioPlayerContext';
import WaveformPlayer from '../../../components/meditation/WaveformPlayer';

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
      <section className="bg-pastel-gradient-3 py-12 md:py-20">
        <div className="container-custom">
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
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teachers.map(teacher => (
                <div key={teacher.id} className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-lg transition-shadow">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden bg-spiritual-light">
                    {teacher.attributes.FeaturedImage?.data?.attributes?.url ? (
                      <img 
                        src={teacher.attributes.FeaturedImage.data.attributes.url}
                        alt={teacher.attributes.Name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-spiritual-dark font-bold text-xl">BK</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-spiritual-dark">{teacher.attributes.Name}</h3>
                  {teacher.attributes.Title && (
                    <p className="text-sm text-gray-600">{teacher.attributes.Title}</p>
                  )}
                  {teacher.attributes.Slug && (
                    <Link 
                      href={`/rajyog-meditation/teacher/${teacher.attributes.Slug}`}
                      className="mt-2 inline-block text-xs text-spiritual-dark underline"
                    >
                      View Meditations
                    </Link>
                  )}
                </div>
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