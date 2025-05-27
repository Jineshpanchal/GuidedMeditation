import { clear } from '../../lib/cache';

export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== 'revalidate-secret-key') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // Clear in-memory cache
    clear();
    console.log('✅ In-memory cache cleared');

    // Revalidate specific paths if provided
    if (req.query.path) {
      await res.revalidate(req.query.path);
      console.log(`✅ Revalidated path: ${req.query.path}`);
      return res.json({ revalidated: true, path: req.query.path });
    }

    // Revalidate common paths
    const pathsToRevalidate = [
      '/rajyog-meditation',
      '/rajyog-meditation/explore',
      '/rajyog-meditation/meditations/rising-above'
    ];

    for (const path of pathsToRevalidate) {
      try {
        await res.revalidate(path);
        console.log(`✅ Revalidated: ${path}`);
      } catch (err) {
        console.error(`❌ Failed to revalidate ${path}:`, err);
      }
    }

    return res.json({ 
      revalidated: true, 
      message: 'Cache cleared and paths revalidated',
      paths: pathsToRevalidate 
    });
  } catch (err) {
    console.error('Revalidation error:', err);
    return res.status(500).json({ message: 'Error revalidating', error: err.message });
  }
} 