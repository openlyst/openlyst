<script lang="ts">
  import { Section } from '$lib';
  import { t } from '$lib/stores/language';
  
  let copiedAddress: string | null = $state(null);
  
  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    copiedAddress = id;
    setTimeout(() => {
      copiedAddress = null;
    }, 2000);
  }
  
  const cryptoAddresses = {
    btc: '',
    xmr: '4Ah4JgyvAXtJ2a5wgGUS3bBeXPMciJo62NMwZ7cY11xF3ok9tfwvhoF2hE8hiSmfdf1yGDpFD8NrcVEk5iFsonWcBCcRdAh',
    etc: ''
  };
</script>

<svelte:head>
  <title>{$t.support.title} - OpenLyst</title>
  <meta name="description" content={$t.support.subtitle} />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

<!-- Hero Section -->
<section class="bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 text-white py-20">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6">
        <i class="fas fa-heart text-pink-200"></i>
        <span class="text-amber-100 font-medium">{$t.support.openSource}</span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
        {$t.support.title}
      </h1>
      <p class="text-xl text-amber-100 max-w-2xl mx-auto mb-8">
        {$t.support.subtitle}
      </p>
    </div>
  </div>
</section>

<!-- Why Support Section -->
<Section title={$t.support.whySupport} subtitle={$t.support.whySupportDesc} background="default">
  {#snippet children()}
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      <div class="glass-card rounded-xl p-6 text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
          <i class="fas fa-server text-2xl text-white"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.support.serverCosts}</h3>
        <p class="text-gray-400">{$t.support.serverCostsDesc}</p>
      </div>
      
      <div class="glass-card rounded-xl p-6 text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
          <i class="fas fa-code text-2xl text-white"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.support.development}</h3>
        <p class="text-gray-400">{$t.support.developmentDesc}</p>
      </div>
      
      <div class="glass-card rounded-xl p-6 text-center">
        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
          <i class="fas fa-users text-2xl text-white"></i>
        </div>
        <h3 class="text-xl font-semibold text-white mb-2">{$t.support.community}</h3>
        <p class="text-gray-400">{$t.support.communityDesc}</p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Cryptocurrency Donations -->
<Section title={$t.support.cryptoDonations} subtitle={$t.support.cryptoDonationsDesc} background="gray">
  {#snippet children()}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <!-- Bitcoin -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-orange-500/50 transition-colors">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <i class="fab fa-bitcoin text-3xl text-white"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Bitcoin</h3>
            <span class="text-orange-400 font-mono text-sm">BTC</span>
          </div>
          <div class="ml-auto">
            <span class="px-3 py-1 bg-orange-900/50 text-orange-300 text-sm rounded-full font-medium">
              1 {$t.support.donation}
            </span>
          </div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4">
          <code class="text-orange-400 text-xs break-all font-mono">{cryptoAddresses.btc}</code>
        </div>
        <button 
          class="mt-4 w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          onclick={() => copyToClipboard(cryptoAddresses.btc, 'btc')}
        >
          <i class="fas fa-copy"></i>
          {copiedAddress === 'btc' ? $t.support.copied : $t.support.copyAddress}
        </button>
      </div>
      
      <!-- Monero -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-orange-500/50 transition-colors">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span class="text-2xl font-bold text-white">ɱ</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Monero</h3>
            <span class="text-orange-400 font-mono text-sm">XMR</span>
          </div>
          <div class="ml-auto">
            <span class="px-3 py-1 bg-orange-900/50 text-orange-300 text-sm rounded-full font-medium">
              1 {$t.support.donation}
            </span>
          </div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4">
          <code class="text-orange-400 text-xs break-all font-mono">{cryptoAddresses.xmr}</code>
        </div>
        <button 
          class="mt-4 w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          onclick={() => copyToClipboard(cryptoAddresses.xmr, 'xmr')}
        >
          <i class="fas fa-copy"></i>
          {copiedAddress === 'xmr' ? $t.support.copied : $t.support.copyAddress}
        </button>
      </div>
      
      <!-- Ethereum Classic -->
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-emerald-500/50 transition-colors">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <i class="fab fa-ethereum text-3xl text-white"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Ethereum Classic</h3>
            <span class="text-emerald-400 font-mono text-sm">ETC</span>
          </div>
          <div class="ml-auto">
            <span class="px-3 py-1 bg-emerald-900/50 text-emerald-300 text-sm rounded-full font-medium">
              1 {$t.support.donation}
            </span>
          </div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4">
          <code class="text-emerald-400 text-xs break-all font-mono">{cryptoAddresses.etc}</code>
        </div>
        <button 
          class="mt-4 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          onclick={() => copyToClipboard(cryptoAddresses.etc, 'etc')}
        >
          <i class="fas fa-copy"></i>
          {copiedAddress === 'etc' ? $t.support.copied : $t.support.copyAddress}
        </button>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Robux Donations -->
<Section title={$t.support.robuxDonations} subtitle={$t.support.robuxDonationsDesc} background="default">
  {#snippet children()}
    <div class="max-w-2xl mx-auto">
      <div class="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-2xl border border-red-500/30 p-8 text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <span class="text-4xl">🎮</span>
        </div>
        <h3 class="text-3xl font-bold text-white mb-2">Robux</h3>
        <p class="text-red-100 mb-6">{$t.support.robuxDesc}</p>
        
        <div class="bg-red-900/50 rounded-xl p-6 mb-6">
          <div class="flex items-center justify-center gap-4">
            <div class="text-center">
              <div class="text-5xl font-bold text-white mb-1">14</div>
              <div class="text-red-200 text-sm">{$t.support.totalDonations}</div>
            </div>
            <div class="w-px h-16 bg-red-400/30"></div>
            <div class="text-center">
              <div class="text-5xl font-bold text-yellow-400 mb-1">R$</div>
              <div class="text-red-200 text-sm">Robux</div>
            </div>
          </div>
        </div>
        
        <a 
          href="https://www.roblox.com/games" 
          target="_blank" 
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-lg"
        >
          <span class="text-xl">🎁</span>
          {$t.support.donateRobux}
        </a>
        
        <p class="mt-4 text-red-200 text-sm">
          {$t.support.robuxNote}
        </p>
      </div>
    </div>
  {/snippet}
</Section>

<!-- Thank You Section -->
<Section title={$t.support.thankYou} subtitle={$t.support.thankYouDesc} background="red" centered={true}>
  {#snippet children()}
    <div class="text-center mt-8">
      <div class="text-6xl mb-6">💖</div>
      <p class="text-xl text-red-100 max-w-2xl mx-auto mb-8">
        {$t.support.everyBitHelps}
      </p>
      <div class="flex flex-wrap justify-center gap-4">
        <a 
          href="/contribute" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
        >
          <i class="fas fa-code"></i>
          {$t.support.contributeCode}
        </a>
        <a 
          href="/apps" 
          class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
        >
          <i class="fas fa-download"></i>
          {$t.support.useOurApps}
        </a>
      </div>
    </div>
  {/snippet}
</Section>
