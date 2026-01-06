//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { matchTypes } from '@/app/ui/constants/match-type';
import { getLeaderDataFor2024Event } from '@/db/queries/leader-2024-queries';
import { getLeaderDataFor2025Event } from '@/db/queries/leader-2025-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  switch (eventId.substring(0, 4)) {
    case '2025':
      return NextResponse.json(
        await getLeaderDataFor2025Event(eventId, matchTypes.qual)
      );
    case '2024':
      return NextResponse.json(await getLeaderDataFor2024Event(eventId));
    default:
      return NextResponse.json(
        { error: `Season not supported... ${eventId.substring(0, 4)}` },
        { status: 400 }
      );
  }
}
