import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getMeditationBySlug } from '../../../lib/api/strapi';

// This redirects from /rajyog-meditation/meditation-redirect/[slug] to /rajyog-meditation/meditations/[slug]
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
  const { slug } = params;
  
  // Check if this is a valid meditation
  const meditation = await getMeditationBySlug(slug);
  
  if (meditation) {
    return {
      props: {
        foundMeditation: true,
        slug,
      }
    };
  }
  
  // No meditation found
  return {
    notFound: true, // This will show the 404 page
  };
} 