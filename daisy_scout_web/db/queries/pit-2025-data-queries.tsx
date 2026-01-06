//https://www.wisp.blog/blog/nextjs-14-app-router-get-and-post-examples-with-typescript

import { eq, and } from 'drizzle-orm';
import { drizzleClientHttp as db } from '@/db/client';
import {
  SelectPit2025Data,
  pit2025DataTable,
  InsertPit2025Data,
} from '@/db/schema';
import { Pit2025Data } from '../models/pit-2025-data';

export async function getpitDataFor2025Event(
  eventId: SelectPit2025Data['eventId']
): Promise<Array<Pit2025Data>> {
  const query = await db
    .select({
      eventId: pit2025DataTable.eventId,
      source: pit2025DataTable.source,
      teamNumber: pit2025DataTable.teamNumber,
      scoutName: pit2025DataTable.scoutName,

      // insert 2025 fields here
      driveTrain: pit2025DataTable.driveTrain,
      robotWidth: pit2025DataTable.robotWidth,
      robotLength: pit2025DataTable.robotLength,
      humanPlayerLoc: pit2025DataTable.humanPlayerLoc,
      intakeGroundAlgae: pit2025DataTable.intakeGroundAlgae,
      intakeReefAlgae: pit2025DataTable.intakeReefAlgae,
      intakeReefCoral: pit2025DataTable.intakeReefCoral,
      intakeGroundCoral: pit2025DataTable.intakeGroundCoral,
      scoreTeleopL1: pit2025DataTable.scoreTeleopL1,
      scoreTeleopL2: pit2025DataTable.scoreTeleopL2,
      scoreTeleopL3: pit2025DataTable.scoreTeleopL3,
      scoreTeleopL4: pit2025DataTable.scoreTeleopL4,
      scoreTeleopProcessor: pit2025DataTable.scoreTeleopProcessor,
      scoreTeleopNet: pit2025DataTable.scoreTeleopNet,
      scoreAutoL1: pit2025DataTable.scoreAutoL1,
      scoreAutoL2: pit2025DataTable.scoreAutoL2,
      scoreAutoL3: pit2025DataTable.scoreAutoL3,
      scoreAutoL4: pit2025DataTable.scoreAutoL4,
      scoreAutoProcessor: pit2025DataTable.scoreAutoProcessor,
      scoreAutoNet: pit2025DataTable.scoreAutoNet,
      prefStartCenter: pit2025DataTable.prefStartCenter,
      prefStartAllyHP: pit2025DataTable.prefStartAllyHP,
      prefStartOppHP: pit2025DataTable.prefStartOppHP,
      prefStartNone: pit2025DataTable.prefStartNone,
      autoIntakeHPCoral: pit2025DataTable.autoIntakeHPCoral,
      autoIntakeGroundCoral: pit2025DataTable.autoIntakeGroundCoral,
      autoMaxGamePieces: pit2025DataTable.autoMaxGamePieces,
      canShallowClimb: pit2025DataTable.canShallowClimb,
      canDeepClimb: pit2025DataTable.canDeepClimb,
      noClimb: pit2025DataTable.noClimb,
      notableFeatures: pit2025DataTable.notableFeatures,

      createdAt: pit2025DataTable.createdAt,
      updatedAt: pit2025DataTable.updatedAt,
    })
    .from(pit2025DataTable)
    .where(eq(pit2025DataTable.eventId, eventId))
    .orderBy(pit2025DataTable.eventId, pit2025DataTable.teamNumber);
  return query;
}

export async function getTeamPitDataFor2025Event(
  eventId: SelectPit2025Data['eventId'],
  teamNumber: SelectPit2025Data['teamNumber']
): Promise<Pit2025Data | undefined> {
  const query = await db
    .select({
      eventId: pit2025DataTable.eventId,
      source: pit2025DataTable.source,
      teamNumber: pit2025DataTable.teamNumber,
      scoutName: pit2025DataTable.scoutName,

      // insert 2025 fields here
      driveTrain: pit2025DataTable.driveTrain,
      robotWidth: pit2025DataTable.robotWidth,
      robotLength: pit2025DataTable.robotLength,
      humanPlayerLoc: pit2025DataTable.humanPlayerLoc,
      intakeGroundAlgae: pit2025DataTable.intakeGroundAlgae,
      intakeReefAlgae: pit2025DataTable.intakeReefAlgae,
      intakeReefCoral: pit2025DataTable.intakeReefCoral,
      intakeGroundCoral: pit2025DataTable.intakeGroundCoral,
      scoreTeleopL1: pit2025DataTable.scoreTeleopL1,
      scoreTeleopL2: pit2025DataTable.scoreTeleopL2,
      scoreTeleopL3: pit2025DataTable.scoreTeleopL3,
      scoreTeleopL4: pit2025DataTable.scoreTeleopL4,
      scoreTeleopProcessor: pit2025DataTable.scoreTeleopProcessor,
      scoreTeleopNet: pit2025DataTable.scoreTeleopNet,
      scoreAutoL1: pit2025DataTable.scoreAutoL1,
      scoreAutoL2: pit2025DataTable.scoreAutoL2,
      scoreAutoL3: pit2025DataTable.scoreAutoL3,
      scoreAutoL4: pit2025DataTable.scoreAutoL4,
      scoreAutoProcessor: pit2025DataTable.scoreAutoProcessor,
      scoreAutoNet: pit2025DataTable.scoreAutoNet,
      prefStartCenter: pit2025DataTable.prefStartCenter,
      prefStartAllyHP: pit2025DataTable.prefStartAllyHP,
      prefStartOppHP: pit2025DataTable.prefStartOppHP,
      prefStartNone: pit2025DataTable.prefStartOppHP,
      autoIntakeHPCoral: pit2025DataTable.autoIntakeHPCoral,
      autoIntakeGroundCoral: pit2025DataTable.autoIntakeGroundCoral,
      autoMaxGamePieces: pit2025DataTable.autoMaxGamePieces,
      canShallowClimb: pit2025DataTable.canShallowClimb,
      canDeepClimb: pit2025DataTable.canDeepClimb,
      noClimb: pit2025DataTable.noClimb,
      notableFeatures: pit2025DataTable.notableFeatures,

      createdAt: pit2025DataTable.createdAt,
      updatedAt: pit2025DataTable.updatedAt,
    })
    .from(pit2025DataTable)
    .where(
      and(
        eq(pit2025DataTable.eventId, eventId),
        eq(pit2025DataTable.teamNumber, teamNumber)
      )
    )
    .orderBy(pit2025DataTable.eventId, pit2025DataTable.teamNumber)
    .limit(1);
  if (query.length > 0) {
    return query[0];
  } else {
    return;
  }
}

export async function addPitDataFor2025Event(
  data: InsertPit2025Data
): Promise<Array<Pit2025Data>> {
  const query = await db.insert(pit2025DataTable).values(data).returning();
  return query;
}
