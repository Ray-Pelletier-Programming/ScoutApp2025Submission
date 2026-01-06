//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { pullFrcEventWithTeamsFromApi } from '@/app/(admin)/settings/settings-actions';
import { getEventById } from '@/db/queries/event-queries';
import { getEventTeams } from '@/db/queries/event-team-queries';
import { isPublicCloud } from '@/util/envHelper';
import { NextRequest, NextResponse } from 'next/server';

// rewriting to support getting an event and teams by the surface computers...
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  //Original implementation; believe unused...
  //return NextResponse.json(await getEventById(eventId));

  // if public cloud, use fallback to FRC API if first time pulling event

  let results = await getEventById(eventId);

  if (isPublicCloud) {
    if (!results || results.length == 0) {
      // no schedule found, so attempt to pull from the FRC API
      const season = eventId.substring(0, 4);
      const eventCode = eventId.substring(4);
      const gotData = await pullFrcEventWithTeamsFromApi(season, eventCode);

      if (!gotData) {
        console.log('Event not found in FRC API');
        return NextResponse.json([]);
      }
      results = await getEventById(eventId);
    }
  }

  if (!results || results.length == 0) {
    console.log('Event not found in database');
    return NextResponse.json([]);
  }

  const teams = await getEventTeams(eventId);

  results[0].teams = teams.map((team) => {
    return {
      eventId: eventId,
      teamNumber: team.teamNumber,
    };
  });

  // always return what we have in the database...
  return NextResponse.json(results[0]);
}
