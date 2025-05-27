import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'spiritual-dark', 
  text = 'Loading...', 
  showText = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="relative">
        <div 
          className={`animate-spin rounded-full border-2 border-gray-200 border-t-${color} ${sizeClasses[size]}`}
        />
        <div 
          className={`absolute inset-0 animate-ping rounded-full border border-${color} opacity-20 ${sizeClasses[size]}`}
        />
      </div>
      {showText && (
        <p className={`text-gray-600 font-medium ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Skeleton loading components
export const SkeletonCard = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
    <div className="aspect-w-16 aspect-h-9 bg-gray-300 rounded-t-lg" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-300 rounded w-1/2" />
      <div className="h-3 bg-gray-300 rounded w-2/3" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6, className = '' }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
);

export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div 
        key={index} 
        className={`h-4 bg-gray-300 rounded ${
          index === lines - 1 ? 'w-2/3' : 'w-full'
        }`} 
      />
    ))}
  </div>
);

export default LoadingSpinner; 