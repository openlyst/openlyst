<script lang="ts">
  import { Section } from '$lib';
  import { t } from '$lib/stores/language';
  
  const baseUrl = 'https://openlyst.ink';
  
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
    "website": "https://openlyst.ink",
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
  <title>{$t.api.pageTitle} - OpenLyst</title>
  <meta name="description" content={$t.api.pageDescription} />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

<!-- Hero Section -->
<section class="relative text-white overflow-hidden min-h-[60vh] flex items-center">
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6">
        <i class="fas fa-code text-cyan-300"></i>
        <span class="text-cyan-200 font-medium">{$t.api.restApiVersion}</span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
        {$t.api.title}
      </h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
        {$t.api.subtitle}
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <div class="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
          <i class="fas fa-check-circle text-green-400"></i>
          <span>{$t.api.free}</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 glass-card rounded-lg">
          <i class="fas fa-lock-open text-green-400"></i>
          <span>{$t.api.noAuth}</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
          <i class="fas fa-bolt text-yellow-300"></i>
          <span>{$t.api.jsonResponses}</span>
        </div>
        <div class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg">
          <i class="fas fa-globe text-blue-300"></i>
          <span>{$t.api.corsEnabled}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Base URL Section -->
<Section title={$t.api.baseUrl} subtitle={$t.api.baseUrlSubtitle} background="gray">
  {#snippet children()}
    <div class="bg-gray-900 rounded-xl p-6 font-mono text-lg">
      <div class="flex items-center justify-between">
        <code class="text-emerald-400">{baseUrl}/api/v1</code>
        <button 
          class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors text-sm"
          onclick={() => copyToClipboard(`${baseUrl}/api/v1`, 'base')}
        >
          {copiedEndpoint === 'base' ? $t.api.copied : $t.api.copy}
        </button>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Quick Start Section -->
<Section title={$t.api.quickStart} subtitle={$t.api.quickStartSubtitle} background="default">
  {#snippet children()}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 class="text-lg font-semibold text-white mb-4">{$t.api.javascriptFetch}</h3>
        <div class="bg-gray-900 rounded-xl p-6 font-mono text-sm overflow-x-auto">
          <pre class="text-gray-300"><span class="text-purple-400">const</span> response = <span class="text-purple-400">await</span> <span class="text-yellow-400">fetch</span>(<span class="text-emerald-400">'{baseUrl}/api/v1/apps'</span>);
<span class="text-purple-400">const</span> data = <span class="text-purple-400">await</span> response.<span class="text-yellow-400">json</span>();

<span class="text-gray-500">// {$t.api.getAllApps}</span>
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
<Section title={$t.api.apiEndpoints} subtitle={$t.api.apiEndpointsSubtitle} background="gray">
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
                onclick={() => copyToClipboard(`${baseUrl}${endpoint.path.replace(':slug', 'doudou')}`, endpoint.path)}
              >
                <i class="fas fa-copy"></i>
                {copiedEndpoint === endpoint.path ? $t.api.copied : $t.api.copyUrl}
              </button>
            </div>
            <p class="text-gray-400">{endpoint.description}</p>
          </div>
          
          <!-- Parameters -->
          {#if endpoint.params && endpoint.params.length > 0}
            <div class="p-6 border-b border-gray-700 bg-gray-900">
              <h4 class="text-sm font-semibold text-gray-200 uppercase tracking-wide mb-4">{$t.api.pathParameters}</h4>
              <div class="space-y-3">
                {#each endpoint.params as param}
                  <div class="flex items-start gap-4">
                    <code class="px-2 py-1 bg-purple-900/50 text-purple-300 rounded text-sm font-mono">{param.name}</code>
                    <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{param.type}</span>
                    {#if param.required}
                      <span class="px-2 py-1 bg-red-900/50 text-red-300 rounded text-xs">{$t.api.required}</span>
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
              <h4 class="text-sm font-semibold text-gray-200 uppercase tracking-wide mb-4">{$t.api.queryParameters}</h4>
              <div class="space-y-3">
                {#each endpoint.queryParams as param}
                  <div class="flex flex-wrap items-start gap-2 sm:gap-4">
                    <code class="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm font-mono">{param.name}</code>
                    <span class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">{param.type}</span>
                    <span class="text-gray-400 text-sm flex-1">{param.description}</span>
                    {#if param.default}
                      <span class="text-gray-500 text-sm">{$t.api.default}: {param.default}</span>
                    {/if}
                  </div>
                {/each}
              </div>
            </div>
          {/if}
          
          <!-- Response -->
          <div class="p-6">
            <h4 class="text-sm font-semibold text-gray-200 uppercase tracking-wide mb-4">{$t.api.exampleResponse}</h4>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-emerald-400 text-sm font-mono whitespace-pre">{endpoint.response}</pre>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/snippet}
</Section>

<!-- Download Structure Section -->
<Section title={$t.api.downloadStructure} subtitle={$t.api.downloadStructureSubtitle} background="default">
  {#snippet children()}
    <p class="text-gray-400 mb-6">
      {$t.api.downloadsFieldDesc}
    </p>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Windows Downloads -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <i class="fab fa-windows text-2xl text-blue-400"></i>
          <h3 class="font-semibold text-white text-lg">{$t.api.windowsDownloads}</h3>
        </div>
        <p class="text-gray-400 text-sm mb-4">{$t.api.windowsDownloadsDesc}</p>
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-emerald-400 text-sm font-mono whitespace-pre">{`"Windows": {
  "exe": {
    "x86_64": "https://.../app-setup-x64.exe",
    "arm64": "https://.../app-setup-arm64.exe"
  },
  "msi": {
    "x86_64": "https://.../app-x64.msi",
    "arm64": ""
  },
  "msix": {
    "x86_64": "https://.../app.msix",
    "arm64": ""
  },
  "zip": {
    "x86_64": "https://.../app-win-x64.zip",
    "arm64": ""
  },
  "portable": {
    "x86_64": "https://.../app-portable.exe",
    "arm64": ""
  },
  "winget": "Publisher.AppName",
  "chocolatey": "app-name",
  "scoop": "extras/app-name"
}`}</pre>
        </div>
        <div class="mt-4 space-y-2">
          <h4 class="text-sm font-semibold text-gray-300">{$t.api.installerTypes}:</h4>
          <ul class="text-gray-400 text-sm space-y-1">
            <li><code class="bg-gray-700 px-1 rounded">exe</code> - {$t.api.exeDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">msi</code> - {$t.api.msiDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">msix</code> - {$t.api.msixDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">zip</code> - {$t.api.zipDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">portable</code> - {$t.api.portableDesc}</li>
          </ul>
          <h4 class="text-sm font-semibold text-gray-300 mt-3">{$t.api.packageManagers}:</h4>
          <ul class="text-gray-400 text-sm space-y-1">
            <li><code class="bg-gray-700 px-1 rounded">winget</code> - {$t.api.wingetDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">chocolatey</code> - {$t.api.chocolateyDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">scoop</code> - {$t.api.scoopDesc}</li>
          </ul>
        </div>
      </div>
      
      <!-- Linux Downloads -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <i class="fab fa-linux text-2xl text-yellow-400"></i>
          <h3 class="font-semibold text-white text-lg">{$t.api.linuxDownloads}</h3>
        </div>
        <p class="text-gray-400 text-sm mb-4">{$t.api.linuxDownloadsDesc}</p>
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-emerald-400 text-sm font-mono whitespace-pre">{`"Linux": {
  "zip": {
    "x86_64": "https://.../app-linux-x64.zip",
    "arm64": ""
  },
  "appimage": {
    "x86_64": "https://.../app-x86_64.AppImage",
    "arm64": ""
  },
  "deb": {
    "x86_64": "https://.../app-amd64.deb",
    "arm64": ""
  },
  "rpm": {
    "x86_64": "https://.../app-x86_64.rpm",
    "arm64": ""
  },
  "aur": {
    "x86_64": "https://aur.archlinux.org/packages/app-bin"
  },
  "homebrew": "https://.../homebrew/tap"
}`}</pre>
        </div>
        <div class="mt-4 space-y-2">
          <h4 class="text-sm font-semibold text-gray-300">{$t.api.packageTypes}:</h4>
          <ul class="text-gray-400 text-sm space-y-1">
            <li><code class="bg-gray-700 px-1 rounded">appimage</code> - {$t.api.appimageDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">deb</code> - {$t.api.debDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">rpm</code> - {$t.api.rpmDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">zip</code> / <code class="bg-gray-700 px-1 rounded">tar</code> - {$t.api.archiveDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">aur</code> - {$t.api.aurDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">homebrew</code> - {$t.api.homebrewDesc}</li>
          </ul>
        </div>
      </div>
      
      <!-- macOS Downloads -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <i class="fab fa-apple text-2xl text-gray-300"></i>
          <h3 class="font-semibold text-white text-lg">{$t.api.macosDownloads}</h3>
        </div>
        <p class="text-gray-400 text-sm mb-4">{$t.api.macosDownloadsDesc}</p>
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-emerald-400 text-sm font-mono whitespace-pre">{`"macOS": {
  "x86_64": "https://.../app-mac-x64.zip",
  "arm64": "https://.../app-mac-arm64.zip",
  "universal": "https://.../app-mac-universal.zip",
  "homebrew": "https://.../homebrew/tap"
}`}</pre>
        </div>
        <div class="mt-4 space-y-2">
          <h4 class="text-sm font-semibold text-gray-300">{$t.api.architectures}:</h4>
          <ul class="text-gray-400 text-sm space-y-1">
            <li><code class="bg-gray-700 px-1 rounded">x86_64</code> - {$t.api.intelMacs}</li>
            <li><code class="bg-gray-700 px-1 rounded">arm64</code> - {$t.api.appleSilicon}</li>
            <li><code class="bg-gray-700 px-1 rounded">universal</code> - {$t.api.universalBinary}</li>
            <li><code class="bg-gray-700 px-1 rounded">homebrew</code> - {$t.api.homebrewCask}</li>
          </ul>
        </div>
      </div>
      
      <!-- Android Downloads -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <i class="fab fa-android text-2xl text-green-400"></i>
          <h3 class="font-semibold text-white text-lg">{$t.api.androidDownloads}</h3>
        </div>
        <p class="text-gray-400 text-sm mb-4">{$t.api.androidDownloadsDesc}</p>
        <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
          <pre class="text-emerald-400 text-sm font-mono whitespace-pre">{`"Android": {
  "apk": "https://.../app-release.apk",
  "aab": "https://.../app-release.aab",
  "apkpure": "https://apkpure.com/p/..."
}`}</pre>
        </div>
        <div class="mt-4 space-y-2">
          <h4 class="text-sm font-semibold text-gray-300">{$t.api.formats}:</h4>
          <ul class="text-gray-400 text-sm space-y-1">
            <li><code class="bg-gray-700 px-1 rounded">apk</code> - {$t.api.apkDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">aab</code> - {$t.api.aabDesc}</li>
            <li><code class="bg-gray-700 px-1 rounded">apkpure</code> - {$t.api.apkpureDesc}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Architecture Notes -->
    <div class="mt-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
      <h3 class="font-semibold text-white text-lg mb-4">{$t.api.architectureReference}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="text-center p-4 bg-gray-900 rounded-lg">
          <code class="text-blue-400 font-mono">x86_64</code>
          <p class="text-gray-400 text-sm mt-1">{$t.api.arch64BitIntel}</p>
        </div>
        <div class="text-center p-4 bg-gray-900 rounded-lg">
          <code class="text-purple-400 font-mono">arm64</code>
          <p class="text-gray-400 text-sm mt-1">{$t.api.arch64BitArm}</p>
        </div>
        <div class="text-center p-4 bg-gray-900 rounded-lg">
          <code class="text-green-400 font-mono">universal</code>
          <p class="text-gray-400 text-sm mt-1">{$t.api.archUniversal}</p>
        </div>
        <div class="text-center p-4 bg-gray-900 rounded-lg">
          <code class="text-yellow-400 font-mono">i386</code>
          <p class="text-gray-400 text-sm mt-1">{$t.api.arch32BitIntel}</p>
        </div>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Error Handling Section -->
<Section title={$t.api.errorHandling} subtitle={$t.api.errorHandlingSubtitle} background="gray">
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6">
        <div class="flex items-center gap-3 mb-4">
          <span class="px-3 py-1 bg-red-900/50 text-red-400 font-mono font-bold text-sm rounded-lg">404</span>
          <span class="font-semibold text-white">{$t.api.notFound}</span>
        </div>
        <p class="text-gray-400 mb-4">{$t.api.notFoundDesc}</p>
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
          <span class="font-semibold text-white">{$t.api.badRequest}</span>
        </div>
        <p class="text-gray-400 mb-4">{$t.api.badRequestDesc}</p>
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
          <span class="font-semibold text-white">{$t.api.serverError}</span>
        </div>
        <p class="text-gray-400 mb-4">{$t.api.serverErrorDesc}</p>
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
          <span class="font-semibold text-white">{$t.api.success}</span>
        </div>
        <p class="text-gray-400 mb-4">{$t.api.successDesc}</p>
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
<Section title={$t.api.rateLimits} subtitle={$t.api.rateLimitsSubtitle} background="gray">
  {#snippet children()}
    <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-16 h-16 bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-infinity text-2xl text-emerald-400"></i>
          </div>
          <h3 class="font-semibold text-white mb-2">{$t.api.noRateLimits}</h3>
          <p class="text-gray-400 text-sm">{$t.api.noRateLimitsDesc}</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-key text-2xl text-blue-400"></i>
          </div>
          <h3 class="font-semibold text-white mb-2">{$t.api.noApiKey}</h3>
          <p class="text-gray-400 text-sm">{$t.api.noApiKeyDesc}</p>
        </div>
        <div class="text-center">
          <div class="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fas fa-heart text-2xl text-purple-400"></i>
          </div>
          <h3 class="font-semibold text-white mb-2">{$t.api.openSource}</h3>
          <p class="text-gray-400 text-sm">{$t.api.openSourceDesc}</p>
        </div>
      </div>
      
      <div class="mt-8 pt-8 border-t border-gray-700">
        <h4 class="font-semibold text-white mb-4">{$t.api.fairUsageGuidelines}</h4>
        <ul class="space-y-2 text-gray-400">
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>{$t.api.cacheResponses}</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>{$t.api.useSpecificEndpoints}</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-check text-green-500 mt-1"></i>
            <span>{$t.api.includeUserAgent}</span>
          </li>
          <li class="flex items-start gap-2">
            <i class="fas fa-times text-red-500 mt-1"></i>
            <span>{$t.api.dontMakeExcessiveRequests}</span>
          </li>
        </ul>
      </div>
    </div>
  {/snippet}
</Section>
