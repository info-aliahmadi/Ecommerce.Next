'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Providers } from './providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  return (
    <Providers>
      <header className="sticky top-0 z-50 bg-blue-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Desktop */}
            <Link 
              href="/" 
              className="hidden md:flex text-white text-xl font-bold no-underline hover:opacity-90 transition-opacity"
            >
              E-COMMERCE
            </Link>

            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link 
                href="/" 
                className="ml-4 text-white text-xl font-bold no-underline hover:opacity-90 transition-opacity"
              >
                E-COMMERCE
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 ml-8 space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`px-4 py-2 text-white rounded-md hover:bg-blue-700 transition-colors ${
                    pathname === item.path ? 'border-b-2 border-white' : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
              <Link
                href="/cart"
                className="relative p-2 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="Shopping cart"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/login"
                className="p-2 text-white rounded-full hover:bg-blue-700 transition-colors"
                aria-label="User account"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={toggleMobileMenu}
            />
            
            {/* Drawer */}
            <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300">
              <div className="p-4">
                <button
                  onClick={toggleMobileMenu}
                  className="mb-4 p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.path}
                      onClick={toggleMobileMenu}
                      className="block px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                <hr className="my-4 border-gray-200" />

                <div className="space-y-1">
                  <Link
                    href="/login"
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={toggleMobileMenu}
                    className="block px-4 py-3 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <main>
        {children}
      </main>
    </Providers>
  );
}
