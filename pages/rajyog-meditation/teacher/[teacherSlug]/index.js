import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../../components/layout/Layout';
import { getTeachers, getTeacherBySlug, getMeditations } from '../../../../lib/api/strapi';
import { useAudioPlayer } from '../../../../contexts/AudioPlayerContext';

export default function TeacherPage({ teacher, meditations }) {
  const { playMeditation, togglePlay, currentMeditation, isPlaying } = useAudioPlayer();
  const [playingStates, setPlayingStates] = useState({});
  
  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  const teacherName = teacher.attributes.Name || 'Brahma Kumaris Teacher';
  const teacherDesignation = teacher.attributes.Designation || '';
  
  // Update the playing states when the current meditation changes
  useEffect(() => {
    if (meditations && meditations.length > 0) {
      const newPlayingStates = {};
      meditations.forEach(meditation => {
        newPlayingStates[meditation.id] = 
          isPlaying && 
          currentMeditation && 
          currentMeditation.id === meditation.id;
      });
      setPlayingStates(newPlayingStates);
    }
  }, [isPlaying, currentMeditation, meditations]);
  
  const handlePlayClick = (e, meditation) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If this is already the current meditation, just toggle play/pause
    if (currentMeditation && currentMeditation.id === meditation.id) {
      togglePlay();
    } else {
      // Otherwise, set this as the current meditation and play it
      playMeditation(meditation);
      // Small delay to ensure the audio is loaded before playing
      setTimeout(() => {
        togglePlay();
      }, 100);
    }
  };

  return (
    <Layout
      title={`${teacherName} | Brahma Kumaris Meditation`}
      description={`Guided meditations and teachings by ${teacherName}, ${teacherDesignation}.`}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, ${teacherName.toLowerCase()}, teacher, guide`} />
      </Head>

      {/* Modern Hero Section - With reduced height */}
      <section className="relative bg-gradient-to-r from-purple-200 to-pink-200 py-12 md:py-16 overflow-hidden">
        {/* Light Effect */}
        <div className="absolute top-8 right-1/2 transform translate-x-1/2 w-8 h-8 rounded-full bg-white opacity-50 blur-xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white opacity-20" />
        
        <div className="container-custom relative z-10">
          <Link 
            href="/rajyog-meditation"
            className="inline-flex items-center text-sm text-gray-700 hover:text-spiritual-dark mb-6"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Go back to Home Page
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                {teacherName}
              </h1>
              <p className="text-xl text-gray-800">
                {teacherDesignation}
              </p>
            </div>
            
            <div className="md:w-1/3 flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute -inset-1.5 bg-white opacity-50 blur-md"></div>
                <div className="w-64 h-64 overflow-hidden shadow-xl relative z-10">
                  {teacher.attributes.FeaturedImage?.data && 
                   Array.isArray(teacher.attributes.FeaturedImage.data) && 
                   teacher.attributes.FeaturedImage.data.length > 0 ? (
                    <img 
                      src={teacher.attributes.FeaturedImage.data[0].attributes.url} 
                      alt={teacherName}
                      className="object-cover w-full h-full scale-100"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentNode.classList.add('bg-spiritual-light');
                      }}
                    />
                  ) : teacher.attributes.FeaturedImage?.data && !Array.isArray(teacher.attributes.FeaturedImage.data) ? (
                    <img 
                      src={teacher.attributes.FeaturedImage.data.attributes.url} 
                      alt={teacherName}
                      className="object-cover w-full h-full scale-125"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentNode.classList.add('bg-spiritual-light');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-spiritual-light">
                      <span className="text-spiritual-dark font-bold text-5xl">
                        {teacherName ? teacherName.charAt(0) : 'BK'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher's Meditations */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-gray-900 mb-10">
            Guided Meditations
          </h2>
          
          {meditations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {meditations.map((meditation) => {
                // Get teacher information - simplified to use current teacher name when available
                const meditationTeacher = meditation.attributes.gm_rajyoga_teachers?.data ? 
                  (Array.isArray(meditation.attributes.gm_rajyoga_teachers.data) && meditation.attributes.gm_rajyoga_teachers.data.length > 0 ?
                    meditation.attributes.gm_rajyoga_teachers.data[0].attributes.Name :
                    (meditation.attributes.gm_rajyoga_teachers.data.attributes?.Name || teacherName)) :
                  teacherName;
                
                const isThisPlaying = playingStates[meditation.id] || false;
                
                return (
                  <div key={meditation.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col">
                    <Link href={`/rajyog-meditation/meditations/${meditation.attributes.Slug}`} className="block">
                      <div className="aspect-w-16 aspect-h-9 bg-pink-100 relative">
                        {meditation.attributes.FeaturedImage?.data?.attributes?.url ? (
                          <img 
                            src={meditation.attributes.FeaturedImage.data.attributes.url}
                            alt={meditation.attributes.Title || 'Meditation'} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-pink-100"></div>
                        )}
                      </div>
                    </Link>
                    <div className="p-4 flex-grow flex flex-col relative">
                      <div className="text-xs text-gray-500 mb-1">
                        AUDIO: {meditation.attributes.Duration || '5'} Minutes
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {meditation.attributes.Title || 'Guided Meditation'}
                      </h3>
                      <div className="text-xs text-gray-500 flex items-center">
                        <span>{meditationTeacher}</span>
                      </div>
                      
                      {meditation.attributes.Trending && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-spiritual-light text-spiritual-dark">
                            Trending
                          </span>
                        </div>
                      )}
                      
                      {/* Play button in bottom right */}
                      <button 
                        className="absolute bottom-4 right-4 w-12 h-12 bg-spiritual-dark rounded-full flex items-center justify-center shadow-md hover:bg-spiritual-dark/90 transition-colors z-10"
                        onClick={(e) => handlePlayClick(e, meditation)}
                        aria-label={isThisPlaying ? "Pause meditation" : "Play meditation"}
                      >
                        {isThisPlaying ? (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                          </svg>
                        ) : (
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 text-white" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No meditations found for this teacher.</p>
            </div>
          )}
        </div>
      </section>

      {/* Approach to Meditation */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Teaching <span className="font-normal">Approach</span>
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p>
                Brahma Kumaris teachers approach meditation as a pathway to self-realization and spiritual awakening. They believe in the power of contemplation on the true nature of the self as a peaceful, eternal soul, distinct from the physical body.
              </p>
              
              <p>
                Through guided commentaries, they help practitioners establish a loving connection with the Supreme Soul, drawing spiritual power and clarity. Their method emphasizes regular practice, turning spiritual knowledge into lived experience.
              </p>
              
              <p>
                The goal is not merely stress reduction or relaxation (though these are natural benefits), but a complete transformation of consciousness that leads to pure thoughts, elevated actions, and harmonious relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Bio - Moved to end of page */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">
              About <span className="font-normal">{teacherName}</span>
            </h2>
            
            <div className="prose prose-lg max-w-none">
              {teacher.attributes.BigIntro ? (
                teacher.attributes.BigIntro.map((block, index) => (
                  <p key={index}>
                    {block.children.map((child, childIndex) => (
                      <span key={childIndex}>{child.text}</span>
                    ))}
                  </p>
                ))
              ) : (
                <p>
                  A dedicated Raja Yoga meditation teacher with the Brahma Kumaris. Through years of spiritual practice and study, they have mastered the art of guiding others into deeper states of awareness and connection with the inner self.
                </p>
              )}
              
              {teacher.attributes.KnowMore && (
                <div className="mt-8">
                  <h3 className="text-xl font-display font-medium text-gray-900 mb-4">Background</h3>
                  <p>{teacher.attributes.KnowMore}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export async function getStaticPaths() {
  const teachers = await getTeachers();
  
  const paths = teachers.map((teacher) => ({
    params: { teacherSlug: teacher.attributes.Slug },
  }));
  
  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { teacherSlug } = params;
  
  try {
    // Fetch only necessary teacher data with limited fields
    const teacher = await getTeacherBySlug(teacherSlug, {
      'fields[0]': 'Name',
      'fields[1]': 'Slug',
      'fields[2]': 'Designation',
      'fields[3]': 'BigIntro',
      'fields[4]': 'KnowMore',
      'populate[FeaturedImage]': '*',
    });
    
    if (!teacher) {
      return {
        notFound: true,
      };
    }

    // Get the teacher ID for filtering
    const teacherId = teacher.id;
    console.log(`Teacher ID for ${teacherSlug}:`, teacherId);
    
    // Fetch only the meditations for this teacher with strictly needed fields
    const teacherMeditations = await getMeditations({
      'filters[gm_rajyoga_teachers][id][$eq]': teacherId,
      'fields[0]': 'Title',
      'fields[1]': 'Slug',
      'fields[2]': 'Duration',
      'fields[3]': 'Trending',
      'populate[FeaturedImage]': '*',
      'populate[AudioFile]': '*',
      'populate[gm_rajyoga_teachers][fields][0]': 'Name',
      'populate[gm_rajyoga_teachers][fields][1]': 'Slug',
      'pagination[limit]': 40 // Limit to 10 meditations per teacher
    });
    
    console.log(`Found ${teacherMeditations.length} meditations for teacher ${teacherSlug}`);
    
    return {
      props: {
        teacher,
        meditations: teacherMeditations,
      },
      revalidate: 60 * 60, // Revalidate every hour
    };
  } catch (error) {
    console.error(`Error fetching data for teacher ${teacherSlug}:`, error);
    return {
      notFound: true
    };
  }
} 