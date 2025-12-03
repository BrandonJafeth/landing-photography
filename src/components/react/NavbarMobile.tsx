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
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center 
                     transition-all duration-200 group ${
                       isDark 
                         ? 'border-white/20 text-white hover:bg-white/10'
                         : 'border-black/20 text-black hover:bg-black/10'
                     }`}
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
          className={`w-12 h-12 flex items-center justify-center 
                     transition-colors duration-300 group ${
                       isDark 
                         ? 'text-white hover:text-gray-300'
                         : 'text-black hover:text-gray-700'
                     }`}
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
        className={`absolute inset-0 opacity-90 transition-colors duration-300 ${
          isDark 
            ? 'bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#000000]'
            : 'bg-gradient-to-br from-[#f5f5f5] via-[#e5e5e5] to-[#d4d4d4]'
        }`}
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
        <nav className="flex flex-col items-center space-y-8 mb-16">
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
                          ${isActive 
                            ? (isDark ? 'text-[#ffffff]' : 'text-[#000000]')
                            : (isDark ? 'text-[#ffffff]/60 hover:text-[#ffffff]' : 'text-[#000000]/70 hover:text-[#000000]')
                          }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                
                {/* Animated Underline */}
                <span 
                  className={`absolute -bottom-2 left-0 h-1 rounded-full
                            transition-all duration-300
                            ${isDark ? 'bg-[#ffffff]' : 'bg-[#000000]'}
                            ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  aria-hidden="true"
                />
              </a>
            );
          })}
        </nav>

        {/* Social Links */}
        <div 
          className={`absolute bottom-8 left-0 right-0 flex justify-center gap-6 menu-social-delay ${
            isOpen ? 'menu-social-visible' : 'menu-social-hidden'
          }`}
        >
          <a 
            href="https://www.instagram.com/joelgadea_/" 
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-200 ${
              isDark ? 'text-[#ffffff]/50 hover:text-[#ffffff]' : 'text-[#000000]/50 hover:text-[#000000]'
            }`}
            aria-label="Instagram"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>

          <a 
            href="https://www.facebook.com/profile.php?id=100073611974767&locale=es_LA" 
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors duration-200 ${
              isDark ? 'text-[#ffffff]/50 hover:text-[#ffffff]' : 'text-[#000000]/50 hover:text-[#000000]'
            }`}
            aria-label="Facebook"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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

