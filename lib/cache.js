import NodeCache from 'node-cache';

// Simple in-memory cache with optimized settings
const cache = new NodeCache({ 
  stdTTL: 600, // 10 minutes default
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false, // Better performance
  deleteOnExpire: true,
  maxKeys: 1000 // Prevent memory leaks
});

// Cache key generator
const generateCacheKey = (prefix, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});
  
  const paramString = Object.keys(sortedParams).length > 0 
    ? JSON.stringify(sortedParams) 
    : '';
  
  return `${prefix}:${Buffer.from(paramString).toString('base64')}`;
};

// Get from cache
const get = (key) => {
  return cache.get(key);
};

// Set in cache
const set = (key, value, ttl = 600) => {
  return cache.set(key, value, ttl);
};

// Delete from cache
const del = (key) => {
  return cache.del(key);
};

// Clear all cache
const clear = () => {
  return cache.flushAll();
};

// Cache wrapper function for API calls
const cacheWrapper = async (cacheKey, fetchFunction, ttl = 600) => {
  try {
    // Try to get from cache first
    const cachedResult = get(cacheKey);
    if (cachedResult !== undefined) {
      console.log(`✅ Cache hit: ${cacheKey}`);
      return cachedResult;
    }

    console.log(`❌ Cache miss: ${cacheKey}, fetching...`);
    
    // If not in cache, fetch the data
    const result = await fetchFunction();
    
    // Store in cache
    set(cacheKey, result, ttl);
    
    return result;
  } catch (error) {
    console.error('Cache wrapper error:', error);
    // If caching fails, still try to fetch the data
    return await fetchFunction();
  }
};

// Cache statistics
const getStats = () => {
  const stats = cache.getStats();
  return {
    hits: stats.hits,
    misses: stats.misses,
    keys: stats.keys,
    ksize: stats.ksize,
    vsize: stats.vsize
  };
};

// Prefetch and warm cache for critical data
const warmCache = async (warmupFunctions = []) => {
  console.log('🔥 Warming up cache...');
  const promises = warmupFunctions.map(async ({ key, fn, ttl }) => {
    try {
      const result = await fn();
      set(key, result, ttl);
      console.log(`✅ Warmed cache: ${key}`);
    } catch (error) {
      console.error(`❌ Failed to warm cache: ${key}`, error);
    }
  });
  
  await Promise.allSettled(promises);
  console.log('🔥 Cache warmup complete');
};

export {
  get,
  set,
  del,
  clear,
  cacheWrapper,
  generateCacheKey,
  getStats,
  warmCache,
  cache
};

export default {
  get,
  set,
  del,
  clear,
  cacheWrapper,
  generateCacheKey,
  getStats,
  warmCache
}; 