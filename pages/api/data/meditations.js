import { getExplorePageData, getMeditations } from '../../../lib/api/strapi-optimized';
import { cacheWrapper, generateCacheKey } from '../../../lib/cache';

export default async function handler(req, res) {
  // Set cache headers for client-side caching
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');
  
  try {
    const { 
      preset = 'card',
      trending,
      category,
      teacher,
      limit = 100,
      ...otherFilters 
    } = req.query;
    
    // Build filters object
    const filters = { ...otherFilters };
    if (trending === 'true') filters['filters[Trending][$eq]'] = true;
    if (category) filters['filters[gm_categories][slug][$eq]'] = category;
    if (teacher) filters['filters[gm_rajyoga_teachers][slug][$eq]'] = teacher;
    if (limit) filters['pagination[limit]'] = parseInt(limit);
    
    const cacheKey = generateCacheKey('api-meditations', { preset, ...filters });
    
    const meditations = await cacheWrapper(cacheKey, async () => {
      if (Object.keys(filters).length === 0 && preset === 'card') {
        // Use explore page data for default request
        const data = await getExplorePageData();
        return data.meditations;
      } else {
        // Use filtered request
        return await getMeditations(preset, filters);
      }
    }, 600); // 10 minutes cache
    
    res.status(200).json({
      success: true,
      data: meditations,
      count: meditations.length,
      timestamp: new Date().toISOString(),
      cached: true
    });
  } catch (error) {
    console.error('API Error - Meditations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meditations',
      message: error.message
    });
  }
} 