import { getAllApps, loadRepoConfig } from '$lib/utils/repo';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const [apps, config] = await Promise.all([
    getAllApps(),
    loadRepoConfig()
  ]);
  
  // Get featured apps based on the featuredApps array in config
  const featuredApps = config.featuredApps
    .map(featuredId => apps.find(app => 
      app.bundleIdentifier === featuredId || 
      app.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === featuredId
    ))
    .filter(Boolean); // Remove any undefined apps
  
  return {
    apps,
    featuredApps,
    config
  };
};