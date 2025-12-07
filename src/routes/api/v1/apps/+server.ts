import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllApps, getActiveApps, getDeprecatedApps, nameToSlug } from '$lib/utils/repo';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const filter = url.searchParams.get('filter'); // 'active', 'deprecated', or null for all
    const platform = url.searchParams.get('platform'); // Filter by platform
    
    let apps;
    
    switch (filter) {
      case 'active':
        apps = await getActiveApps();
        break;
      case 'deprecated':
        apps = await getDeprecatedApps();
        break;
      default:
        apps = await getAllApps();
    }
    
    // Filter by platform if specified
    if (platform) {
      apps = apps.filter(app => 
        app.platforms.some(p => p.toLowerCase() === platform.toLowerCase())
      );
    }
    
    // Transform apps to include slug
    const transformedApps = apps.map(app => ({
      ...app,
      slug: nameToSlug(app.name)
    }));
    
    return json({
      success: true,
      count: transformedApps.length,
      data: transformedApps
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load apps' }, { status: 500 });
  }
};
