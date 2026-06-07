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
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-xl font-bold">OpenLyst</span>
            </div>
            <p className="text-gray-300 max-w-md">{t.footer.description}</p>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://gitlab.com/Openlyst"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <span className="sr-only">GitLab</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
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
