import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllNews, normalizeLanguage } from '$lib/services/dataService';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const limit = url.searchParams.get('limit');
    const appId = url.searchParams.get('appId');
    const lang = normalizeLanguage(url.searchParams.get('lang'));
    
    let news = await getAllNews(lang);
    
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
      language: lang,
      count: news.length,
      data: news
    });
  } catch (error) {
    return json({ success: false, error: 'Failed to load news' }, { status: 500 });
  }
};
