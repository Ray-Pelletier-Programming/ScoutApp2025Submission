'use server';

import { getMatchAveragesFor2025Event } from '@/db/queries/match-2025-data-queries';

export async function get2025MatchAveragesForEvent(
  event_Id: string,
  matchType: string,
  lastNMatches?: number,
  allSeasonHistory?: boolean
) {
  return getMatchAveragesFor2025Event(
    event_Id,
    matchType,
    lastNMatches,
    allSeasonHistory
  );
}
