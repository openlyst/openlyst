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
    
    if (app.versions.length === 0) {
      return json({ success: false, error: 'No versions available' }, { status: 404 });
    }
    
    const latestVersion = app.versions[0];
    
    return json({
      success: true,
      appName: app.name,
      appSlug: nameToSlug(app.name),
      data: latestVersion
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load latest version' }, { status: 500 });
  }
};
