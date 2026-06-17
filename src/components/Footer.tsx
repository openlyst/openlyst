'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="glass text-white mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/favicon.svg" alt="OpenLyst" className="w-8 h-8" />
              <span className="text-xl font-bold">OpenLyst</span>
            </div>
            <p className="text-gray-300 max-w-md">{t.footer.description}</p>
            <div className="mt-4 flex space-x-4 items-center">
              <a
                href="https://gitlab.com/Openlyst"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">GitLab</span>
                <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
                  <path d="m23.6004 9.5927-.0337-.0862L20.3.981a.851.851 0 0 0-.3362-.405.874.874 0 0 0-.9997.0539.874.874 0 0 0-.29.4112l-2.2055 6.748H7.5375l-2.2057-6.748a.8573.8573 0 0 0-.29-.4112.874.874 0 0 0-.9997-.0539.8585.8585 0 0 0-.3362.405l-3.2665 8.5252-.0329.0862a6.0657 6.0657 0 0 0 2.0119 7.0105l.0113.0087.0275.0207a6.0657 6.0657 0 0 0 3.6931 1.2543h13.575a6.0657 6.0657 0 0 0 3.6931-1.2543l.0275-.0207.0113-.0087a6.0662 6.0662 0 0 0 2.0104-7.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t.footer.applications}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/apps/doudou" className="text-gray-300 hover:text-white transition-colors">
                  DouDou
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              {t.footer.community}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://gitlab.com/Openlyst/"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t.nav.gitlab}
                </a>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href="/docs/api" className="text-gray-300 hover:text-white transition-colors">
                  {t.footer.documentation}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">{t.footer.copyright}</p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">{t.footer.powerToThePeople}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
