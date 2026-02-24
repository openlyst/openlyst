'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage, LANGUAGE_FLAGS, LANGUAGE_NAMES, type SupportedLanguage } from '@/lib/contexts/LanguageContext';

const navigationKeys = ['home', 'news', 'apps', 'about', 'gitlab', 'support'] as const;
const navHrefs: Record<(typeof navigationKeys)[number], string> = {
  home: '/',
  news: '/news',
  apps: '/apps',
  about: '/about',
  gitlab: 'https://gitlab.com/Openlyst/',
  support: '/support',
};

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navigation = navigationKeys.map((key) => ({
    name: (t.nav as Record<string, string>)[key],
    href: navHrefs[key],
  }));

  return (
    <header className="glass-header text-white shadow-lg sticky top-0 z-50 will-change-transform">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="header-logo-link flex items-center space-x-2">
              <img src="/favicon.svg" alt="OpenLyst Logo" className="w-8 h-8" />
              <span className="text-xl font-bold">OpenLyst</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <div className="flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-purple-600/50 text-white'
                      : 'text-white hover:bg-white/10 hover:text-purple-300'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="relative ml-4">
              <button
                type="button"
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium bg-white/10 hover:bg-white/20 transition-colors"
              >
                <span>{LANGUAGE_FLAGS[language]}</span>
                <span className="hidden lg:inline">{LANGUAGE_NAMES[language]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 glass rounded-md shadow-lg ring-1 ring-white/10 z-50">
                  <div className="py-1">
                    {(['en', 'zh', 'ru'] as SupportedLanguage[]).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setLanguage(lang);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors ${
                          language === lang ? 'bg-purple-600/30' : ''
                        }`}
                      >
                        <span>{LANGUAGE_FLAGS[lang]}</span>
                        <span>{LANGUAGE_NAMES[lang]}</span>
                        {language === lang && (
                          <svg
                            className="w-4 h-4 ml-auto text-purple-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-red-800"
            >
              <span>{LANGUAGE_FLAGS[language]}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-purple-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-400"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {isLangMenuOpen && (
          <div className="md:hidden absolute right-4 mt-2 w-40 glass rounded-md shadow-lg ring-1 ring-white/10 z-50">
            <div className="py-1">
              {(['en', 'zh', 'ru'] as SupportedLanguage[]).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setLanguage(lang);
                    setIsLangMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors ${
                    language === lang ? 'bg-purple-600/30' : ''
                  }`}
                >
                  <span>{LANGUAGE_FLAGS[lang]}</span>
                  <span>{LANGUAGE_NAMES[lang]}</span>
                  {language === lang && (
                    <svg className="w-4 h-4 ml-auto text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-purple-600/50 text-white'
                      : 'text-white hover:bg-white/10 hover:text-purple-300'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
