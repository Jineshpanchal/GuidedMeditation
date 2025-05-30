import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../components/layout/Layout';
import AudioPlayer from '../../../components/meditation/AudioPlayer';
import { getMeditations, getMeditationBySlug } from '../../../lib/api/strapi';

export default function MeditationPage({ meditation }) {
  if (!meditation) {
    return <div>Meditation not found</div>;
  }

  const meditationTitle = meditation.attributes.Title || 'Guided Meditation';
  const meditationBenefits = meditation.attributes.BenefitsShort?.[0]?.children?.[0]?.text || '';
  
  // This is a placeholder for the actual audio URL
  const audioUrl = "https://example.com/meditation-audio.mp3";

  return (
    <Layout
      title={`${meditationTitle} | Brahma Kumaris Meditation`}
      description={meditationBenefits}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, rajyoga, guided meditation, ${meditationTitle.toLowerCase()}`} />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-meditation py-12 md:py-20">
        <div className="container mx-auto px-4">
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
            </div>
          </div>
        </div>
      </section>

      {/* Audio Player */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <AudioPlayer audioSrc={audioUrl} title={meditationTitle} />
        </div>
      </section>

      {/* Meditation Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              Commentary Lyrics
            </h2>
            
            <div className="prose prose-lg max-w-none mb-10">
              {meditation.attributes.CommentaryLyrics ? (
                meditation.attributes.CommentaryLyrics.map((block, index) => (
                  <p key={index}>
                    {block.children?.map((child, childIndex) => (
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
                    {block.children?.map((child, childIndex) => (
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
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    const meditations = await getMeditations();
    
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
    
    const meditation = await getMeditationBySlug(slug);
    
    if (!meditation) {
      return {
        notFound: true,
      };
    }
    
    return {
      props: {
        meditation,
      },
      revalidate: 60, // Revalidate every minute
    };
  } catch (error) {
    console.error("Error getting meditation:", error);
    return {
      notFound: true,
    };
  }
} 