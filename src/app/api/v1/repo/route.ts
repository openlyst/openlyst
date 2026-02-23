import { NextRequest, NextResponse } from 'next/server';
import { getRepoConfig, resolveUrl, normalizeLanguage } from '@/lib/services/dataService';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

const API_BASE_URL = 'https://openlyst.ink';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = normalizeLanguage(searchParams.get('lang'));
    const config = await getRepoConfig(lang);

    return NextResponse.json(
      {
        success: true,
        language: lang,
        data: {
          name: config.name,
          subtitle: config.subtitle,
          description: config.description,
          iconURL: resolveUrl(config.iconURL, API_BASE_URL),
          headerURL: config.headerURL ? resolveUrl(config.headerURL, API_BASE_URL) : undefined,
          website: config.website,
          tintColor: config.tintColor,
          featuredApps: config.featuredApps,
          totalApps: config.apps.length,
          totalNews: config.news.length,
          tempDownloadsOff: config.tempDownloadsOff,
        },
      },
      { headers: noStoreHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load repository data' },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
