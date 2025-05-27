import { getMeditationPageData } from '../../../../lib/api/strapi-optimized';
import { cacheWrapper, generateCacheKey } from '../../../../lib/cache';

export default async function handler(req, res) {
  // Set cache headers for client-side caching
  res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
  
  try {
    const { slug } = req.query;
    
    if (!slug) {
      return res.status(400).json({
        success: false,
        error: 'Meditation slug is required'
      });
    }
    
    const cacheKey = generateCacheKey('api-meditation-page-data', { slug });
    
    const data = await cacheWrapper(cacheKey, async () => {
      return await getMeditationPageData(slug);
    }, 1800); // 30 minutes cache
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Meditation not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      cached: true
    });
  } catch (error) {
    console.error('API Error - Meditation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch meditation',
      message: error.message
    });
  }
} 