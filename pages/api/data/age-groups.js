import { getAgeGroups } from '../../../lib/api/strapi-optimized';
import { cacheWrapper, generateCacheKey } from '../../../lib/cache';

export default async function handler(req, res) {
  // Set cache headers for client-side caching
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  
  try {
    const { preset = 'withImage' } = req.query;
    
    const cacheKey = generateCacheKey('api-age-groups', { preset });
    
    const ageGroups = await cacheWrapper(cacheKey, async () => {
      return await getAgeGroups(preset);
    }, 1800); // 30 minutes cache
    
    res.status(200).json({
      success: true,
      data: ageGroups,
      timestamp: new Date().toISOString(),
      cached: true
    });
  } catch (error) {
    console.error('API Error - Age Groups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch age groups',
      message: error.message
    });
  }
} 