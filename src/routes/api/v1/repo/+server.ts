import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getRepoConfig, resolveUrl, normalizeLanguage } from '$lib/services/dataService';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const lang = normalizeLanguage(url.searchParams.get('lang'));
    const config = await getRepoConfig(lang);
    
    return json({
      success: true,
      language: lang,
      data: {
        name: config.name,
        subtitle: config.subtitle,
        description: config.description,
        iconURL: resolveUrl(config.iconURL),
        headerURL: config.headerURL ? resolveUrl(config.headerURL) : undefined,
        website: config.website,
        tintColor: config.tintColor,
        featuredApps: config.featuredApps,
        totalApps: config.apps.length,
        totalNews: config.news.length,
        tempDownloadsOff: config.tempDownloadsOff
      }
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load repository data' }, { status: 500 });
  }
};
