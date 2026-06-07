'use client';

import { useState } from 'react';
import { Section } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import type { RepositoryEntry } from '@/lib/types/repo';
import type { SupportedLanguage } from '@/lib/services/dataService';

interface ReposContentProps {
  reposByLang: Record<SupportedLanguage, RepositoryEntry[]>;
}

export function ReposContent({ reposByLang }: ReposContentProps) {
  const { language, t } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const repos = reposByLang[language] ?? reposByLang.en;

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const reposT = t.repos as Record<string, string> | undefined;
  const title = reposT?.title ?? 'Repositories';
  const subtitle = reposT?.subtitle ?? 'Add these repository URLs to AltStore or Openlyst to install our apps.';
  const copyUrl = reposT?.copyUrl ?? 'Copy URL';
  const copied = reposT?.copied ?? 'Copied!';
  const addToAltStore = reposT?.addToAltStore ?? 'Add to AltStore';
  const typeAltstore = reposT?.typeAltstore ?? 'AltStore';
  const sectionTitle = reposT?.sectionTitle ?? 'Available repositories';

  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[40vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">{subtitle}</p>
          </div>
        </div>
      </section>

      <Section title={sectionTitle} background="default" centered>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="glass-card rounded-xl p-6 border border-white/10 flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xl font-semibold text-white">{repo.name}</h3>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-500/30 text-purple-200">
                  {repo.type === 'altstore' ? typeAltstore : repo.type}
                </span>
              </div>
              {repo.description && (
                <p className="text-gray-400 text-sm mb-3 flex-grow">{repo.description}</p>
              )}
              <p className="text-gray-500 text-xs font-mono break-all mb-4 bg-black/20 rounded px-2 py-1.5">
                {repo.url}
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
                  onClick={() => copyToClipboard(repo.url, repo.id)}
                >
                  {copiedId === repo.id ? copied : copyUrl}
                </button>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-gray-300 text-sm font-medium transition-colors"
                >
                  {addToAltStore}
                </a>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
