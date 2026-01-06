'use server';

import { getMatchDataFor2024Event } from '@/db/queries/match-2024-data-queries';
import { getMatchDataFor2025Event } from '@/db/queries/match-2025-data-queries';

export async function getMatch2024DataForEvent(event_id: string) {
  return getMatchDataFor2024Event({ eventId: event_id });
}

export async function getMatch2025DataForEvent(
  event_id: string,
  matchType: string
) {
  const data = await getMatchDataFor2025Event({
    eventId: event_id,
    matchType: matchType,
  });
  return data.sort((a, b) => {
    // Sort by matchType (ascending)
    if (a.matchType < b.matchType) return -1;
    if (a.matchType > b.matchType) return 1;

    // Sort by MatchNumber (descending)
    if (a.matchNumber > b.matchNumber) return -1;
    if (a.matchNumber < b.matchNumber) return 1;

    // Sort by AllianceColor (ascending)
    if (a.allianceColor < b.allianceColor) return -1;
    if (a.allianceColor > b.allianceColor) return 1;

    // Sort by AlliancePosition (ascending)
    return a.alliancePosition - b.alliancePosition;
  });
}
