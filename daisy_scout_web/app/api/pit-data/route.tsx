import { addPitDataFor2025Event } from '@/db/queries/pit-2025-data-queries';
import { NextRequest, NextResponse } from 'next/server';

// Used by Scanner
export async function POST(request: NextRequest) {
  const body = await request.json();

  const season = body.Season;

  switch (season) {
    case '2025':
      // map data to proper data types instead of all strings
      let comp: string = body.CompetitionID;
      comp = comp.toUpperCase();
      console.log(typeof body.CanIntakeLocations);
      const intakeLocations: string[] = body.CanIntakeLocations.toString()
        .replace('[', '')
        .replace(']', '')
        .split(', ');
      const teleopScoreLocations: string[] =
        body.CanTeleopScoreLocations.toString()
          .replace('[', '')
          .replace(']', '')
          .split(', ');
      const autoScoreLocations: string[] = body.CanAutoScoreLocations.toString()
        .replace('[', '')
        .replace(']', '')
        .split(', ');
      const prefStartLoc: string[] = body.PrefStartLoc.toString()
        .replace('[', '')
        .replace(']', '')
        .split(', ');
      const autoIntakeLocations: string[] =
        body.CanAutoIntakeLocations.toString()
          .replace('[', '')
          .replace(']', '')
          .split(', ');
      const climb: string[] = body.CanClimb.toString()
        .replace('[', '')
        .replace(']', '')
        .split(', ');

      const data = {
        eventId: body.Season + comp,
        source: body.Source,
        teamNumber: parseInt(body.TeamNumber),
        scoutName: body.ScoutName,

        driveTrain: body.DriveTrain,
        robotWidth: body.RobotWidth,
        robotLength: body.RobotLength,
        humanPlayerLoc: body.HumanPlayer == 'null' ? null : body.HumanPlayer,
        intakeGroundAlgae: intakeLocations.includes('Algae from Ground'),
        intakeReefAlgae: intakeLocations.includes('Algae from Reef'),
        intakeReefCoral: intakeLocations.includes('Coral from Human Player'),
        intakeGroundCoral: intakeLocations.includes('Coral from Ground'),
        scoreTeleopL1: teleopScoreLocations.includes('L1'),
        scoreTeleopL2: teleopScoreLocations.includes('L2'),
        scoreTeleopL3: teleopScoreLocations.includes('L3'),
        scoreTeleopL4: teleopScoreLocations.includes('L4'),
        scoreTeleopProcessor: teleopScoreLocations.includes('Processor'),
        scoreTeleopNet: teleopScoreLocations.includes('Net'),
        scoreAutoL1: autoScoreLocations.includes('L1'),
        scoreAutoL2: autoScoreLocations.includes('L2'),
        scoreAutoL3: autoScoreLocations.includes('L3'),
        scoreAutoL4: autoScoreLocations.includes('L4'),
        scoreAutoProcessor: autoScoreLocations.includes('Processor'),
        scoreAutoNet: autoScoreLocations.includes('Net'),
        prefStartCenter: prefStartLoc.includes('Center'),
        prefStartAllyHP: prefStartLoc.includes('Alliance Barge'),
        prefStartOppHP: prefStartLoc.includes('Opposing Barge'),
        prefStartNone: prefStartLoc.includes('No Preference'),
        autoIntakeHPCoral: autoIntakeLocations.includes('Coral Station'),
        autoIntakeGroundCoral: autoIntakeLocations.includes('Ground'),
        autoMaxGamePieces: parseInt(body.MaxGamepiecesAuto),
        canShallowClimb: climb.includes('Shallow Cage'),
        canDeepClimb: climb.includes('Deep Cage'),
        noClimb: climb.includes('None'),
        notableFeatures: body.NotableFeat,
      };

      return NextResponse.json(await addPitDataFor2025Event(data));
    default:
      return NextResponse.json(
        { error: `Season not supported... ${season}` },
        { status: 400 }
      );
  }
}
