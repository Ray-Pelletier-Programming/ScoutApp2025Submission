//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectPit2024Data,
  pit2024DataTable,
  SelectPit2025Data,
  pit2025DataTable,
} from '@/db/schema';

async function getpitDataFor2025Event(
  eventId: SelectPit2025Data['eventId']
): Promise<
  Array<{
    eventId: string;
    source: string | null;
    teamNumber: number;
    scoutName: string;

    // insert 2025 fields here

    createdAt: Date;
    updatedAt: Date;
  }>
> {
  const query = await db
    .select({
      eventId: pit2025DataTable.eventId,
      source: pit2025DataTable.source,
      teamNumber: pit2025DataTable.teamNumber,
      scoutName: pit2025DataTable.scoutName,

      // insert 2025 fields here

      createdAt: pit2025DataTable.createdAt,
      updatedAt: pit2025DataTable.updatedAt,
    })
    .from(pit2025DataTable)
    .where(eq(pit2025DataTable.eventId, eventId))
    .orderBy(pit2025DataTable.eventId, pit2025DataTable.teamNumber);
  return query;
}

async function getpitDataFor2024Event(
  eventId: SelectPit2024Data['eventId']
): Promise<
  Array<{
    eventId: string;
    source: string | null;
    teamNumber: number;
    scoutName: string;

    driveTrain: string;
    robotWidth: string; //numeric in typescript is treated as string
    robotLength: string; //numeric in typescript is treated as string
    robotHeight: string; //numeric in typescript is treated as string
    humanPlayer: string;
    canLeave: number;
    canAutoAmp: number;
    canAutoSpeaker: number;
    contestMiddle: number;
    maxNotesAuto: number;
    intakeLocation: string;
    scoringPref: string;
    canTeleAmp: number;
    canTeleSpeaker: number;
    climbLocation: string;
    climbHeight: string;
    canTrap: string; //numeric in typescript is treated as string
    notableFeat: string;

    createdAt: Date;
    updatedAt: Date;
  }>
> {
  const query = await db
    .select({
      eventId: pit2024DataTable.eventId,
      source: pit2024DataTable.source,
      teamNumber: pit2024DataTable.teamNumber,
      scoutName: pit2024DataTable.scoutName,

      driveTrain: pit2024DataTable.driveTrain,
      robotWidth: pit2024DataTable.robotWidth,
      robotLength: pit2024DataTable.robotLength,
      robotHeight: pit2024DataTable.robotHeight,
      humanPlayer: pit2024DataTable.humanPlayer,
      canLeave: pit2024DataTable.canLeave,
      canAutoAmp: pit2024DataTable.canAutoAmp,
      canAutoSpeaker: pit2024DataTable.canAutoSpeaker,
      contestMiddle: pit2024DataTable.contestMiddle,
      maxNotesAuto: pit2024DataTable.maxNotesAuto,
      intakeLocation: pit2024DataTable.intakeLocation,
      scoringPref: pit2024DataTable.scoringPref,
      canTeleAmp: pit2024DataTable.canTeleAmp,
      canTeleSpeaker: pit2024DataTable.canTeleSpeaker,
      climbLocation: pit2024DataTable.climbLocation,
      climbHeight: pit2024DataTable.climbHeight,
      canTrap: pit2024DataTable.canTrap,
      notableFeat: pit2024DataTable.notableFeat,

      createdAt: pit2024DataTable.createdAt,
      updatedAt: pit2024DataTable.updatedAt,
    })
    .from(pit2024DataTable)
    .where(eq(pit2024DataTable.eventId, eventId))
    .orderBy(pit2024DataTable.eventId, pit2024DataTable.teamNumber);
  return query;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const { eventId } = await params;

  switch (eventId.substring(0, 4)) {
    case '2025':
      return NextResponse.json(await getpitDataFor2025Event(eventId));
    case '2024':
      return NextResponse.json(await getpitDataFor2024Event(eventId));
    default:
      return NextResponse.json(
        { error: `Season not supported... ${eventId.substring(0, 4)}` },
        { status: 400 }
      );
  }
}
