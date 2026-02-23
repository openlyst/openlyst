import { NextRequest, NextResponse } from 'next/server';
import { getApp, nameToSlug, normalizeLanguage } from '@/lib/services/dataService';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

export const dynamic = 'force-dynamic';

type Params = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = normalizeLanguage(searchParams.get('lang'));
    const app = await getApp(slug, lang);

    if (!app) {
      return NextResponse.json(
        { success: false, error: 'App not found' },
        { status: 404, headers: noStoreHeaders() }
      );
    }

    if (app.versions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No versions available' },
        { status: 404, headers: noStoreHeaders() }
      );
    }

    const latestVersion = app.versions[0];

    return NextResponse.json(
      {
        success: true,
        language: lang,
        appName: app.name,
        appSlug: nameToSlug(app.name),
        data: latestVersion,
      },
      { headers: noStoreHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load latest version' },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
