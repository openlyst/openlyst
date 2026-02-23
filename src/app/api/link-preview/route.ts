import { NextRequest, NextResponse } from 'next/server';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

export const dynamic = 'force-dynamic';

const VALID_PROTOCOLS = ['https:', 'http:'];

function isValidUrl(input: string): boolean {
  try {
    const u = new URL(input);
    return VALID_PROTOCOLS.includes(u.protocol) && (u.hostname === 'localhost' || !u.hostname.startsWith('127.'));
  } catch {
    return false;
  }
}

function extractMeta(html: string): { title?: string; description?: string; image?: string; siteName?: string } {
  const result: { title?: string; description?: string; image?: string; siteName?: string } = {};
  const ogTitle =
    html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i);
  if (ogTitle) result.title = ogTitle[1].trim();

  const ogDesc =
    html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:description["']/i);
  if (ogDesc) result.description = ogDesc[1].trim();

  const ogImage =
    html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
  if (ogImage) result.image = ogImage[1].trim();

  const ogSite =
    html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:site_name["']/i);
  if (ogSite) result.siteName = ogSite[1].trim();

  if (!result.title) {
    const titleTag = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleTag) result.title = titleTag[1].trim();
  }
  return result;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('url');
  if (!target || !isValidUrl(target)) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing url parameter' },
      { status: 400, headers: noStoreHeaders() }
    );
  }

  try {
    const res = await fetch(target, {
      headers: { 'User-Agent': 'Openlyst-LinkPreview/1.0' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `Failed to fetch: ${res.status}` },
        { status: 502, headers: noStoreHeaders() }
      );
    }
    const html = await res.text();
    const meta = extractMeta(html);
    let imageUrl: string | null = meta.image || null;
    if (imageUrl && imageUrl.startsWith('/')) {
      try {
        const base = new URL(target);
        imageUrl = new URL(imageUrl, base.origin).href;
      } catch {
        imageUrl = meta.image || null;
      }
    }
    return NextResponse.json(
      {
        success: true,
        url: target,
        title: meta.title || null,
        description: meta.description || null,
        image: imageUrl,
        siteName: meta.siteName || null,
      },
      { headers: noStoreHeaders() }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 502, headers: noStoreHeaders() }
    );
  }
}
