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
import { useRouter } from 'next/router';

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

// This redirects from /rajyog-meditation/meditation/[meditationSlug] to /rajyog-meditation/meditations/[slug]
export default function MeditationRedirect({ foundMeditation, slug }) {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      if (foundMeditation) {
        router.replace(`/rajyog-meditation/meditations/${slug}`);
      }
    }
  }, [router, foundMeditation, slug]);

  // Show loading while redirecting
  return (
    <Layout title="Redirecting...">
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Redirecting to meditation...</p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { meditationSlug } = params;
  
  // Check if this is a valid meditation
  const meditation = await getMeditationBySlug(meditationSlug);
  
  if (meditation) {
    return {
      props: {
        foundMeditation: true,
        slug: meditationSlug,
      }
    };
  }
  
  // No meditation found
  return {
    notFound: true, // This will show the 404 page
  };
} 