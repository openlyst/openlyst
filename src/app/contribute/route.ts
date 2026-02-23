import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.redirect('https://gitlab.com/Openlyst/', 308);
}
