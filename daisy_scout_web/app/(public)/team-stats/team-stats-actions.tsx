'use server';

import { getTeamPitDataFor2025Event } from '@/db/queries/pit-2025-data-queries';
import { getTeamLeaderDataFor2025Event } from '@/db/queries/leader-2025-queries';
import { getTeamMatchDataFor2025Event } from '@/db/queries/match-2025-data-queries';
import { isPublicCloud } from '@/util/envHelper';

export async function getTeam2025PitDataForEvent(
  event_Id: string,
  teamNumber: string
) {
  return getTeamPitDataFor2025Event(event_Id, parseInt(teamNumber));
}

export async function getTeam2025LeaderDataForEvent(
  event_Id: string,
  teamNumber: string,
  matchType: string
) {
  return getTeamLeaderDataFor2025Event(
    event_Id,
    parseInt(teamNumber),
    matchType
  );
}

export async function getTeam2025MatchDataForEvent(
  event_Id: string,
  teamNumber: string,
  matchType: string
) {
  return getTeamMatchDataFor2025Event(
    event_Id,
    parseInt(teamNumber),
    matchType
  );
}

export async function getIsPublicCloud(): Promise<boolean> {
  return isPublicCloud;
}
