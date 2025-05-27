import { getMeditations, getTeachers } from '../../../lib/api/strapi-optimized';
import { cacheWrapper, generateCacheKey } from '../../../lib/cache';

export default async function handler(req, res) {
  // Set cache headers for client-side caching
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  
  try {
    const { type, q: query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }
    
    const cacheKey = generateCacheKey('api-search', { type, query: query.toLowerCase() });
    
    const results = await cacheWrapper(cacheKey, async () => {
      switch (type) {
        case 'meditations':
          return await searchMeditations(query);
        case 'teachers':
          return await searchTeachers(query);
        default:
          throw new Error('Invalid search type');
      }
    }, 300); // 5 minutes cache for search results
    
    res.status(200).json({
      success: true,
      data: results,
      query,
      type,
      count: results.length,
      timestamp: new Date().toISOString(),
      cached: true
    });
  } catch (error) {
    console.error('API Error - Search:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
}

async function searchMeditations(query) {
  // Get all meditations and filter client-side for better performance
  const allMeditations = await getMeditations('card', {
    'pagination[limit]': 200
  });
  
  const searchTerm = query.toLowerCase();
  
  return allMeditations.filter(meditation => {
    const title = meditation.attributes.Title?.toLowerCase() || '';
    const displayTitle = meditation.attributes.DisplayTitle?.toLowerCase() || '';
    const teacherName = meditation.attributes.gm_rajyoga_teachers?.data?.[0]?.attributes?.Name?.toLowerCase() || '';
    
    return title.includes(searchTerm) || 
           displayTitle.includes(searchTerm) || 
           teacherName.includes(searchTerm);
  });
}

async function searchTeachers(query) {
  // Get all teachers and filter client-side
  const allTeachers = await getTeachers('card', {
    'pagination[limit]': 100
  });
  
  const searchTerm = query.toLowerCase();
  
  return allTeachers.filter(teacher => {
    const name = teacher.attributes.Name?.toLowerCase() || '';
    const designation = teacher.attributes.Designation?.toLowerCase() || '';
    const shortIntro = teacher.attributes.ShortIntro?.toLowerCase() || '';
    
    return name.includes(searchTerm) || 
           designation.includes(searchTerm) || 
           shortIntro.includes(searchTerm);
  });
} 