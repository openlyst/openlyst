import { getActiveApps, getRepoConfig, getAllNews, nameToSlug } from '@/lib/services/dataService';
import { HomePage } from '@/components/HomePage';
import type { App, NewsItem, RepoConfig } from '@/lib/types/repo';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [apps, config, news] = await Promise.all([
    getActiveApps(),
    getRepoConfig(),
    getAllNews(),
  ]);
  const featuredApps = (config.featuredApps || [])
    .map((featuredId: string) =>
      apps.find(
        (app: App) =>
          app.bundleIdentifier === featuredId || nameToSlug(app.name) === featuredId
      )
    )
    .filter(Boolean) as App[];

  const initialData = {
    apps,
    featuredApps,
    config,
    news,
  };

  return <HomePage initialData={initialData} />;
}
