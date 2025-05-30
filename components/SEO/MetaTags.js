import Head from 'next/head';

const MetaTags = ({
  title,
  description,
  canonical,
  openGraph = {},
  twitter = {},
  structuredData = null,
  noindex = false,
  keywords = ''
}) => {
  const defaultOG = {
    title: title || 'Brahma Kumaris Rajyoga Meditation',
    description: description || 'Guided audio meditations for spiritual growth, peace, and self-awareness',
    url: canonical || 'https://www.brahmakumaris.com/rajyog-meditation',
    type: 'website',
    image: 'https://www.brahmakumaris.com/rajyoga-meditation/images/og-meditation-default.jpg',
    imageAlt: 'Brahma Kumaris Rajyoga Meditation',
    siteName: 'Brahma Kumaris'
  };

  const ogData = { ...defaultOG, ...openGraph };

  const defaultTwitter = {
    card: 'summary_large_image',
    site: '@brahmakumaris',
    creator: '@brahmakumaris',
    title: ogData.title,
    description: ogData.description,
    image: ogData.image
  };

  const twitterData = { ...defaultTwitter, ...twitter };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:title" content={ogData.title} />
      <meta property="og:description" content={ogData.description} />
      <meta property="og:url" content={ogData.url} />
      <meta property="og:type" content={ogData.type} />
      <meta property="og:image" content={ogData.image} />
      <meta property="og:image:alt" content={ogData.imageAlt} />
      <meta property="og:site_name" content={ogData.siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Cards */}
      <meta name="twitter:card" content={twitterData.card} />
      <meta name="twitter:site" content={twitterData.site} />
      <meta name="twitter:creator" content={twitterData.creator} />
      <meta name="twitter:title" content={twitterData.title} />
      <meta name="twitter:description" content={twitterData.description} />
      <meta name="twitter:image" content={twitterData.image} />
      
      {/* Additional Meta Tags */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#4F46E5" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      
      {/* JSON-LD Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
};

export default MetaTags; 