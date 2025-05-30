// Structured Data generators for SEO
const DOMAIN = 'https://www.brahmakumaris.com';

// Organization Schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Brahma Kumaris",
  "url": DOMAIN,
  "logo": `${DOMAIN}/images/bk-logo.png`,
  "description": "Brahma Kumaris is a worldwide spiritual organization dedicated to personal transformation and world renewal.",
  "sameAs": [
    "https://www.facebook.com/brahmakumaris",
    "https://www.youtube.com/brahmakumaris",
    "https://twitter.com/brahmakumaris",
    "https://www.instagram.com/brahmakumaris"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-294-2480500",
    "contactType": "customer service"
  }
});

// Website Schema
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Brahma Kumaris Rajyoga Meditation",
  "url": `${DOMAIN}/rajyog-meditation`,
  "description": "Guided audio meditations for spiritual growth, peace, and self-awareness",
  "publisher": {
    "@type": "Organization",
    "name": "Brahma Kumaris"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${DOMAIN}/rajyog-meditation/explore?search={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
});

// Meditation (AudioObject) Schema
export const getMeditationSchema = (meditation, teacherName = '') => {
  const title = meditation.attributes?.Title || 'Guided Meditation';
  const description = meditation.attributes?.BenefitsShort?.[0]?.children?.[0]?.text || 'Guided meditation for spiritual growth';
  const duration = meditation.attributes?.Duration || '5';
  const audioUrl = meditation.attributes?.Media?.data?.attributes?.url;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    "name": title,
    "description": description,
    "url": `${DOMAIN}/rajyog-meditation/meditations/${meditation.attributes?.Slug}`,
    "duration": `PT${duration}M`,
    "creator": {
      "@type": "Person",
      "name": teacherName || "Brahma Kumaris Teacher"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Brahma Kumaris"
    },
    "inLanguage": "en",
    "genre": "Meditation",
    "keywords": "meditation, spirituality, rajyoga, guided meditation, inner peace"
  };

  if (audioUrl) {
    schema.contentUrl = audioUrl;
    schema.encodingFormat = "audio/mpeg";
  }

  return schema;
};

// Person (Teacher) Schema
export const getTeacherSchema = (teacher) => {
  const name = teacher.attributes?.Name || 'Brahma Kumaris Teacher';
  const designation = teacher.attributes?.Designation || 'Meditation Teacher';
  const bio = teacher.attributes?.ShortIntro || teacher.attributes?.BigIntro;
  
  let description = '';
  if (typeof bio === 'string') {
    description = bio;
  } else if (Array.isArray(bio) && bio.length > 0) {
    description = bio[0]?.children?.[0]?.text || '';
  }

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "jobTitle": designation,
    "description": description,
    "url": `${DOMAIN}/rajyog-meditation/teacher/${teacher.attributes?.Slug}`,
    "worksFor": {
      "@type": "Organization",
      "name": "Brahma Kumaris"
    },
    "knowsAbout": ["Meditation", "Spirituality", "Rajyoga", "Mindfulness"],
    "alumniOf": {
      "@type": "Organization",
      "name": "Brahma Kumaris"
    }
  };
};

// ItemList Schema for collections
export const getItemListSchema = (items, listType = 'meditations') => {
  const itemListElement = items.map((item, index) => {
    if (listType === 'meditations') {
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "AudioObject",
          "name": item.attributes?.Title || 'Guided Meditation',
          "url": `${DOMAIN}/rajyog-meditation/meditations/${item.attributes?.Slug}`
        }
      };
    } else if (listType === 'teachers') {
      return {
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Person",
          "name": item.attributes?.Name || 'Teacher',
          "url": `${DOMAIN}/rajyog-meditation/teacher/${item.attributes?.Slug}`
        }
      };
    }
    return null;
  }).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": itemListElement,
    "numberOfItems": items.length
  };
};

// Course/Category Schema
export const getCategorySchema = (category, ageGroup) => {
  const categoryName = category.attributes?.CategoryDisplay || category.attributes?.Category;
  const description = category.attributes?.ShortIntro?.[0]?.children?.[0]?.text || '';
  
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": `${categoryName} Meditation for ${ageGroup.attributes?.name}`,
    "description": description,
    "url": `${DOMAIN}/rajyog-meditation/${ageGroup.attributes?.slug}/${category.attributes?.slug}`,
    "provider": {
      "@type": "Organization",
      "name": "Brahma Kumaris"
    },
    "courseMode": "online",
    "isAccessibleForFree": true,
    "inLanguage": "en",
    "teaches": `${categoryName} meditation techniques and spiritual practices`
  };
};

// Breadcrumb Schema
export const getBreadcrumbSchema = (breadcrumbs) => {
  const itemListElement = breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": itemListElement
  };
};

// FAQ Schema
export const getFAQSchema = (faqs) => {
  const mainEntity = faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }));

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": mainEntity
  };
}; 