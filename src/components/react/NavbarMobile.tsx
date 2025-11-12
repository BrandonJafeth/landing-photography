import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface NavLink {
  href: string;
  label: string;
}

interface NavbarMobileProps {
  navLinks: NavLink[];
  currentPath: string;
}

export default function NavbarMobile({ navLinks, currentPath }: NavbarMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);


  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);


  useEffect(() => {
    setIsOpen(false);
  }, [currentPath]);


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      localStorage.theme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      localStorage.theme = 'light';
      document.documentElement.classList.remove('dark');
    }
  };


  const menuContent = (
    <div
      className={`fixed inset-0 bg-[#000000] z-50 transition-all duration-500 ease-out ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Menú de navegación móvil"
    >
      {/* Header with Theme Toggle and Close Button */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-6 z-50">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center 
                     text-white hover:bg-white/10 transition-all duration-200 group"
          aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          type="button"
        >
          {isDark ? (
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
              />
            </svg>
          ) : (
            <svg 
              className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
              />
            </svg>
          )}
        </button>

        {/* Close Button */}
        <button
          onClick={closeMenu}
          className="w-12 h-12 flex items-center justify-center 
                     text-white hover:text-gray-300 transition-colors duration-300 group"
          aria-label="Cerrar menú"
          type="button"
        >
          <div className="relative w-8 h-8">
            <span 
              className="absolute top-1/2 left-0 w-full h-0.5 bg-current 
                         transform -translate-y-1/2 rotate-45 
                         transition-transform duration-300" 
            />
            <span 
              className="absolute top-1/2 left-0 w-full h-0.5 bg-current 
                         transform -translate-y-1/2 -rotate-45 
                         transition-transform duration-300" 
            />
          </div>
        </button>
      </div>

      {/* Gradient Background */}
      <div 
        className="absolute inset-0 opacity-90 bg-gradient-to-br from-gray-800 via-gray-900 to-black" 
        aria-hidden="true"
      />

      {/* Animated Grid Pattern */}
      <div 
        className={`absolute inset-0 opacity-10 menu-grid-pattern transition-transform duration-800 ease-out ${
          isOpen ? 'scale-100' : 'scale-80'
        }`}
        aria-hidden="true"
      />

      {/* Content Container */}
      <div className="relative h-full w-full flex flex-col items-center justify-center px-6">
        
        {/* Main Navigation */}
        <nav className="flex flex-col items-center space-y-2 mb-16">
          {navLinks.map((link, index) => {
            const isActive = currentPath === link.href;
            
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className={`text-4xl sm:text-5xl md:text-6xl font-bold
                          hover:scale-110 origin-center relative group
                          transition-all duration-300
                          menu-item-delay-${index}
                          ${isOpen ? 'menu-item-visible' : 'menu-item-hidden'}
                          ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                
                {/* Animated Underline */}
                <span 
                  className={`absolute -bottom-2 left-0 h-1 bg-white rounded-full
                            transition-all duration-300
                            ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div 
          className={`w-full max-w-md menu-cta-delay ${
            isOpen ? 'menu-cta-visible' : 'menu-cta-hidden'
          }`}
        >
          <a
            href="/contacto"
            onClick={closeMenu}
            className="block w-full px-8 py-4 bg-white text-black text-center
                       font-semibold rounded-full hover:bg-gray-100
                       transition-all duration-300 transform hover:scale-105
                       shadow-2xl shadow-white/20"
          >
            Contáctame
          </a>
        </div>

        {/* Social Links */}
        <div 
          className={`absolute bottom-8 left-0 right-0 flex justify-center gap-6 menu-social-delay ${
            isOpen ? 'menu-social-visible' : 'menu-social-hidden'
          }`}
        >
          <a 
            href="https://instagram.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <a 
            href="https://behance.net" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Behance"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14h-8.027c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988h-6.466v-14.967h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zm-3.466-8.988h3.584c2.508 0 2.906-3-.312-3h-3.272v3zm3.391 3h-3.391v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
          </a>

          <a 
            href="mailto:contact@gadea-iso.com" 
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Email"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="relative w-10 h-10 flex items-center justify-center 
                   dark:text-white text-[#000000] focus:outline-none focus-visible:ring-2 
                   focus-visible:ring-white rounded-lg"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isOpen ? true : false}
        type="button"
      >
        <div className="w-6 flex flex-col items-center justify-center gap-1.5">
          <span 
            className={`w-full h-0.5 bg-current transition-all duration-300 ease-out ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`} 
          />
          <span 
            className={`w-full h-0.5 bg-current transition-all duration-200 ${
              isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`} 
          />
          <span 
            className={`w-full h-0.5 bg-current transition-all duration-300 ease-out ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
            }`} 
          />
        </div>
      </button>

      {/* Portal del menú */}
      {mounted && typeof document !== 'undefined' && createPortal(menuContent, document.body)}
    </>
  );
}

