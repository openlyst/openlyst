import { error } from '@sveltejs/kit';
import { getApp, loadConfig } from '$lib/services/dataService';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
  const [app, config] = await Promise.all([getApp(params.slug), loadConfig()]);
  
  if (!app) {
    throw error(404, 'App not found');
  }

  const latestVersion = app.versions[0];
  const siteUrl = url.origin;
  const appUrl = `${siteUrl}/apps/${params.slug}`;

  // Build platform info string
  const platformsText = app.platforms.join(', ');
  
  // Build download links info for description
  let downloadInfo = '';
  if (latestVersion) {
    const availablePlatforms: string[] = [];
    
    // Check which platforms have downloads
    if (latestVersion.downloads) {
      for (const platform of app.platforms) {
        const download = (latestVersion.downloads as Record<string, unknown>)[platform];
        if (download) {
          availablePlatforms.push(platform);
        }
      }
    } else if (latestVersion.downloadURLs) {
      for (const platform of app.platforms) {
        const download = (latestVersion.downloadURLs as Record<string, string>)[platform];
        if (download) {
          availablePlatforms.push(platform);
        }
      }
    }
    
    if (availablePlatforms.length > 0) {
      downloadInfo = ` • Download for ${availablePlatforms.join(', ')}`;
    }
  }

  // Create a clean description (strip markdown and limit length)
  const cleanDescription = app.localizedDescription
    .replace(/[#*_`~\[\]]/g, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, 200);

  const metaDescription = `${cleanDescription}${cleanDescription.length >= 200 ? '...' : ''} • Platforms: ${platformsText}${downloadInfo}`;

  return {
    app,
    tempDownloadsOff: config.tempDownloadsOff ?? false,
    meta: {
      title: `${app.name} - Openlyst`,
      description: metaDescription,
      image: app.iconURL,
      url: appUrl,
      siteName: 'Openlyst',
      platforms: platformsText,
      version: latestVersion?.version || '',
      subtitle: app.subtitle,
      tintColor: app.tintColor
    }
  };
};
