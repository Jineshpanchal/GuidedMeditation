// SEO Testing Utility for Local Development (Browser-only)

// Generate SEO report
export const generateSEOReport = (seoData) => {
  const issues = [];
  const suggestions = [];
  
  // Title checks
  if (!seoData.title) {
    issues.push('Missing page title');
  } else if (seoData.title.length > 60) {
    suggestions.push(`Title too long (${seoData.title.length} chars). Recommended: 50-60 chars`);
  } else if (seoData.title.length < 30) {
    suggestions.push(`Title too short (${seoData.title.length} chars). Recommended: 30-60 chars`);
  }
  
  // Description checks
  if (!seoData.meta.description) {
    issues.push('Missing meta description');
  } else if (seoData.meta.description.length > 160) {
    suggestions.push(`Description too long (${seoData.meta.description.length} chars). Recommended: 120-160 chars`);
  } else if (seoData.meta.description.length < 120) {
    suggestions.push(`Description could be longer (${seoData.meta.description.length} chars). Recommended: 120-160 chars`);
  }
  
  // Open Graph checks
  const requiredOG = ['og:title', 'og:description', 'og:image', 'og:url'];
  requiredOG.forEach(prop => {
    if (!seoData.openGraph[prop]) {
      issues.push(`Missing ${prop}`);
    }
  });
  
  // Twitter Card checks
  if (!seoData.twitter['twitter:card'] && !seoData.meta['twitter:card']) {
    suggestions.push('Consider adding Twitter Card type');
  }
  
  // Canonical URL check
  if (!seoData.links.canonical) {
    suggestions.push('Consider adding canonical URL');
  }
  
  // Keywords check
  if (!seoData.meta.keywords) {
    suggestions.push('Consider adding meta keywords');
  }
  
  // Structured data check
  if (seoData.structuredData.length === 0) {
    suggestions.push('Consider adding structured data (JSON-LD)');
  }
  
  return {
    score: Math.max(0, 100 - (issues.length * 10) - (suggestions.length * 5)),
    issues,
    suggestions
  };
};

// Console log SEO data in a readable format
export const logSEOData = (seoData) => {
  console.group('🔍 SEO Analysis');
  
  console.group('📝 Basic Meta Tags');
  console.log('Title:', seoData.title);
  console.log('Description:', seoData.meta.description || 'Not set');
  console.log('Keywords:', seoData.meta.keywords || 'Not set');
  console.groupEnd();
  
  console.group('📱 Open Graph');
  Object.entries(seoData.openGraph).forEach(([key, value]) => {
    console.log(key, ':', value);
  });
  console.groupEnd();
  
  console.group('🐦 Twitter Cards');
  Object.entries(seoData.twitter).forEach(([key, value]) => {
    console.log(key, ':', value);
  });
  console.groupEnd();
  
  console.group('🔗 Links');
  Object.entries(seoData.links).forEach(([rel, hrefs]) => {
    console.log(rel, ':', hrefs);
  });
  console.groupEnd();
  
  if (seoData.structuredData.length > 0) {
    console.group('📊 Structured Data');
    seoData.structuredData.forEach((data, index) => {
      console.log(`Schema ${index + 1}:`, data['@type']);
      console.log(data);
    });
    console.groupEnd();
  }
  
  const report = generateSEOReport(seoData);
  console.group(`📈 SEO Score: ${report.score}/100`);
  if (report.issues.length > 0) {
    console.group('❌ Issues');
    report.issues.forEach(issue => console.log('•', issue));
    console.groupEnd();
  }
  if (report.suggestions.length > 0) {
    console.group('💡 Suggestions');
    report.suggestions.forEach(suggestion => console.log('•', suggestion));
    console.groupEnd();
  }
  console.groupEnd();
  
  console.groupEnd();
};

// Browser-compatible version for client-side use
export const extractPageSEOClient = () => {
  if (typeof window === 'undefined') return null;
  
  const seoData = {
    title: document.title || '',
    meta: {},
    openGraph: {},
    twitter: {},
    structuredData: [],
    links: {}
  };
  
  // Extract meta tags
  const metaTags = document.querySelectorAll('meta');
  metaTags.forEach(tag => {
    const name = tag.getAttribute('name');
    const property = tag.getAttribute('property');
    const content = tag.getAttribute('content');
    
    if (name) {
      seoData.meta[name] = content;
    }
    
    if (property) {
      if (property.startsWith('og:')) {
        seoData.openGraph[property] = content;
      } else if (property.startsWith('twitter:')) {
        seoData.twitter[property] = content;
      }
    }
    
    if (name && name.startsWith('twitter:')) {
      seoData.twitter[name] = content;
    }
  });
  
  // Extract links
  const linkTags = document.querySelectorAll('link');
  linkTags.forEach(link => {
    const rel = link.getAttribute('rel');
    const href = link.getAttribute('href');
    
    if (rel && href) {
      if (!seoData.links[rel]) {
        seoData.links[rel] = [];
      }
      seoData.links[rel].push(href);
    }
  });
  
  // Extract structured data
  const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
  scriptTags.forEach(script => {
    try {
      const data = JSON.parse(script.textContent);
      seoData.structuredData.push(data);
    } catch (e) {
      console.warn('Invalid JSON-LD:', e);
    }
  });
  
  return seoData;
}; 