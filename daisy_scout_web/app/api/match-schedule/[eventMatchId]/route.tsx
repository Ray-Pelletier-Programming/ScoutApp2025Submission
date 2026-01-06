//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { getEventMatch } from '@/db/queries/match-schedule-queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ eventMatchId: string }>;
  }
) {
  const { eventMatchId } = await params;

  return NextResponse.json(await getEventMatch(eventMatchId));
}
