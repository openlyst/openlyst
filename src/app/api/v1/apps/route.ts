import { NextRequest, NextResponse } from 'next/server';
import {
  getAllApps,
  getActiveApps,
  getDeprecatedApps,
  nameToSlug,
  normalizeLanguage,
} from '@/lib/services/dataService';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');
    const platform = searchParams.get('platform');
    const lang = normalizeLanguage(searchParams.get('lang'));

    let apps;
    switch (filter) {
      case 'active':
        apps = await getActiveApps(lang);
        break;
      case 'deprecated':
        apps = await getDeprecatedApps(lang);
        break;
      default:
        apps = await getAllApps(lang);
    }

    if (platform) {
      apps = apps.filter((app) =>
        app.platforms.some((p) => p.toLowerCase() === platform.toLowerCase())
      );
    }

    const transformedApps = apps.map((app) => ({
      ...app,
      slug: nameToSlug(app.name),
    }));

    return NextResponse.json(
      {
        success: true,
        count: transformedApps.length,
        language: lang,
        data: transformedApps,
      },
      { headers: noStoreHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load apps' },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
