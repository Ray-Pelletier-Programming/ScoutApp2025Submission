//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectCasino2025Data,
  casino2025DataTable,
  InsertCasino2025Data,
} from '@/db/schema';

/// Gets all the 2025 casino data for an event
export async function getCasinoDataFor2025Event(
  eventId: SelectCasino2025Data['eventId']
): Promise<
  Array<{
    eventId: string;
    matchType: string;
    matchNumber: number;
    source: string | null;
    scoutName: string;
    betColor: string | null;
    autoColor: string | null;
    winnerScoreOverUnder: string | null;
    totalScoreOverUnder: string | null;
    betAmount: number | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  const query = await db
    .select({
      eventId: casino2025DataTable.eventId,
      matchType: casino2025DataTable.matchType,
      matchNumber: casino2025DataTable.matchNumber,
      source: casino2025DataTable.source,
      scoutName: casino2025DataTable.scoutName,
      betColor: casino2025DataTable.betColor,
      autoColor: casino2025DataTable.autoColor,
      winnerScoreOverUnder: casino2025DataTable.winnerScoreOverUnder,
      totalScoreOverUnder: casino2025DataTable.totalScoreOverUnder,
      betAmount: casino2025DataTable.betAmount,
      createdAt: casino2025DataTable.createdAt,
      updatedAt: casino2025DataTable.updatedAt,
    })
    .from(casino2025DataTable)
    .where(eq(casino2025DataTable.eventId, eventId))
    .orderBy(
      casino2025DataTable.matchType,
      casino2025DataTable.matchNumber,
      casino2025DataTable.scoutName
    );
  return query;
}

/// Inserts a casino record for a team in a match
/// returns the inserted record
export async function addCasinoDataFor2025Event(
  data: InsertCasino2025Data
): Promise<
  Array<{
    eventId: string;
    matchType: string;
    matchNumber: number;
    source: string | null;
    scoutName: string;
    betColor: string | null;
    autoColor: string | null;
    winnerScoreOverUnder: string | null;
    totalScoreOverUnder: string | null;
    betAmount: number | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  const query = await db.insert(casino2025DataTable).values(data).returning();
  return query;
}

export type Casino2025IndividualData = {
  eventId: string;
  matchType: string;
  matchNumber: number;
  source: string | null;
  scoutName: string;
  betColor: string | null;
  autoColor: string | null;
  winnerScoreOverUnder: string | null;
  totalScoreOverUnder: string | null;
  betAmount: number | null;
};
