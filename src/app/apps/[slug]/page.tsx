import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getApp, loadConfig } from '@/lib/services/dataService';
import { AppDetailContent } from '@/components/AppDetailContent';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await getApp(slug);
  if (!app) return { title: 'App Not Found' };
  const latestVersion = app.versions[0];
  const platformsText = app.platforms.join(', ');
  const cleanDescription = app.localizedDescription
    .replace(/[#*_`~\[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200);
  const metaDescription = `${cleanDescription}${cleanDescription.length >= 200 ? '...' : ''} • Platforms: ${platformsText}`;

  return {
    title: `${app.name} - Openlyst`,
    description: metaDescription,
    openGraph: {
      title: `${app.name} - Openlyst`,
      description: metaDescription,
      images: [app.iconURL],
      url: `https://openlyst.ink/apps/${slug}`,
      siteName: 'Openlyst',
    },
  };
}

export default async function AppSlugPage({ params }: Props) {
  const { slug } = await params;
  const [app, config] = await Promise.all([getApp(slug), loadConfig()]);

  if (!app) notFound();

  const tempDownloadsOff = config?.tempDownloadsOff ?? false;

  return <AppDetailContent app={app} tempDownloadsOff={tempDownloadsOff} />;
}
