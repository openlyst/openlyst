import type { Metadata } from 'next';
import { Space_Grotesk } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LayoutClient } from '@/components/LayoutClient';

export const dynamic = 'force-dynamic';

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700'],
});

export const metadata: Metadata = {
  title: { default: 'OpenLyst - Free & Open Source Applications', template: '%s - OpenLyst' },
  description:
    'We build free and open-source software that puts users first. Keep control of your own tools and data.',
  metadataBase: new URL('https://openlyst.ink'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-darkreader-lock>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={displayFont.variable}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var RELOAD_KEY = 'openlyst-asset-reload-ts';
  var RELOAD_WINDOW_MS = 15000;
  function reloadOnce() {
    try {
      var now = Date.now();
      var last = Number(sessionStorage.getItem(RELOAD_KEY) || '0');
      if (now - last < RELOAD_WINDOW_MS) return;
      sessionStorage.setItem(RELOAD_KEY, String(now));
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  }
  window.addEventListener('error', function(e) {
    var target = e.target;
    if (target && target instanceof HTMLElement) {
      var tag = target.tagName;
      if (tag === 'LINK' || tag === 'SCRIPT') reloadOnce();
    }
  }, true);
})();
`,
          }}
        />
        <LanguageProvider>
          <LayoutClient>
            <div className="min-h-screen flex flex-col bg-transparent">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </LayoutClient>
        </LanguageProvider>
      </body>
    </html>
  );
}
