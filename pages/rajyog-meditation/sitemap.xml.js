import { getAgeGroups, getCategories, getMeditations, getTeachers } from '../../lib/api/strapi-optimized';

const DOMAIN = 'https://www.brahmakumaris.com';

function generateSiteMap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map((page) => {
    return `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  })
  .join('')}
</urlset>`;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  try {
    console.log('Generating sitemap...');
    const startTime = Date.now();
    
    // Set the current date for lastmod
    const currentDate = new Date().toISOString();
    
    // Fetch all dynamic data
    const [ageGroups, categories, meditations, teachers] = await Promise.all([
      getAgeGroups('minimal'),
      getCategories('minimal'), 
      getMeditations('minimal'),
      getTeachers('minimal')
    ]);
    
    console.log(`Fetched data: ${ageGroups.length} age groups, ${categories.length} categories, ${meditations.length} meditations, ${teachers.length} teachers`);
    
    const pages = [];
    
    // Static pages
    pages.push({
      url: `${DOMAIN}/rajyog-meditation`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '1.0'
    });
    
    pages.push({
      url: `${DOMAIN}/rajyog-meditation/explore`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    });
    
    pages.push({
      url: `${DOMAIN}/rajyog-meditation/teacher`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    });
    
    pages.push({
      url: `${DOMAIN}/rajyog-meditation/liked`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.7'
    });
    
    // Age group pages
    ageGroups.forEach((ageGroup) => {
      if (ageGroup.attributes?.slug) {
        pages.push({
          url: `${DOMAIN}/rajyog-meditation/${ageGroup.attributes.slug}`,
          lastmod: currentDate,
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
    });
    
    // Category pages (age group + category combinations)
    ageGroups.forEach((ageGroup) => {
      if (ageGroup.attributes?.slug) {
        categories.forEach((category) => {
          if (category.attributes?.slug) {
            pages.push({
              url: `${DOMAIN}/rajyog-meditation/${ageGroup.attributes.slug}/${category.attributes.slug}`,
              lastmod: currentDate,
              changefreq: 'weekly',
              priority: '0.7'
            });
          }
        });
      }
    });
    
    // Meditation detail pages
    meditations.forEach((meditation) => {
      if (meditation.attributes?.Slug) {
        pages.push({
          url: `${DOMAIN}/rajyog-meditation/meditations/${meditation.attributes.Slug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.6'
        });
      }
    });
    
    // Teacher pages
    teachers.forEach((teacher) => {
      if (teacher.attributes?.Slug) {
        pages.push({
          url: `${DOMAIN}/rajyog-meditation/teacher/${teacher.attributes.Slug}`,
          lastmod: currentDate,
          changefreq: 'monthly',
          priority: '0.6'
        });
      }
    });
    
    // Generate the XML sitemap
    const sitemap = generateSiteMap(pages);
    
    console.log(`Generated sitemap with ${pages.length} URLs in ${Date.now() - startTime}ms`);
    
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600'); // Cache for 20 minutes
    res.write(sitemap);
    res.end();
    
    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return a basic sitemap in case of error
    const basicSitemap = generateSiteMap([
      {
        url: `${DOMAIN}/rajyog-meditation`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0'
      }
    ]);
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(basicSitemap);
    res.end();
    
    return {
      props: {},
    };
  }
}

export default SiteMap; 