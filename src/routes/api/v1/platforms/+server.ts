import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllApps, normalizeLanguage } from '$lib/services/dataService';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const lang = normalizeLanguage(url.searchParams.get('lang'));
    const allApps = await getAllApps(lang);
    
    // Collect all unique platforms
    const platformSet = new Set<string>();
    allApps.forEach(app => {
      app.platforms.forEach(platform => platformSet.add(platform));
    });
    
    // Count apps per platform
    const platformCounts: Record<string, number> = {};
    platformSet.forEach(platform => {
      platformCounts[platform] = allApps.filter(app => 
        app.platforms.includes(platform)
      ).length;
    });
    
    const platforms = Array.from(platformSet).map(platform => ({
      name: platform,
      appCount: platformCounts[platform]
    }));
    
    // Sort by app count (descending)
    platforms.sort((a, b) => b.appCount - a.appCount);
    
    return json({
      success: true,
      language: lang,
      count: platforms.length,
      data: platforms
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load platforms' }, { status: 500 });
  }
};
