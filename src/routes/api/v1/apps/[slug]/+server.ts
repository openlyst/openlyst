import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getApp, nameToSlug } from '$lib/utils/repo';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { slug } = params;
    const app = await getApp(slug);
    
    if (!app) {
      return json({ success: false, error: 'App not found' }, { status: 404 });
    }
    
    return json({
      success: true,
      data: {
        ...app,
        slug: nameToSlug(app.name)
      }
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load app' }, { status: 500 });
  }
};
