import { NextRequest, NextResponse } from 'next/server';
import { getAllNews, normalizeLanguage } from '@/lib/services/dataService';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const appId = searchParams.get('appId');
    const lang = normalizeLanguage(searchParams.get('lang'));

    let news = await getAllNews(lang);
    if (appId) {
      news = news.filter((item) => item.appID === appId);
    }
    news = news.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!Number.isNaN(limitNum) && limitNum > 0) {
        news = news.slice(0, limitNum);
      }
    }

    return NextResponse.json(
      {
        success: true,
        language: lang,
        count: news.length,
        data: news,
      },
      { headers: noStoreHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load news' },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
