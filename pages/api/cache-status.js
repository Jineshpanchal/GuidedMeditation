import { getStats, clear } from '../../lib/cache';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Get cache statistics
      const stats = getStats();
      
      res.status(200).json({
        success: true,
        cache: {
          ...stats,
          hitRate: stats.hits > 0 ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(2) + '%' : '0%',
          totalRequests: stats.hits + stats.misses
        },
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB'
        }
      });
    } else if (req.method === 'DELETE') {
      // Clear cache
      clear();
      
      res.status(200).json({
        success: true,
        message: 'Cache cleared successfully',
        timestamp: new Date().toISOString()
      });
    } else {
      res.setHeader('Allow', ['GET', 'DELETE']);
      res.status(405).json({
        success: false,
        error: 'Method not allowed'
      });
    }
  } catch (error) {
    console.error('Cache status API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
} 