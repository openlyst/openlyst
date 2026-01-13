import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getApp, normalizeLanguage } from '$lib/services/dataService';

export const GET: RequestHandler = async ({ params, url }) => {
  try {
    const { slug } = params;
    const lang = normalizeLanguage(url.searchParams.get('lang'));
    const app = await getApp(slug, lang);
    
    if (!app) {
      return json({ success: false, error: 'App not found' }, { status: 404 });
    }
    
    return json({
      success: true,
      language: lang,
      appName: app.name,
      count: app.versions.length,
      data: app.versions
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load app versions' }, { status: 500 });
  }
};
