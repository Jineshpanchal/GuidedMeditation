import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the data context
const DataContext = createContext();

// Simple in-memory cache for client-side
const cache = new Map();
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute - reduced for fresher data

// Simple fetcher function
const fetcher = async (url) => {
  const cacheKey = url;
  const cached = cache.get(cacheKey);
  
  // Check if we have valid cached data
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`✅ Cache hit: ${url}`);
    return cached.data;
  }
  
  console.log(`❌ Cache miss: ${url}, fetching...`);
  
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    const data = await res.json();
    
    // Cache the result
    cache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Custom hook for data fetching with simple caching
const useSimpleFetch = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    setLoading(true);
    setError(null);

    fetcher(url)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setError(err);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url, ...dependencies]);

  return { data, loading, error };
};

// Custom hooks for different data types
export const useAgeGroups = () => {
  return useSimpleFetch('/api/data/age-groups');
};

export const useTeachers = () => {
  return useSimpleFetch('/api/data/teachers');
};

export const useMeditations = (filters = {}) => {
  const queryString = Object.keys(filters).length > 0 
    ? `?${new URLSearchParams(filters).toString()}`
    : '';
  const url = `/api/data/meditations${queryString}`;
  
  return useSimpleFetch(url, [JSON.stringify(filters)]);
};

export const useTeacher = (slug) => {
  const url = slug ? `/api/data/teacher/${slug}` : null;
  return useSimpleFetch(url, [slug]);
};

export const useMeditation = (slug) => {
  const url = slug ? `/api/data/meditation/${slug}` : null;
  return useSimpleFetch(url, [slug]);
};

export const useAgeGroup = (slug) => {
  const url = slug ? `/api/data/age-group/${slug}` : null;
  return useSimpleFetch(url, [slug]);
};

// Search hook with simple debouncing
export const useSearch = (query, type = 'meditations') => {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const url = debouncedQuery 
    ? `/api/search/${type}?q=${encodeURIComponent(debouncedQuery)}`
    : null;
    
  return useSimpleFetch(url, [debouncedQuery, type]);
};

// Clear cache function
export const clearCache = () => {
  cache.clear();
  console.log('🗑️ Cache cleared');
};

// Get cache stats
export const getCacheStats = () => {
  const now = Date.now();
  let validEntries = 0;
  let expiredEntries = 0;
  
  cache.forEach((value) => {
    if (now - value.timestamp < CACHE_DURATION) {
      validEntries++;
    } else {
      expiredEntries++;
    }
  });
  
  return {
    total: cache.size,
    valid: validEntries,
    expired: expiredEntries
  };
};

// Data provider component
export const DataProvider = ({ children }) => {
  const contextValue = {
    // Expose hooks for easy access
    useAgeGroups,
    useTeachers,
    useMeditations,
    useTeacher,
    useMeditation,
    useAgeGroup,
    useSearch,
    clearCache,
    getCacheStats,
  };

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext; 