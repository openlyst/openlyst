'use client';

import { useState } from 'react';
import { Section } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const BASE_URL = 'https://openlyst.ink';

interface Endpoint {
  method: string;
  path: string;
  description: string;
}

const endpoints: Endpoint[] = [
  { method: 'GET', path: '/api/v1/repo', description: 'Get repository metadata and basic statistics.' },
  { method: 'GET', path: '/api/v1/apps', description: 'Get all apps with optional filtering.' },
  { method: 'GET', path: '/api/v1/apps/:slug', description: 'Get detailed information about a specific app.' },
  { method: 'GET', path: '/api/v1/apps/:slug/versions', description: 'Get all versions of a specific app.' },
  { method: 'GET', path: '/api/v1/apps/:slug/latest', description: 'Get the latest version of a specific app.' },
  { method: 'GET', path: '/api/v1/news', description: 'Get news and announcements.' },
  { method: 'GET', path: '/api/v1/search', description: 'Search for apps by name, description, or bundle identifier.' },
  { method: 'GET', path: '/api/v1/platforms', description: 'Get all available platforms and app counts.' },
];

export function DocsApiContent() {
  const { t } = useLanguage();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6">
              <span className="text-cyan-300">API</span>
              <span className="text-cyan-200 font-medium">{t.api.restApiVersion}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              {t.api.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">{t.api.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
                <span className="text-green-400">✓</span>
                <span>{t.api.free}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
                <span className="text-green-400">✓</span>
                <span>{t.api.noAuth}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <span>{t.api.jsonResponses}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
                <span>{t.api.corsEnabled}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section title={t.api.baseUrl} subtitle={t.api.baseUrlSubtitle} background="gray">
        <div className="bg-gray-900 rounded-xl p-6 font-mono text-lg">
          <div className="flex items-center justify-between">
            <code className="text-emerald-400">{BASE_URL}/api/v1</code>
            <button
              type="button"
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
              onClick={() => copyToClipboard(`${BASE_URL}/api/v1`, 'base')}
            >
              {copiedEndpoint === 'base' ? t.api.copied : t.api.copy}
            </button>
          </div>
        </div>
      </Section>

      <Section title={t.api.quickStart} subtitle={t.api.quickStartSubtitle} background="default">
        <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-300">
{`const response = await fetch('${BASE_URL}/api/v1/apps');
const data = await response.json();
console.log(data.data);`}
          </pre>
        </div>
      </Section>

      <Section title={t.api.apiEndpoints} subtitle={t.api.apiEndpointsSubtitle} background="gray">
        <div className="space-y-8">
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.path}
              className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-green-900/50 text-green-400 font-mono font-bold text-sm rounded-lg">
                    {endpoint.method}
                  </span>
                  <code className="text-lg font-mono text-white">{endpoint.path}</code>
                  <button
                    type="button"
                    className="ml-auto px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
                    onClick={() =>
                      copyToClipboard(
                        `${BASE_URL}${endpoint.path.replace(':slug', 'doudou')}`,
                        endpoint.path
                      )
                    }
                  >
                    {copiedEndpoint === endpoint.path ? t.api.copied : t.api.copyUrl}
                  </button>
                </div>
                <p className="text-gray-400">{endpoint.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.api.rateLimits} subtitle={t.api.rateLimitsSubtitle} background="gray">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
          <p className="text-gray-400 mb-4">{t.api.noRateLimitsDesc}</p>
          <p className="text-gray-400">{t.api.noApiKeyDesc}</p>
        </div>
      </Section>
    </>
  );
}
