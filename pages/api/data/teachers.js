import { getTeachersPageData } from '../../../lib/api/strapi-optimized';
import { cacheWrapper, generateCacheKey } from '../../../lib/cache';

export default async function handler(req, res) {
  // Set cache headers for client-side caching
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  
  try {
    const cacheKey = generateCacheKey('api-teachers-page-data', {});
    
    const data = await cacheWrapper(cacheKey, async () => {
      return await getTeachersPageData();
    }, 1800); // 30 minutes cache
    
    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      cached: true
    });
  } catch (error) {
    console.error('API Error - Teachers:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch teachers',
      message: error.message
    });
  }
} 