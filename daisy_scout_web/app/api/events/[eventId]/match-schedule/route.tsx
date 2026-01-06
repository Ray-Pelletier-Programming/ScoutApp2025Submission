//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { matchTypes } from '@/app/ui/constants/match-type';
import { getEventMatchesForEvent } from '@/db/queries/match-schedule-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  return NextResponse.json(
    await getEventMatchesForEvent({ eventId, matchType: matchTypes.qual })
  );
}
