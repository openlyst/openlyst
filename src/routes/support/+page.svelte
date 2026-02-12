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
    btc: 'bc1qfq57dqfkawnwdvdczcyx20gqzqre8q2jhcq2qv',
    xmr: '4Ah4JgyvAXtJ2a5wgGUS3bBeXPMciJo62NMwZ7cY11xF3ok9tfwvhoF2hE8hiSmfdf1yGDpFD8NrcVEk5iFsonWcBCcRdAh',
    etc: '0x85e045778Cac44fa0ba2cE88C1D1B8464Be83fAf'
  };
</script>

<svelte:head>
  <title>{$t.support.title} - OpenLyst</title>
  <meta name="description" content={$t.support.subtitle} />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
</svelte:head>

<!-- Hero Section -->
<section class="relative text-white overflow-hidden min-h-[60vh] flex items-center">
  <div class="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
    <div class="text-center">
      <div class="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6">
        <i class="fas fa-heart text-pink-400"></i>
        <span class="text-purple-200 font-medium">{$t.support.openSource}</span>
      </div>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
        {$t.support.title}
      </h1>
      <p class="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
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
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-orange-500/50 transition-colors flex flex-col h-full">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <i class="fab fa-bitcoin text-3xl text-white"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Bitcoin</h3>
            <span class="text-orange-400 font-mono text-sm">BTC</span>
          </div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4 flex-grow">
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
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-orange-500/50 transition-colors flex flex-col h-full">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
            <span class="text-2xl font-bold text-white">ɱ</span>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Monero</h3>
            <span class="text-orange-400 font-mono text-sm">XMR</span>
          </div>

        </div>
        <div class="bg-gray-900 rounded-lg p-4 flex-grow">
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
      <div class="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 hover:border-emerald-500/50 transition-colors flex flex-col h-full">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <i class="fab fa-ethereum text-3xl text-white"></i>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Ethereum Classic</h3>
            <span class="text-emerald-400 font-mono text-sm">ETC</span>
          </div>
        </div>
        <div class="bg-gray-900 rounded-lg p-4 flex-grow">
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
    <div class="text-center mb-8">
      <div class="inline-flex items-center gap-3 glass-card rounded-full px-6 py-3">
        <span class="text-3xl">🎮</span>
        <span class="text-2xl font-bold text-white">Robux</span>
        <span class="text-yellow-400 font-bold">R$</span>
      </div>
      <p class="text-gray-400 mt-4 max-w-xl mx-auto">{$t.support.robuxDesc}</p>
    </div>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {#each [
        { amount: 2, passId: '1669891372' },
        { amount: 10, passId: '1669885186' },
        { amount: 20, passId: '1669457807' },
        { amount: 50, passId: '1669859327' },
        { amount: 67, passId: '1669841286' },
        { amount: 100, passId: '1670027201' },
        { amount: 120, passId: '1670254535' },
        { amount: 200, passId: '1670045170' },
        { amount: 250, passId: '1670051194' },
        { amount: 500, passId: '1669967184' },
        { amount: 1000, passId: '1669819242' },
        { amount: 2, passId: '1670009098' },
        { amount: 5000, passId: '1670234550' },
        { amount: 10000, passId: '1669915209' }
      ] as pass}
        <a 
          href="https://www.roblox.com/game-pass/{pass.passId}"
          target="_blank"
          rel="noopener noreferrer"
          class="glass-card rounded-xl p-4 text-center hover:bg-white/10 transition-all hover:scale-105 group"
        >
          <div class="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">
            R${pass.amount.toLocaleString()}
          </div>
          <div class="text-xs text-gray-500 mt-1 font-mono truncate">
            #{pass.passId.slice(-6)}
          </div>
        </a>
      {/each}
    </div>
    
    <div class="text-center mt-8">
      <p class="text-gray-500 text-sm">
        {$t.support.robuxNote}
      </p>
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
          href="https://gitlab.com/Openlyst/" 
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
