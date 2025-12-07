import { getActiveApps, loadRepoConfig } from '$lib/utils/repo';

export const load = async () => {
  const [apps, config] = await Promise.all([
    getActiveApps(),
    loadRepoConfig()
  ]);
  
  // Get featured apps based on the featuredApps array in config (only non-deprecated)
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