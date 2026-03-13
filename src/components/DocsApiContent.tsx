'use client';

import { useState } from 'react';
import { Section } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const BASE_URL = 'https://openlyst.ink';

type ParamKind = 'query' | 'path';

interface ApiParam {
  name: string;
  kind: ParamKind;
  required: boolean;
  description: string;
  values?: string;
}

interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  params: ApiParam[];
  exampleResponse: string;
}

const endpoints: ApiEndpoint[] = [
  {
    method: 'GET',
    path: '/api/v1/repo',
    description: 'Repository metadata and basic statistics. Use for repo name, icon, featured apps, total counts, and tempDownloadsOff flag.',
    params: [
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "language": "en",
  "data": {
    "name": "OpenLyst",
    "subtitle": "...",
    "totalApps": 6,
    "totalNews": 5,
    "tempDownloadsOff": false,
    "featuredApps": ["doudou", "docan", ...]
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/apps',
    description: 'List all apps. Optionally filter by status or platform.',
    params: [
      { name: 'filter', kind: 'query', required: false, description: 'Limit to active or deprecated apps', values: 'active | deprecated' },
      { name: 'platform', kind: 'query', required: false, description: 'Only apps that support this platform', values: 'e.g. iOS, Android, macOS' },
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "count": 6,
  "language": "en",
  "data": [
    {
      "name": "Doudou",
      "slug": "doudou",
      "subtitle": "Music player for self-hosted services",
      "platforms": ["iOS", "macOS", "Windows", "Linux", "Android"],
      "versions": [...]
    }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/apps/:slug',
    description: 'Full details for one app, including all versions.',
    params: [
      { name: 'slug', kind: 'path', required: true, description: 'App slug or bundle identifier', values: 'e.g. doudou, docan' },
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "language": "en",
  "data": {
    "name": "Doudou",
    "slug": "doudou",
    "bundleIdentifier": "doudou",
    "applicationId": "gitlab.openlyst.doudou",
    "subtitle": "Music player for self-hosted services",
    "localizedDescription": "...",
    "iconURL": "https://...",
    "platforms": ["iOS", "macOS", ...],
    "versions": [{ "version": "14.0.0", "date": "2026-02-16", ... }]
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/apps/:slug/versions',
    description: 'All versions of an app, ordered newest first.',
    params: [
      { name: 'slug', kind: 'path', required: true, description: 'App slug or bundle identifier', values: 'e.g. doudou' },
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "language": "en",
  "appName": "Doudou",
  "count": 12,
  "data": [
    { "version": "14.0.0", "date": "2026-02-16", "platforms": [...], "downloads": {...} },
    { "version": "13.0.0", ... }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/apps/:slug/latest',
    description: 'The latest version of an app only. Returns 404 if no versions exist.',
    params: [
      { name: 'slug', kind: 'path', required: true, description: 'App slug or bundle identifier', values: 'e.g. doudou' },
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "language": "en",
  "appName": "Doudou",
  "appSlug": "doudou",
  "data": {
    "version": "14.0.0",
    "date": "2026-02-16",
    "platforms": ["iOS", "macOS", "Windows", "Linux", "Android"],
    "downloads": { "iOS": "https://...", "Android": { "apk": "https://..." }, ... }
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/news',
    description: 'News and announcements. Optionally filter by app or limit count.',
    params: [
      { name: 'limit', kind: 'query', required: false, description: 'Max number of items to return', values: 'positive integer' },
      { name: 'appId', kind: 'query', required: false, description: 'Only news for this app (bundle ID)', values: 'e.g. doudou' },
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "language": "en",
  "count": 5,
  "data": [
    {
      "identifier": "...",
      "title": "New release",
      "caption": "...",
      "date": "2026-02-16",
      "appID": "doudou"
    }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/search',
    description: 'Search apps by name, subtitle, description, or bundle identifier. Query parameter q is required. Results include relevanceScore.',
    params: [
      { name: 'q', kind: 'query', required: true, description: 'Search term', values: 'any string' },
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "query": "music",
  "language": "en",
  "count": 1,
  "data": [
    {
      "name": "Doudou",
      "slug": "doudou",
      "subtitle": "Music player for self-hosted services",
      "relevanceScore": 11
    }
  ]
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/platforms',
    description: 'All platforms that have at least one app, with app counts. Sorted by count descending.',
    params: [
      { name: 'lang', kind: 'query', required: false, description: 'Content language', values: 'en | zh | ru' },
    ],
    exampleResponse: `{
  "success": true,
  "language": "en",
  "count": 6,
  "data": [
    { "name": "Android", "appCount": 6 },
    { "name": "iOS", "appCount": 5 },
    { "name": "macOS", "appCount": 5 }
  ]
}`,
  },
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
          <div className="flex flex-wrap items-center justify-between gap-2">
            <code className="text-emerald-400 break-all">{BASE_URL}/api/v1</code>
            <button
              type="button"
              className="shrink-0 px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
              onClick={() => copyToClipboard(`${BASE_URL}/api/v1`, 'base')}
            >
              {copiedEndpoint === 'base' ? t.api.copied : t.api.copy}
            </button>
          </div>
        </div>
      </Section>

      <Section title={t.api.howItWorks} subtitle={t.api.howItWorksSubtitle} background="default">
        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.api.responseFormatTitle}</h3>
            <p className="text-gray-400">{t.api.responseFormatDesc}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
            <pre className="text-gray-300 whitespace-pre-wrap break-words">
{`// Success
{ "success": true, "language": "en", "data": ... }

// Error (400, 404, 500)
{ "success": false, "error": "message" }`}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{t.api.errorHandling}</h3>
            <p className="text-gray-400 mb-3">{t.api.errorHandlingSubtitle}</p>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><strong className="text-amber-400">400</strong> — {t.api.badRequestDesc}</li>
              <li><strong className="text-amber-400">404</strong> — {t.api.notFoundDesc}</li>
              <li><strong className="text-amber-400">500</strong> — {t.api.serverErrorDesc}</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section title={t.api.quickStart} subtitle={t.api.quickStartSubtitle} background="gray">
        <div className="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre className="text-gray-300">
{`const response = await fetch('${BASE_URL}/api/v1/apps');
const data = await response.json();
console.log(data.data);`}
          </pre>
        </div>
      </Section>

      <Section title={t.api.apiEndpoints} subtitle={t.api.apiEndpointsSubtitle} background="default">
        <div className="space-y-8">
          {endpoints.map((endpoint) => {
            const pathParams = endpoint.params.filter((p) => p.kind === 'path');
            const queryParams = endpoint.params.filter((p) => p.kind === 'query');
            const examplePath = endpoint.path.replace(':slug', 'doudou');
            const exampleUrl = `${BASE_URL}${examplePath}${queryParams.length ? '?lang=en' : ''}`;

            return (
              <div
                key={endpoint.path}
                className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-700">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-green-900/50 text-green-400 font-mono font-bold text-sm rounded-lg">
                      {endpoint.method}
                    </span>
                    <code className="text-lg font-mono text-white break-all">{endpoint.path}</code>
                    <button
                      type="button"
                      className="ml-auto px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm shrink-0"
                      onClick={() => copyToClipboard(exampleUrl, endpoint.path)}
                    >
                      {copiedEndpoint === endpoint.path ? t.api.copied : t.api.copyUrl}
                    </button>
                  </div>
                  <p className="text-gray-400 mb-4">{endpoint.description}</p>

                  {(pathParams.length > 0 || queryParams.length > 0) && (
                    <div className="space-y-3 mt-4">
                      {pathParams.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">{t.api.pathParameters}</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="text-gray-400 border-b border-gray-600">
                                  <th className="py-2 pr-4 font-mono">Name</th>
                                  <th className="py-2 pr-4">{t.api.required}</th>
                                  <th className="py-2">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pathParams.map((p) => (
                                  <tr key={p.name} className="border-b border-gray-700/50">
                                    <td className="py-2 pr-4 font-mono text-cyan-300">{p.name}</td>
                                    <td className="py-2 pr-4">{p.required ? t.api.required : t.api.default}</td>
                                    <td className="py-2 text-gray-400">{p.description}{p.values ? ` (${p.values})` : ''}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      {queryParams.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">{t.api.queryParameters}</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                              <thead>
                                <tr className="text-gray-400 border-b border-gray-600">
                                  <th className="py-2 pr-4 font-mono">Name</th>
                                  <th className="py-2 pr-4">{t.api.required}</th>
                                  <th className="py-2">Description</th>
                                </tr>
                              </thead>
                              <tbody>
                                {queryParams.map((p) => (
                                  <tr key={p.name} className="border-b border-gray-700/50">
                                    <td className="py-2 pr-4 font-mono text-cyan-300">{p.name}</td>
                                    <td className="py-2 pr-4">{p.required ? t.api.required : t.api.default}</td>
                                    <td className="py-2 text-gray-400">{p.description}{p.values ? ` (${p.values})` : ''}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">{t.api.exampleResponse}</h4>
                    <pre className="bg-gray-900 rounded-lg p-4 text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap break-words">
                      {endpoint.exampleResponse}
                    </pre>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title={t.api.downloadStructure} subtitle={t.api.downloadStructureSubtitle} background="gray">
        <div className="space-y-4 text-gray-400">
          <p>{t.api.downloadsFieldDesc}</p>
          <p className="flex items-start gap-2">
            <span className="font-semibold text-gray-300 shrink-0">{t.api.tempDownloadsOffLabel}</span>
            <span>{t.api.tempDownloadsOffDesc}</span>
          </p>
        </div>
      </Section>

      <Section title={t.api.rateLimits} subtitle={t.api.rateLimitsSubtitle} background="default">
        <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
          <p className="text-gray-400 mb-4">{t.api.noRateLimitsDesc}</p>
          <p className="text-gray-400">{t.api.noApiKeyDesc}</p>
        </div>
      </Section>
    </>
  );
}
