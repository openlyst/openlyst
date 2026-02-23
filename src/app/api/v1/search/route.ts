import { NextRequest, NextResponse } from 'next/server';
import { getAllApps, nameToSlug, normalizeLanguage } from '@/lib/services/dataService';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const lang = normalizeLanguage(searchParams.get('lang'));

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400, headers: noStoreHeaders() }
      );
    }

    const searchTerm = query.toLowerCase().trim();
    const allApps = await getAllApps(lang);

    const results = allApps.filter(
      (app) =>
        app.name.toLowerCase().includes(searchTerm) ||
        app.subtitle.toLowerCase().includes(searchTerm) ||
        app.localizedDescription.toLowerCase().includes(searchTerm) ||
        (app.bundleIdentifier && app.bundleIdentifier.toLowerCase().includes(searchTerm))
    );

    const transformedResults = results.map((app) => {
      let score = 0;
      if (app.name.toLowerCase().includes(searchTerm)) score += 10;
      if (app.name.toLowerCase() === searchTerm) score += 20;
      if (app.subtitle.toLowerCase().includes(searchTerm)) score += 5;
      if (app.localizedDescription.toLowerCase().includes(searchTerm)) score += 1;
      return {
        ...app,
        slug: nameToSlug(app.name),
        relevanceScore: score,
      };
    });
    transformedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return NextResponse.json(
      {
        success: true,
        query,
        language: lang,
        count: transformedResults.length,
        data: transformedResults,
      },
      { headers: noStoreHeaders() }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500, headers: noStoreHeaders() }
    );
  }
}
