import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { loadRepoConfig } from '$lib/utils/repo';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const config = await loadRepoConfig();
    const limit = url.searchParams.get('limit');
    const appId = url.searchParams.get('appId');
    
    let news = config.news;
    
    // Filter by app ID if specified
    if (appId) {
      news = news.filter(item => item.appID === appId);
    }
    
    // Sort by date (newest first)
    news = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        news = news.slice(0, limitNum);
      }
    }
    
    return json({
      success: true,
      count: news.length,
      data: news
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load news' }, { status: 500 });
  }
};
