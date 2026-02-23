import { NextRequest, NextResponse } from 'next/server';
import { getApp, normalizeLanguage } from '@/lib/services/dataService';
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

    return NextResponse.json(
      {
        success: true,
        language: lang,
        appName: app.name,
        count: app.versions.length,
        data: app.versions,
      },
      { headers: noStoreHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load app versions' },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
