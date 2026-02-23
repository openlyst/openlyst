'use client';

import { Section, Button } from '@/components';
import { useLanguage } from '@/lib/contexts/LanguageContext';

export function AboutContent() {
  const { t } = useLanguage();
  return (
    <>
      <section className="relative text-white overflow-hidden min-h-[60vh] flex items-center">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:py-32 sm:px-6 lg:px-8 text-center">
          <div className="glass-card w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border-purple-500/30">
            <span className="text-purple-400 font-bold text-4xl">★</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            {t.about.title}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">{t.about.subtitle}</p>
        </div>
      </section>

      <Section title={t.about.ourMission} subtitle={t.about.missionDesc}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">{t.about.powerToThePeople}</h3>
            <p className="text-gray-400 mb-6">{t.about.powerDesc}</p>
            <ul className="space-y-3">
              {[t.about.noTracking, t.about.transparentDev, t.about.communityDrivenFeatures, t.about.freeForever].map((item) => (
                <li key={item} className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                  <span className="text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 border border-red-900">
            <blockquote className="text-lg text-gray-200 italic mb-4">{t.about.quoteAudre}</blockquote>
            <cite className="text-red-600 font-semibold">{t.about.quoteAudreAuthor}</cite>
            <div className="mt-6 p-4 bg-gray-900 rounded border border-red-800">
              <p className="text-sm text-gray-400">{t.about.quoteNote}</p>
            </div>
          </div>
        </div>
      </Section>

      <Section title={t.about.ourValues} subtitle={t.about.valuesDesc} background="default">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: t.about.privacyFirst, desc: t.about.privacyFirstDesc },
            { title: t.about.communityDriven, desc: t.about.communityDrivenDesc },
            { title: t.about.transparency, desc: t.about.transparencyDesc },
            { title: t.about.accessibility, desc: t.about.accessibilityDesc },
            { title: t.about.performance, desc: t.about.performanceDesc },
            { title: t.about.sustainability, desc: t.about.sustainabilityDesc },
          ].map(({ title, desc }) => (
            <div key={title} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-red-900">
              <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={t.about.ourStory} subtitle={t.about.ourStoryDesc} background="red">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">{t.about.theBeginning}</h3>
            <p className="text-red-100">{t.about.beginningDesc}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">{t.about.growingMovement}</h3>
            <p className="text-red-100">{t.about.growingDesc}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-3">{t.about.revolutionarySoftware}</h3>
            <p className="text-red-100">{t.about.revolutionaryDesc}</p>
          </div>
        </div>
      </Section>

      <Section title={t.about.theCollective} subtitle={t.about.collectiveDesc}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { emoji: '👩‍💻', title: t.about.coreDevelopers, sub: t.about.coreDevelopersSubtitle, desc: t.about.coreDevelopersDesc },
            { emoji: '🎨', title: t.about.designers, sub: t.about.designersSubtitle, desc: t.about.designersDesc },
            { emoji: '🔒', title: t.about.securityExperts, sub: t.about.securityExpertsSubtitle, desc: t.about.securityExpertsDesc },
            { emoji: '📝', title: t.about.documentationTeam, sub: t.about.documentationTeamSubtitle, desc: t.about.documentationTeamDesc },
            { emoji: '🌍', title: t.about.translators, sub: t.about.translatorsSubtitle, desc: t.about.translatorsDesc },
            { emoji: '💬', title: t.about.communityTeam, sub: t.about.communityTeamSubtitle, desc: t.about.communityTeamDesc },
          ].map(({ emoji, title, sub, desc }) => (
            <div key={title} className="text-center">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">{emoji}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
              <p className="text-gray-400 text-sm mb-3">{sub}</p>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">{t.about.joinCollective}</p>
          <Button text={t.about.joinRevolution} href="https://gitlab.com/Openlyst/" variant="primary" size="lg" />
        </div>
      </Section>
    </>
  );
}
