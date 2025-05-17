import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-transparent">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <Link href="/rajyog-meditation" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-spiritual-light flex items-center justify-center">
              <span className="text-spiritual-dark font-bold">BK</span>
            </div>
            <span className="font-display font-semibold text-gray-800">Brahma Kumaris</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Desktop Menu */}
          <nav className="hidden md:flex md:items-center md:space-x-8">
            <Link 
              href="/rajyog-meditation" 
              className={`text-sm font-medium ${router.pathname === '/rajyog-meditation' ? 'text-spiritual-dark' : 'text-gray-600 hover:text-spiritual-dark'}`}
            >
              Home
            </Link>
            <Link 
              href="/rajyog-meditation/explore" 
              className={`text-sm font-medium ${router.pathname.includes('/rajyog-meditation/explore') ? 'text-spiritual-dark' : 'text-gray-600 hover:text-spiritual-dark'}`}
            >
              Explore
            </Link>
            <Link 
              href="#" 
              className="text-sm font-medium text-gray-600 hover:text-spiritual-dark"
            >
              About Raja Yoga
            </Link>
            <Link 
              href="/rajyog-meditation/teacher" 
              className={`text-sm font-medium ${router.pathname.includes('/rajyog-meditation/teacher') ? 'text-spiritual-dark' : 'text-gray-600 hover:text-spiritual-dark'}`}
            >
              Teachers
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t mt-4">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/rajyog-meditation" 
                  className={`block text-sm font-medium ${router.pathname === '/rajyog-meditation' ? 'text-spiritual-dark' : 'text-gray-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/rajyog-meditation/explore" 
                  className={`block text-sm font-medium ${router.pathname.includes('/rajyog-meditation/explore') ? 'text-spiritual-dark' : 'text-gray-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </Link>
              </li>
              <li>
                <Link 
                  href="#" 
                  className="block text-sm font-medium text-gray-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Raja Yoga
                </Link>
              </li>
              <li>
                <Link 
                  href="/rajyog-meditation/teacher" 
                  className={`block text-sm font-medium ${router.pathname.includes('/rajyog-meditation/teacher') ? 'text-spiritual-dark' : 'text-gray-600'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Teachers
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header; 