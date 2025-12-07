import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getApp } from '$lib/utils/repo';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const { slug } = params;
    const app = await getApp(slug);
    
    if (!app) {
      return json({ success: false, error: 'App not found' }, { status: 404 });
    }
    
    return json({
      success: true,
      appName: app.name,
      count: app.versions.length,
      data: app.versions
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load app versions' }, { status: 500 });
  }
};
