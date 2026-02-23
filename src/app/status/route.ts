import { NextResponse } from 'next/server';
import { noStoreHeaders } from '@/lib/utils/apiHeaders';

export const dynamic = 'force-dynamic';

export async function GET() {
  const body = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime ? process.uptime() : null,
    version: '1.0.0',
  };
  return NextResponse.json(body, { headers: noStoreHeaders() });
}
