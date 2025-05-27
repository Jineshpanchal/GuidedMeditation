import React, { createContext, useContext } from 'react';
import useSWR from 'swr';

// Create the data context
const DataContext = createContext();

// Fetcher function for SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

// SWR configuration for optimal performance
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  refreshInterval: 0, // Disable automatic refresh
  dedupingInterval: 60000, // 1 minute deduping
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  loadingTimeout: 10000,
  focusThrottleInterval: 5000,
};

// Custom hooks for different data types
export const useAgeGroups = () => {
  return useSWR('/api/data/age-groups', fetcher, {
    ...swrConfig,
    refreshInterval: 30 * 60 * 1000, // 30 minutes for static data
  });
};

export const useTeachers = () => {
  return useSWR('/api/data/teachers', fetcher, {
    ...swrConfig,
    refreshInterval: 30 * 60 * 1000, // 30 minutes for static data
  });
};

export const useMeditations = (filters = {}) => {
  const key = Object.keys(filters).length > 0 
    ? `/api/data/meditations?${new URLSearchParams(filters).toString()}`
    : '/api/data/meditations';
    
  return useSWR(key, fetcher, {
    ...swrConfig,
    refreshInterval: 10 * 60 * 1000, // 10 minutes for dynamic data
  });
};

export const useTeacher = (slug) => {
  return useSWR(slug ? `/api/data/teacher/${slug}` : null, fetcher, {
    ...swrConfig,
    refreshInterval: 30 * 60 * 1000,
  });
};

export const useMeditation = (slug) => {
  return useSWR(slug ? `/api/data/meditation/${slug}` : null, fetcher, {
    ...swrConfig,
    refreshInterval: 30 * 60 * 1000,
  });
};

export const useAgeGroup = (slug) => {
  return useSWR(slug ? `/api/data/age-group/${slug}` : null, fetcher, {
    ...swrConfig,
    refreshInterval: 30 * 60 * 1000,
  });
};

// Search hook with debouncing
export const useSearch = (query, type = 'meditations') => {
  const debouncedQuery = useDebounce(query, 300);
  
  return useSWR(
    debouncedQuery ? `/api/search/${type}?q=${encodeURIComponent(debouncedQuery)}` : null,
    fetcher,
    {
      ...swrConfig,
      refreshInterval: 0, // No auto-refresh for search
      dedupingInterval: 30000, // 30 seconds deduping for search
    }
  );
};

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
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