import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '../../contexts/AudioPlayerContext';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const { currentMeditation } = useAudioPlayer();
  const hasActivePlayer = Boolean(currentMeditation);

  // Show button when page is scrolled up to given distance
  const toggleVisibility = () => {
    const scrolled = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrolled > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      toggleVisibility();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Smooth scroll to top
  const scrollToTop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsScrolling(true);
    
    // Try multiple methods for better browser compatibility
    if (window.scrollTo) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
    
    // Reset scrolling state after animation
    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed z-50 transition-all duration-300 ease-in-out opacity-100 translate-y-0 ${
        hasActivePlayer 
          ? 'right-6 bottom-32 md:bottom-28' // Adjust for player height
          : 'right-6 bottom-8'
      } w-12 h-12 bg-gradient-to-br from-spiritual-dark to-spiritual-purple hover:from-spiritual-purple hover:to-spiritual-dark shadow-lg hover:shadow-xl rounded-full flex items-center justify-center group transform hover:scale-110 active:scale-95 cursor-pointer`}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full pointer-events-none"></div>
      
      {/* Icon */}
      <div className="relative pointer-events-none">
        <svg 
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            isScrolling ? 'animate-bounce' : 'group-hover:-translate-y-0.5'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </div>
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-active:scale-100 transition-transform duration-200 pointer-events-none"></div>
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-spiritual-light/30 to-spiritual-accent/30 blur-md scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </button>
  );
};

export default ScrollToTop; 