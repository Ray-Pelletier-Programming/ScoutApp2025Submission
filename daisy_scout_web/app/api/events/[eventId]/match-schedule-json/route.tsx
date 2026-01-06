//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { getFrcApiEventSchedule } from '@/app/(public)/event-schedule/event-schedule-actions';
import { matchTypes } from '@/app/ui/constants/match-type';
import { getEventMatchesWithTeamsForEvent } from '@/db/queries/match-schedule-queries';
import { isPublicCloud } from '@/util/envHelper';
import { NextRequest, NextResponse } from 'next/server';

// written for compatibility with FRC API to pull data to tablets or surfaces computers...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  // if public cloud, use fallback to FRC API if first time pulling event

  if (isPublicCloud) {
    const results = await getEventMatchesWithTeamsForEvent({
      eventId,
      matchType: matchTypes.qual,
    });

    if (results && results.length > 0) {
      return NextResponse.json(results);
    }

    // no schedule found, so attempt to pull from the FRC API
    const season = eventId.substring(0, 4);
    const eventCode = eventId.substring(4);
    const gotData = await getFrcApiEventSchedule(season, eventCode);

    if (!gotData) {
      console.log('No schedule found in FRC API');
      return NextResponse.json([]);
    }
  }

  // always return what we have in the database...
  return NextResponse.json(
    await getEventMatchesWithTeamsForEvent({
      eventId,
      matchType: matchTypes.qual,
    })
  );
}
