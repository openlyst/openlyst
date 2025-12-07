import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadRepoConfig } from '$lib/utils/repo';

export const GET: RequestHandler = async () => {
  try {
    const config = await loadRepoConfig();
    
    return json({
      success: true,
      data: {
        name: config.name,
        subtitle: config.subtitle,
        description: config.description,
        iconURL: config.iconURL,
        headerURL: config.headerURL,
        website: config.website,
        tintColor: config.tintColor,
        featuredApps: config.featuredApps,
        totalApps: config.apps.length,
        totalNews: config.news.length
      }
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load repository data' }, { status: 500 });
  }
};
