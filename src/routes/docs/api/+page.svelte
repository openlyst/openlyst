<script lang="ts">
  import { Section } from '$lib';
  
  const baseUrl = 'https://openlyst.onrender.com';
  
  interface Endpoint {
    method: string;
    path: string;
    description: string;
    params?: { name: string; type: string; description: string; required?: boolean }[];
    queryParams?: { name: string; type: string; description: string; default?: string }[];
    response: string;
  }
  
  const endpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/repo',
      description: 'Get repository metadata and basic statistics.',
      response: `{
  "success": true,
  "data": {
    "name": "OpenLyst Repository",
    "subtitle": "Every Openlyst iOS app.",
    "description": "FOSS apps for iOS, Android, and Desktop...",
    "iconURL": "/favicon.svg",
    "headerURL": "https://...",
    "website": "https://openlyst.onrender.com",
    "tintColor": "#dc2626",
    "featuredApps": ["doudou"],
    "totalApps": 3,
    "totalNews": 2
  }
}`
    },
    {
      method: 'GET',
      path: '/api/v1/apps',
      description: 'Get all apps in the repository with optional filtering.',
      queryParams: [
        { name: 'filter', type: 'string', description: 'Filter apps by status', default: 'none (returns all)' },
        { name: 'platform', type: 'string', description: 'Filter apps by platform (iOS, Android, macOS, Windows, Linux, Web)' }
      ],
      response: `{
  "success": true,
  "count": 3,
  "data": [
    {
      "name": "Doudou",
      "slug": "doudou",
      "bundleIdentifier": "doudou",
      "subtitle": "Music player for self-hosted services",
      "platforms": ["iOS", "macOS", "Windows", "Linux", "Android", "Web"],
      "iconURL": "https://...",
      "versions": [...],
      ...
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/v1/apps/:slug',
      description: 'Get detailed information about a specific app.',
      params: [
        { name: 'slug', type: 'string', description: 'The app slug (e.g., "doudou", "klit")', required: true }
      ],
      response: `{
  "success": true,
  "data": {
    "name": "Doudou",
    "slug": "doudou",
    "bundleIdentifier": "doudou",
    "subtitle": "Music player for self-hosted services",
    "localizedDescription": "...",
    "iconURL": "https://...",
    "tintColor": "#dc2626",
    "platforms": ["iOS", "macOS", "Windows", "Linux", "Android", "Web"],
    "screenshots": [...],
    "versions": [...]
  }
}`
    },
    {
      method: 'GET',
      path: '/api/v1/apps/:slug/versions',
      description: 'Get all versions of a specific app.',
      params: [
        { name: 'slug', type: 'string', description: 'The app slug', required: true }
      ],
      response: `{
  "success": true,
  "appName": "Doudou",
  "count": 3,
  "data": [
    {
      "version": "8.0.0",
      "date": "2025-12-06",
      "platforms": ["iOS", "macOS", "Windows", "Linux", "Android", "Web"],
      "platformInstall": {...},
      "downloads": {...},
      "localizedDescription": "# 8.0.0\\n..."
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/v1/apps/:slug/latest',
      description: 'Get the latest version of a specific app.',
      params: [
        { name: 'slug', type: 'string', description: 'The app slug', required: true }
      ],
      response: `{
  "success": true,
  "appName": "Doudou",
  "appSlug": "doudou",
  "data": {
    "version": "8.0.0",
    "date": "2025-12-06",
    "platforms": ["iOS", "macOS", "Windows", "Linux", "Android", "Web"],
    "platformInstall": {...},
    "downloads": {...},
    "localizedDescription": "..."
  }
}`
    },
    {
      method: 'GET',
      path: '/api/v1/news',
      description: 'Get news and announcements.',
      queryParams: [
        { name: 'limit', type: 'number', description: 'Maximum number of news items to return' },
        { name: 'appId', type: 'string', description: 'Filter news by app ID (bundleIdentifier)' }
      ],
      response: `{
  "success": true,
  "count": 2,
  "data": [
    {
      "title": "BaoBao Discontinued - Meet Klit!",
      "identifier": "baobao_deprecated_klit_release",
      "caption": "BaoBao is being retired...",
      "date": "2025-12-06",
      "tintColor": "#ff6b35",
      "imageURL": "/icons/Klit/klit_release_image.png",
      "notify": true,
      "url": "/apps/klit",
      "appID": "klit"
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/v1/search',
      description: 'Search for apps by name, description, or bundle identifier.',
      queryParams: [
        { name: 'q', type: 'string', description: 'Search query (required)' }
      ],
      response: `{
  "success": true,
  "query": "music",
  "count": 1,
  "data": [
    {
      "name": "Doudou",
      "slug": "doudou",
      "subtitle": "Music player for self-hosted services",
      "relevanceScore": 15,
      ...
    }
  ]
}`
    },
    {
      method: 'GET',
      path: '/api/v1/platforms',
      description: 'Get all available platforms and app counts.',
      response: `{
  "success": true,
  "count": 6,
  "data": [
    { "name": "iOS", "appCount": 3 },
    { "name": "Android", "appCount": 3 },
    { "name": "macOS", "appCount": 2 },
    { "name": "Windows", "appCount": 2 },
    { "name": "Linux", "appCount": 2 },
    { "name": "Web", "appCount": 2 }
  ]
}`
    }
  ];
  
  let copiedEndpoint: string | null = null;
  
  function copyToClipboard(text: string, endpoint: string) {
    navigator.clipboard.writeText(text);
    copiedEndpoint = endpoint;
    setTimeout(() => {
      copiedEndpoint = null;
    }, 2000);
  }
</script>

<svelte:head>
  <title>API Documentation - OpenLyst</title>
  <meta name="description" content="Free API documentation for accessing OpenLyst repository data" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
        <i class="fas fa-code text-emerald-200"></i>
        <span class="text-emerald-100 font-medium">REST API v1</span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
        OpenLyst API
      </h1>
      <p class="text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
        Access our complete app repository programmatically. Free to use, no authentication required.
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
          <i class="fas fa-check-circle text-green-300"></i>
          <span>100% Free</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
          <i class="fas fa-lock-open text-green-300"></i>
          <span>No Auth Required</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
          <i class="fas fa-bolt text-yellow-300"></i>
          <span>JSON Responses</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
          <i class="fas fa-globe text-blue-300"></i>
          <span>CORS Enabled</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Base URL Section -->
<Section title="Base URL" subtitle="All API requests should be made to this URL" background="gray">
  {#snippet children()}
    <div class="bg-gray-900 rounded-xl p-6 font-mono text-lg">
      <div class="flex items-center justify-between">
        <code class="text-emerald-400">{baseUrl}/api/v1</code>
        <button 
          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
          on:click={() => copyToClipboard(`${baseUrl}/api/v1`, 'base')}
        >
          {copiedEndpoint === 'base' ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Quick Start Section -->
<Section title="Quick Start" subtitle="Get started with a simple example" background="default">
  {#snippet children()}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">JavaScript / Fetch</h3>
        <div class="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre class="text-gray-300"><span class="text-purple-400">const</span> response = <span class="text-purple-400">await</span> <span class="text-yellow-400">fetch</span>(<span class="text-emerald-400">'{baseUrl}/api/v1/apps'</span>);
<span class="text-purple-400">const</span> data = <span class="text-purple-400">await</span> response.<span class="text-yellow-400">json</span>();

<span class="text-gray-500">// Get all apps</span>
<span class="text-yellow-400">console</span>.<span class="text-yellow-400">log</span>(data.data);</pre>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">cURL</h3>
        <div class="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre class="text-gray-300"><span class="text-emerald-400">curl</span> {baseUrl}/api/v1/apps</pre>
        </div>
        <h3 class="text-lg font-semibold text-white mb-4 mt-6">Python</h3>
        <div class="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre class="text-gray-300"><span class="text-purple-400">import</span> requests

response = requests.<span class="text-yellow-400">get</span>(<span class="text-emerald-400">'{baseUrl}/api/v1/apps'</span>)
data = response.<span class="text-yellow-400">json</span>()</pre>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Endpoints Section -->
<Section title="API Endpoints" subtitle="Complete reference for all available endpoints" background="gray">
  {#snippet children()}
    <div class="space-y-8">
      {#each endpoints as endpoint}
        <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
          <!-- Endpoint Header -->
          <div class="p-6 border-b border-gray-700">
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="px-3 py-1 bg-green-900/50 text-green-400 font-mono font-bold text-sm rounded-lg">
                {endpoint.method}
              </span>
              <code class="text-lg font-mono text-white">{endpoint.path}</code>
              <button 
                class="ml-auto px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm flex items-center gap-2"
                on:click={() => copyToClipboard(`${baseUrl}${endpoint.path.replace(':slug', 'doudou')}`, endpoint.path)}
              >
                <i class="fas fa-copy"></i>
                {copiedEndpoint === endpoint.path ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
            <p class="text-gray-400">{endpoint.description}</p>
          </div>
          
          <!-- Parameters -->
          {#if endpoint.params && endpoint.params.length > 0}
            <div class="p-6 border-b border-gray-700 bg-gray-900">
              <h4 class="text-sm font-semibold text-gray-200 uppercase tracking-wide mb-4">Path Parameters</h4>
              <div class="space-y-3">
                {#each endpoint.params as param}
                  <div class="flex items-start gap-4">
                    <code class="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-sm font-mono">{param.name}</code>
                    <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{param.type}</span>
                    {#if param.required}
                      <span class="px-2 py-1 bg-red-900/50 text-red-300 rounded text-xs">required</span>
                    {/if}
                    <span class="text-gray-400 text-sm">{param.description}</span>
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Query Parameters -->
          {#if endpoint.queryParams && endpoint.queryParams.length > 0}
            <div class="p-6 border-b border-gray-700 bg-gray-900">
              <h4 class="text-sm font-semibold text-gray-200 uppercase tracking-wide mb-4">Query Parameters</h4>
              <div class="space-y-3">
                {#each endpoint.queryParams as param}
                  <div class="flex flex-wrap items-start gap-2 sm:gap-4">
                    <code class="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm font-mono">{param.name}</code>
                    <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{param.type}</span>
                    <span class="text-gray-400 text-sm flex-1">{param.description}</span>
                    {#if param.default}
                      <span class="text-gray-500 text-sm">Default: {param.default}</span>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Response -->
          <div class="p-6">
            <h4 class="text-sm font-semibold text-gray-200 uppercase tracking-wide mb-4">Example Response</h4>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-emerald-400 text-sm font-mono whitespace-pre">{endpoint.response}</pre>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/snippet}
</Section>

<!-- Error Handling Section -->
<Section title="Error Handling" subtitle="Understanding API error responses" background="default">
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-red-900/50 text-red-400 font-mono font-bold text-sm rounded-lg">404</span>
          <span class="font-semibold text-white">Not Found</span>
        </div>
        <p class="text-gray-400 mb-4">Returned when the requested resource doesn't exist.</p>
        <div class="bg-gray-900 rounded-lg p-4">
          <pre class="text-red-400 text-sm font-mono">{`{
  "success": false,
  "error": "App not found"
}`}</pre>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-red-900/50 text-red-400 font-mono font-bold text-sm rounded-lg">400</span>
          <span class="font-semibold text-white">Bad Request</span>
        </div>
        <p class="text-gray-400 mb-4">Returned when required parameters are missing.</p>
        <div class="bg-gray-900 rounded-lg p-4">
          <pre class="text-red-400 text-sm font-mono">{`{
  "success": false,
  "error": "Search query is required"
}`}</pre>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-red-900/50 text-red-400 font-mono font-bold text-sm rounded-lg">500</span>
          <span class="font-semibold text-white">Server Error</span>
        </div>
        <p class="text-gray-400 mb-4">Returned when an internal error occurs.</p>
        <div class="bg-gray-900 rounded-lg p-4">
          <pre class="text-red-400 text-sm font-mono">{`{
  "success": false,
  "error": "Failed to load apps"
}`}</pre>
        </div>
      </div>
      
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-green-900/50 text-green-400 font-mono font-bold text-sm rounded-lg">200</span>
          <span class="font-semibold text-white">Success</span>
        </div>
        <p class="text-gray-400 mb-4">All successful responses include <code class="bg-gray-700 px-1 rounded text-gray-300">success: true</code>.</p>
        <div class="bg-gray-900 rounded-lg p-4">
          <pre class="text-emerald-400 text-sm font-mono">{`{
  "success": true,
  "data": { ... }
}`}</pre>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Rate Limits Section -->
<Section title="Rate Limits & Usage" subtitle="Fair usage guidelines" background="gray">
  {#snippet children()}
    <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-infinity text-2xl text-emerald-400"></i>
          </div>
          <h3 class="font-semibold text-white mb-2">No Rate Limits</h3>
          <p class="text-gray-400 text-sm">Currently no rate limits are enforced. Please use responsibly.</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-key text-2xl text-blue-400"></i>
          </div>
          <h3 class="font-semibold text-white mb-2">No API Key</h3>
          <p class="text-gray-400 text-sm">No authentication or API keys required to access any endpoint.</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-heart text-2xl text-purple-400"></i>
          </div>
          <h3 class="font-semibold text-white mb-2">Open Source</h3>
          <p class="text-gray-400 text-sm">This API is part of the OpenLyst open source project.</p>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-700">
        <h4 class="font-semibold text-white mb-4">Fair Usage Guidelines</h4>
        <ul class="space-y-2 text-gray-400">
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>Cache responses when possible to reduce server load</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>Use specific endpoints instead of fetching all data repeatedly</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>Include a User-Agent header identifying your application</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-times text-red-500 mt-1"></i>
            <span>Don't make excessive requests in short time periods</span>
          </li>
        </ul>
      </div>
    </div>
  {/snippet}
</Section>
