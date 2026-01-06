//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import { SelectLeader2024Data, leader2024DataTable } from '@/db/schema';

export async function getLeaderDataFor2024Event(
  eventId: SelectLeader2024Data['eventId']
): Promise<
  Array<{
    eventId: string;
    matchType: string;
    matchNumber: number;
    source: string | null;
    scoutName: string;
    allianceColor: string;
    autoTime: string | null;
    driverAbility: number | null;
    sourceTime: number | null;
    ampTime: number | null;
    break: string;
    class: string;
    otherNotes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }>
> {
  const query = await db
    .select({
      eventId: leader2024DataTable.eventId,
      matchType: leader2024DataTable.matchType,
      matchNumber: leader2024DataTable.matchNumber,
      source: leader2024DataTable.source,
      teamNumber: leader2024DataTable.teamNumber,
      scoutName: leader2024DataTable.scoutName,
      allianceColor: leader2024DataTable.allianceColor,
      autoTime: leader2024DataTable.autoTime,
      driverAbility: leader2024DataTable.driverAbility,
      sourceTime: leader2024DataTable.sourceTime,
      ampTime: leader2024DataTable.ampTime,
      break: leader2024DataTable.break,
      class: leader2024DataTable.class,
      otherNotes: leader2024DataTable.otherNotes,
      createdAt: leader2024DataTable.createdAt,
      updatedAt: leader2024DataTable.updatedAt,
    })
    .from(leader2024DataTable)
    .where(eq(leader2024DataTable.eventId, eventId))
    .orderBy(
      leader2024DataTable.matchType,
      leader2024DataTable.matchNumber,
      leader2024DataTable.allianceColor
    );
  return query;
}
