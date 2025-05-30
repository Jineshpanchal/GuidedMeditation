import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* Spacer above footer */}
      <div className="h-16 md:h-24"></div>
      
      <footer className="relative overflow-hidden">
        {/* Gradient blend at top */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50"></div>
        
        {/* Main Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-purple-50 to-rose-50"></div>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 bg-[url('/patterns/sacred-yantra.svg')] opacity-5 bg-repeat bg-[length:400px_400px] rotate-12"></div>
        <div className="absolute top-1/4 right-[15%] w-96 h-96 rounded-full bg-gradient-to-br from-spiritual-light/20 to-spiritual-accent/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-[10%] w-72 h-72 rounded-full bg-gradient-to-tr from-spiritual-purple/15 to-rose-200/15 blur-2xl"></div>
        <div className="absolute top-1/3 left-[30%] w-48 h-48 rounded-full bg-gradient-radial from-spiritual-accent/10 to-transparent blur-xl"></div>
        
        {/* Content Container */}
        <div className="container-custom relative z-10 pt-24 pb-12">
          {/* Main Sections Grid - 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Section - More space now */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-spiritual-dark to-spiritual-purple shadow-xl flex items-center justify-center p-3">
                  <Image 
                    src="/BK Logo-384x384.png"
                    alt="Brahma Kumaris Logo"
                    width={36}
                    height={36}
                    className="object-contain filter brightness-0 invert"
                  />
                </div>
                <div>
                  <div className="font-medium text-2xl text-gray-900 whitespace-nowrap" style={{ fontFamily: 'Cinzel, serif', fontWeight: '400' }}>
                    Brahma Kumaris
                  </div>
                  <div className="text-base font-medium text-spiritual-purple">
                    Rajyoga Meditation
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                Transforming lives through Rajyoga meditation and spiritual wisdom.
              </p>
              
              <div className="flex items-center space-x-4">
                <a 
                  href="https://www.facebook.com/brahmakumaris/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-spiritual-dark to-spiritual-purple shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a 
                  href="https://x.com/brahmakumaris" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-spiritual-dark to-spiritual-purple shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/brahmakumaris/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-spiritual-dark to-spiritual-purple shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.youtube.com/brahmakumaris" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-spiritual-dark to-spiritual-purple shadow-lg flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-300 group"
                >
                  <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-display font-bold text-gray-900">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/rajyog-meditation" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Home</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/rajyog-meditation/explore" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Explore Meditations</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/rajyog-meditation/liked" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Liked Meditations</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>About Rajyoga</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/rajyog-meditation/teacher" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Teachers</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Age Groups */}
            <div className="space-y-6">
              <h4 className="text-xl font-display font-bold text-gray-900">Age Groups</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/rajyog-meditation/emerging-adulthood" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Emerging Adulthood (12-24)</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/rajyog-meditation/young-adulthood" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Young Adulthood (25-35)</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/rajyog-meditation/mid-life" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Mid life (36-50)</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link href="/rajyog-meditation/beyond-50" className="text-gray-700 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group">
                    <span>Beyond 50</span>
                    <svg className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div className="space-y-6">
              <h4 className="text-xl font-display font-bold text-gray-900">Contact</h4>
              <address className="not-italic text-gray-700 space-y-3 leading-relaxed">
                <p>Brahma Kumaris World Spiritual University</p>
                <p>Global Headquarters</p>
                <p>Mount Abu, Rajasthan, India</p>
                <p>
                  <a 
                    href="mailto:contact@brahmakumaris.com" 
                    className="inline-flex items-center space-x-2 text-spiritual-purple hover:text-spiritual-dark transition-all duration-300 group font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@brahmakumaris.com</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </p>
              </address>
            </div>
          </div>
          
          {/* Learn Section - Separate Row */}
          <div className="mt-12 pt-8 border-t border-gray-200/60">
            <div className="max-w-md">
              <h4 className="text-xl font-display font-bold text-gray-900 mb-6">Learn</h4>
              <a 
                href="https://www.brahmakumaris.com/centers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-start space-x-4 text-gray-700 hover:text-spiritual-purple transition-all duration-300 group p-4 rounded-2xl hover:bg-gradient-to-r hover:from-spiritual-light/10 hover:to-spiritual-accent/10"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-spiritual-purple/10 flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4 text-spiritual-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-lg">Visit Nearest Center</div>
                  <div className="text-sm mt-1 leading-relaxed">Learn Rajyoga Meditation by visiting your nearest meditation center</div>
                  <div className="inline-flex items-center mt-3 text-sm text-spiritual-purple group-hover:translate-x-1 transition-transform duration-300 font-medium">
                    <span>Find Centers</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-600">
                &copy; {formattedDate} Brahma Kumaris. All rights reserved.
              </p>
              <div className="flex items-center space-x-8">
                <a 
                  href="https://www.brahmakumaris.com/privacy-policy/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group"
                >
                  <span>Privacy Policy</span>
                  <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a 
                  href="https://www.brahmakumaris.com/terms-and-conditions/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-spiritual-purple transition-all duration-300 hover:translate-x-1 inline-flex items-center group"
                >
                  <span>Terms of Service</span>
                  <svg className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer; 