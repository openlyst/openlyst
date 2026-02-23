'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Section } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';

const cryptoAddresses = {
  btc: 'bc1qfq57dqfkawnwdvdczcyx20gqzqre8q2jhcq2qv',
  xmr: '4Ah4JgyvAXtJ2a5wgGUS3bBeXPMciJo62NMwZ7cY11xF3ok9tfwvhoF2hE8hiSmfdf1yGDpFD8NrcVEk5iFsonWcBCcRdAh',
  etc: '0x85e045778Cac44fa0ba2cE88C1D1B8464Be83fAf',
};

export function SupportContent() {
  const { t } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass-card rounded-full mb-6">
              <span className="text-pink-400">❤</span>
              <span className="text-purple-200 font-medium">{t.support.openSource}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              {t.support.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">{t.support.subtitle}</p>
          </div>
        </div>
      </section>

      <Section title={t.support.whySupport} subtitle={t.support.whySupportDesc} background="default">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
              <span className="text-2xl text-white">🖥</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.support.serverCosts}</h3>
            <p className="text-gray-400">{t.support.serverCostsDesc}</p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <span className="text-2xl text-white">💻</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.support.development}</h3>
            <p className="text-gray-400">{t.support.developmentDesc}</p>
          </div>
          <div className="glass-card rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/30">
              <span className="text-2xl text-white">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t.support.community}</h3>
            <p className="text-gray-400">{t.support.communityDesc}</p>
          </div>
        </div>
      </Section>

      <Section title={t.support.cryptoDonations} subtitle={t.support.cryptoDonationsDesc} background="gray">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">₿</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Bitcoin</h3>
                <span className="text-orange-400 font-mono text-sm">BTC</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 flex-grow">
              <code className="text-orange-400 text-xs break-all font-mono">{cryptoAddresses.btc}</code>
            </div>
            <button
              type="button"
              className="mt-4 w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
              onClick={() => copyToClipboard(cryptoAddresses.btc, 'btc')}
            >
              {copiedId === 'btc' ? t.support.copied : t.support.copyAddress}
            </button>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">ɱ</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Monero</h3>
                <span className="text-orange-400 font-mono text-sm">XMR</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 flex-grow">
              <code className="text-orange-400 text-xs break-all font-mono">{cryptoAddresses.xmr}</code>
            </div>
            <button
              type="button"
              className="mt-4 w-full px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition-colors"
              onClick={() => copyToClipboard(cryptoAddresses.xmr, 'xmr')}
            >
              {copiedId === 'xmr' ? t.support.copied : t.support.copyAddress}
            </button>
          </div>
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 flex flex-col h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">Ξ</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Ethereum Classic</h3>
                <span className="text-emerald-400 font-mono text-sm">ETC</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4 flex-grow">
              <code className="text-emerald-400 text-xs break-all font-mono">{cryptoAddresses.etc}</code>
            </div>
            <button
              type="button"
              className="mt-4 w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
              onClick={() => copyToClipboard(cryptoAddresses.etc, 'etc')}
            >
              {copiedId === 'etc' ? t.support.copied : t.support.copyAddress}
            </button>
          </div>
        </div>
      </Section>

      <Section title={t.support.thankYou} subtitle={t.support.thankYouDesc} background="red" centered>
        <div className="text-center mt-8">
          <div className="text-6xl mb-6">💖</div>
          <p className="text-xl text-red-100 max-w-2xl mx-auto mb-8">{t.support.everyBitHelps}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://gitlab.com/Openlyst/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              {t.support.contributeCode}
            </a>
            <Link
              href="/apps"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
            >
              {t.support.useOurApps}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
