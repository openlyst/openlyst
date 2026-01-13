import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getApp, nameToSlug, normalizeLanguage } from '$lib/services/dataService';

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
      data: {
        ...app,
        slug: nameToSlug(app.name)
      }
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load app' }, { status: 500 });
  }
};
