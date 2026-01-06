//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { matchTypes } from '@/app/ui/constants/match-type';
import { getMatchDataFor2024Event } from '@/db/queries/match-2024-data-queries';
import { getMatchDataFor2025Event } from '@/db/queries/match-2025-data-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  switch (eventId.substring(0, 4)) {
    case '2025':
      return NextResponse.json(
        await getMatchDataFor2025Event({ eventId, matchType: matchTypes.qual })
      );
    case '2024':
      return NextResponse.json(await getMatchDataFor2024Event({ eventId }));
    default:
      return NextResponse.json(
        { error: `Season not supported... ${eventId.substring(0, 4)}` },
        { status: 400 }
      );
  }
}
