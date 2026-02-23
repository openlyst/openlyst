import { NextRequest, NextResponse } from 'next/server';
import { getAllApps, normalizeLanguage } from '@/lib/services/dataService';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = normalizeLanguage(searchParams.get('lang'));
    const allApps = await getAllApps(lang);

    const platformSet = new Set<string>();
    allApps.forEach((app) => {
      app.platforms.forEach((platform) => platformSet.add(platform));
    });

    const platformCounts: Record<string, number> = {};
    platformSet.forEach((platform) => {
      platformCounts[platform] = allApps.filter((app) => app.platforms.includes(platform)).length;
    });

    const platforms = Array.from(platformSet).map((platform) => ({
      name: platform,
      appCount: platformCounts[platform],
    }));
    platforms.sort((a, b) => b.appCount - a.appCount);

    return NextResponse.json(
      {
        success: true,
        language: lang,
        count: platforms.length,
        data: platforms,
      },
      { headers: noStoreHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load platforms' },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
