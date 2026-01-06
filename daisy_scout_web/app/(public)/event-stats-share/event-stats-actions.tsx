'use server';

import { getSharableMatchDataFor2025Event } from '@/db/queries/match-2025-data-queries';

export async function get2025SharableMatchDataFor2025Event(
  event_Id: string,
  matchType: string
) {
  return getSharableMatchDataFor2025Event({
    eventId: event_Id,
    matchType: matchType,
  });
}
