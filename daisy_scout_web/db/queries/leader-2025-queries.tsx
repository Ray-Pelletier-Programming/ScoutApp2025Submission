//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq, and, sql } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectLeader2025Data,
  leader2025DataTable,
  InsertLeader2025Data,
  EventMatches2025TbaResult,
} from '@/db/schema';
import { Leader2025Data } from '../models/leader-2025-data';
import { TbaLeader2025Data } from '../models/tba-leader-2025-data';

/// Gets all the 2025 leader data for an event
export async function getLeaderDataFor2025Event(
  eventId: SelectLeader2025Data['eventId'],
  matchType: SelectLeader2025Data['matchType']
): Promise<Array<Leader2025Data>> {
  const query = await db
    .select({
      eventId: leader2025DataTable.eventId,
      matchType: leader2025DataTable.matchType,
      matchNumber: leader2025DataTable.matchNumber,
      source: leader2025DataTable.source,
      teamNumber: leader2025DataTable.teamNumber,
      scoutName: leader2025DataTable.scoutName,
      allianceColor: leader2025DataTable.allianceColor,
      alliancePosition: leader2025DataTable.alliancePosition,
      driverAbility: leader2025DataTable.driverAbility,
      sourceTime: leader2025DataTable.sourceTime,
      primaryRole: leader2025DataTable.primaryRole,
      netShotsMade: leader2025DataTable.netShotsMade,
      netShotsMissed: leader2025DataTable.netShotsMissed,
      otherNotes: leader2025DataTable.otherNotes,
      createdAt: leader2025DataTable.createdAt,
      updatedAt: leader2025DataTable.updatedAt,
    })
    .from(leader2025DataTable)
    .where(
      and(
        eq(leader2025DataTable.eventId, eventId),
        eq(leader2025DataTable.matchType, matchType)
      )
    )
    .orderBy(
      leader2025DataTable.matchType,
      leader2025DataTable.matchNumber,
      leader2025DataTable.allianceColor,
      leader2025DataTable.alliancePosition
    );
  return query;
}

export async function getTeamLeaderDataFor2025Event(
  eventId: SelectLeader2025Data['eventId'],
  teamNumber: SelectLeader2025Data['teamNumber'],
  matchType: SelectLeader2025Data['matchType']
): Promise<Array<TbaLeader2025Data>> {
  const query = await db
    .select({
      eventId: leader2025DataTable.eventId,
      matchType: leader2025DataTable.matchType,
      matchNumber: leader2025DataTable.matchNumber,
      source: leader2025DataTable.source,
      teamNumber: leader2025DataTable.teamNumber,
      scoutName: leader2025DataTable.scoutName,
      allianceColor: leader2025DataTable.allianceColor,
      alliancePosition: leader2025DataTable.alliancePosition,
      driverAbility: leader2025DataTable.driverAbility,
      sourceTime: leader2025DataTable.sourceTime,
      primaryRole: leader2025DataTable.primaryRole,
      netShotsMade: leader2025DataTable.netShotsMade,
      netShotsMissed: leader2025DataTable.netShotsMissed,
      otherNotes: leader2025DataTable.otherNotes,
      createdAt: leader2025DataTable.createdAt,
      updatedAt: leader2025DataTable.updatedAt,
      videoKey: EventMatches2025TbaResult.videoKey,
      videoType: EventMatches2025TbaResult.videoType,
    })
    .from(leader2025DataTable)
    .leftJoin(
      EventMatches2025TbaResult,
      eq(
        sql<string>`concat("Leader2025Data"."Event_Id","Leader2025Data"."Match_Type", LPAD("Leader2025Data"."Match_Number"::text, 3, '0'))`,
        EventMatches2025TbaResult.eventMatchId
      )
    )
    .where(
      and(
        eq(leader2025DataTable.eventId, eventId),
        eq(leader2025DataTable.teamNumber, teamNumber),
        eq(leader2025DataTable.matchType, matchType)
      )
    )
    .orderBy(
      leader2025DataTable.matchType,
      leader2025DataTable.matchNumber,
      leader2025DataTable.allianceColor,
      leader2025DataTable.alliancePosition
    );
  return query;
}

/// Inserts a leader scouting record for a team in a match
/// returns the inserted record
export async function addLeaderDataFor2025Event(
  data: InsertLeader2025Data
): Promise<Array<Leader2025Data>> {
  const query = await db.insert(leader2025DataTable).values(data).returning();
  return query;
}
