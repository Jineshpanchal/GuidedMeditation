import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../../../components/layout/Layout';
import MeditationCard from '../../../../components/meditation/MeditationCard';
import { getTeachers, getTeacherBySlug, getMeditations } from '../../../../lib/api/strapi';

export default function TeacherPage({ teacher, meditations }) {
  if (!teacher) {
    return <div>Teacher not found</div>;
  }

  const teacherName = teacher.attributes.Name || 'Brahma Kumaris Teacher';
  const teacherShortIntro = teacher.attributes.ShortIntro?.[0]?.children?.[0]?.text || '';
  const teacherDesignation = teacher.attributes.Designation || '';

  return (
    <Layout
      title={`${teacherName} | Brahma Kumaris Meditation`}
      description={`${teacherShortIntro} Guided meditations and teachings by ${teacherName}, ${teacherDesignation}.`}
    >
      <Head>
        <meta name="keywords" content={`meditation, spirituality, brahma kumaris, raja yoga, ${teacherName.toLowerCase()}, teacher, guide`} />
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
          
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                {teacherName}
              </h1>
              <p className="text-lg text-gray-800 mb-2">
                {teacherDesignation}
              </p>
              <p className="text-lg text-gray-800 mb-6">
                {teacherShortIntro}
              </p>
            </div>
            
            <div className="md:w-1/2 md:pl-12 flex justify-center">
              <div className="w-48 h-48 bg-white rounded-full shadow-lg flex items-center justify-center">
                {/* This could be replaced with the teacher's image */}
                <div className="w-24 h-24 rounded-full bg-spiritual-light flex items-center justify-center">
                  <span className="text-spiritual-dark font-bold text-2xl">BK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Bio */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6">
              About {teacherName}
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
                <div className="mt-4">
                  <h3 className="text-xl font-display font-medium text-gray-900 mb-4">Background</h3>
                  <p>{teacher.attributes.KnowMore}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Teacher's Meditations */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-display font-semibold text-gray-900 mb-8">
            Guided Meditations by {teacherName}
          </h2>
          
          {meditations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {meditations.map((meditation) => (
                <MeditationCard key={meditation.id} meditation={meditation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-600">No meditations found for this teacher.</p>
            </div>
          )}
        </div>
      </section>

      {/* Approach to Meditation */}
      <section className="py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-semibold text-gray-900 mb-6 text-center">
              Teaching Approach
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
  
  const teacher = await getTeacherBySlug(teacherSlug);
  
  if (!teacher) {
    return {
      notFound: true,
    };
  }
  
  // In a real scenario, we'd filter meditations by teacher
  // Here, we're just returning a subset of meditations as a simplified approach
  const allMeditations = await getMeditations({
    'pagination[limit]': 4,
  });
  
  return {
    props: {
      teacher,
      meditations: allMeditations,
    },
    revalidate: 60 * 60, // Revalidate every hour
  };
} 