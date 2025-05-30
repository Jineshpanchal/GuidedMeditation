import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/rajyog-meditation', label: 'Home' },
    { href: '/rajyog-meditation/explore', label: 'Explore' },
    { href: '#', label: 'About Rajyoga' },
    { href: '/rajyog-meditation/teacher', label: 'Teachers' },
  ];

  const isActiveRoute = (href) => {
    if (href === '/rajyog-meditation') {
      return router.pathname === '/rajyog-meditation';
    }
    return router.pathname.includes(href) && href !== '#';
  };

  return (
    <>
      {/* Floating Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'py-2' 
          : 'py-4'
      }`}>
        <div className="container-custom">
          <div className={`relative transition-all duration-500 ease-out ${
            isScrolled
              ? 'bg-white/95 backdrop-blur-xl border border-white/30 shadow-lg shadow-black/5'
              : 'bg-black/20 backdrop-blur-md border border-white/20'
          } rounded-2xl px-6 py-4`}>
            
            <div className="relative flex items-center justify-between">
              {/* Logo */}
              <Link href="/rajyog-meditation" className="group flex items-center space-x-3">
                <div className="relative">
                  {/* BK Logo with white background */}
                  <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 p-2">
                    <Image 
                      src="/BK Logo-384x384.png"
                      alt="Brahma Kumaris Logo"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <div className="block">
                  <div className={`font-display font-bold text-sm sm:text-lg transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-900' 
                      : 'text-white drop-shadow-lg'
                  }`}>
                    Brahma Kumaris
                  </div>
                  <div className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
                    isScrolled 
                      ? 'text-gray-600' 
                      : 'text-white/90 drop-shadow-md'
                  }`}>
                    Rajyoga Meditation
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation - Clean Pills */}
              <nav className="hidden lg:flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                      isActiveRoute(item.href)
                        ? isScrolled
                          ? 'text-white bg-gradient-to-r from-spiritual-dark to-spiritual-purple shadow-lg'
                          : 'text-spiritual-dark bg-white/90 backdrop-blur-sm shadow-lg'
                        : isScrolled
                          ? 'text-gray-700 hover:text-spiritual-dark hover:bg-white/80'
                          : 'text-white/90 hover:text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                    </span>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-spiritual-light to-spiritual-accent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </Link>
                ))}
              </nav>

              {/* Mobile Menu Button - Properly Centered */}
              <button 
                className={`lg:hidden relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isScrolled
                    ? 'bg-white/90 backdrop-blur-sm border border-white/20 text-gray-700 hover:text-spiritual-dark'
                    : 'bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30'
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="relative w-5 h-5 flex items-center justify-center">
                  <span className={`absolute block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45' : '-translate-y-1.5'
                  }`} />
                  <span className={`absolute block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`} />
                  <span className={`absolute block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isMenuOpen ? '-rotate-45' : 'translate-y-1.5'
                  }`} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Improved Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        isMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
      }`}>
        {/* Backdrop - More Subtle */}
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Content */}
        <div className={`absolute top-24 left-4 right-4 transition-all duration-500 ${
          isMenuOpen 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-8 opacity-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            {/* Header with Logo */}
            <div className="bg-gradient-to-r from-spiritual-light/20 via-white/10 to-spiritual-accent/20 p-6 border-b border-gray-100/50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                  {/* Replace with your actual logo */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-spiritual-light to-spiritual-accent flex items-center justify-center">
                    <span className="text-spiritual-dark font-bold text-xs">BK</span>
                  </div>
                  {/* Uncomment when you have the logo:
                  <Image 
                    src="/images/brahma-kumaris-logo.png"
                    alt="Brahma Kumaris Logo"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  */}
                </div>
                <div>
                  <div className="font-display font-bold text-gray-900">Brahma Kumaris</div>
                  <div className="text-xs text-gray-600">Rajyoga Meditation</div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="p-6 space-y-2">
              {navItems.map((item, index) => (
                <Link 
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                    isActiveRoute(item.href)
                      ? 'bg-gradient-to-r from-spiritual-dark to-spiritual-purple text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-spiritual-light/20 hover:to-spiritual-accent/20'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    {item.href === '/rajyog-meditation' && (
                      <div className="text-xs opacity-70 mt-1">Meditation portal home</div>
                    )}
                    {item.href === '/rajyog-meditation/explore' && (
                      <div className="text-xs opacity-70 mt-1">Discover meditations</div>
                    )}
                    {item.href === '#' && (
                      <div className="text-xs opacity-70 mt-1">Learn about the practice</div>
                    )}
                    {item.href === '/rajyog-meditation/teacher' && (
                      <div className="text-xs opacity-70 mt-1">Meet our guides</div>
                    )}
                  </div>
                  <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isActiveRoute(item.href) ? 'bg-white' : 'bg-spiritual-accent opacity-0 group-hover:opacity-100'
                  }`} />
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>


    </>
  );
};

export default Header; 