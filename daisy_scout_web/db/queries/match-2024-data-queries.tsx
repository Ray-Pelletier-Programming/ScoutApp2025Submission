//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import { SelectMatch2024Data, match2024DataTable } from '@/db/schema';

export interface Match2024Data {
  eventId: string;
  matchType: string;
  matchNumber: number;
  source: string | null;
  teamNumber: number;
  scoutName: string;
  allianceColor: string;
  robotLeave: number;
  autoStartLoc: string;
  autoNotesIntook1: string | null;
  autoNotesIntook2: string | null;
  autoNotesIntook3: string | null;
  autoNotesIntook4: string | null;
  autoNotesIntook5: string | null;
  autoNotesIntook6: string | null;
  autoNotesIntook7: string | null;
  autoNotesIntook8: string | null;
  autoNotesIntook9: string | null;
  autoAmpScored: number;
  autoSpeakerScored: number;
  AutoAmpMissed: number;
  autoSpeakerMissed: number;
  teleAmpScored: number;
  teleSpeakerScored: number;
  teleAmpMissed: number;
  teleSpeakerMissed: number;
  climbState: string;
  ferry: number | null;
  trap: number;
  harmony: number;
  betColor: string;
  betAmount: number;
  overUnder: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getMatchDataFor2024Event({
  eventId,
}: {
  eventId: SelectMatch2024Data['eventId'];
}): Promise<Array<Match2024Data>> {
  const query = await db
    .select({
      eventId: match2024DataTable.eventId,
      matchType: match2024DataTable.matchType,
      matchNumber: match2024DataTable.matchNumber,
      source: match2024DataTable.source,
      teamNumber: match2024DataTable.teamNumber,
      scoutName: match2024DataTable.scoutName,
      allianceColor: match2024DataTable.allianceColor,

      robotLeave: match2024DataTable.robotLeave,
      autoStartLoc: match2024DataTable.autoStartLoc,
      autoNotesIntook1: match2024DataTable.autoNotesIntook1,
      autoNotesIntook2: match2024DataTable.autoNotesIntook2,
      autoNotesIntook3: match2024DataTable.autoNotesIntook3,
      autoNotesIntook4: match2024DataTable.autoNotesIntook4,
      autoNotesIntook5: match2024DataTable.autoNotesIntook5,
      autoNotesIntook6: match2024DataTable.autoNotesIntook6,
      autoNotesIntook7: match2024DataTable.autoNotesIntook7,
      autoNotesIntook8: match2024DataTable.autoNotesIntook8,
      autoNotesIntook9: match2024DataTable.autoNotesIntook9,
      autoAmpScored: match2024DataTable.autoAmpScored,
      autoSpeakerScored: match2024DataTable.autoSpeakerScored,
      AutoAmpMissed: match2024DataTable.autoAmpMissed,
      autoSpeakerMissed: match2024DataTable.autoSpeakerMissed,
      teleAmpScored: match2024DataTable.teleAmpScored,
      teleSpeakerScored: match2024DataTable.teleSpeakerScored,
      teleAmpMissed: match2024DataTable.teleAmpMissed,
      teleSpeakerMissed: match2024DataTable.teleSpeakerMissed,
      climbState: match2024DataTable.climbState,
      ferry: match2024DataTable.ferry,
      trap: match2024DataTable.trap,
      harmony: match2024DataTable.harmony,
      betColor: match2024DataTable.betColor,
      betAmount: match2024DataTable.betAmount,
      overUnder: match2024DataTable.overUnder,

      createdAt: match2024DataTable.createdAt,
      updatedAt: match2024DataTable.updatedAt,
    })
    .from(match2024DataTable)
    .where(eq(match2024DataTable.eventId, eventId))
    .orderBy(
      match2024DataTable.matchType,
      match2024DataTable.matchNumber,
      match2024DataTable.allianceColor
    );

  return query;
}
