import { getEventsForSeason } from '@/db/queries/event-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ season: number }> }
) {
  const { season } = await params;

  return NextResponse.json(await getEventsForSeason(season));
}
