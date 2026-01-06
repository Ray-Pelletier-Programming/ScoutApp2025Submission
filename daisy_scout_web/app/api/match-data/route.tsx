import { addMatchDataFor2025Event } from '@/db/queries/match-2025-data-queries';
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

      const data = {
        eventId: body.Season + comp,
        matchType: body.MatchType,
        matchNumber: parseInt(body.MatchNumber),
        source: body.Source,
        teamNumber: parseInt(body.TeamNumber),
        scoutName: body.ScoutName,
        allianceColor: body.TabletColor,
        alliancePosition: parseInt(body.TabletPosition),
        autoStartLoc: body.ASL,
        autoReefL1: parseInt(body.AutoReefL1),
        autoReefL2: parseInt(body.AutoReefL2),
        autoReefL3: parseInt(body.AutoReefL3),
        autoReefL4: parseInt(body.AutoReefL4),
        coralA: parseInt(body.CoralA),
        coralB: parseInt(body.CoralB),
        coralC: parseInt(body.CoralC),
        coralD: parseInt(body.CoralD),
        coralE: parseInt(body.CoralE),
        coralF: parseInt(body.CoralF),
        leave: body.Leave,
        autoNet: parseInt(body.AutoNet),
        autoProcessor: parseInt(body.AutoProcessor),
        teleopReefL1: parseInt(body.TeleopReefL1),
        teleopReefL2: parseInt(body.TeleopReefL2),
        teleopReefL3: parseInt(body.TeleopReefL3),
        teleopReefL4: parseInt(body.TeleopReefL4),
        teleopProcessor: parseInt(body.TeleopProcessor),
        teleopNet: parseInt(body.TeleopNet),
        teleopAlgaeRemoved: parseInt(body.TeleopAlgaeRemoved),
        endgame: body.Endgame,
        betAmount:
          body.BetAmount == 'null' || body.BetAmount == null
            ? null
            : parseInt(body.BetAmount),
        betColor: body.BetColor == 'null' ? null : body.BetColor,
        autoColor: body.AutoColor == 'null' ? null : body.AutoColor,
        winnerScoreOverUnder:
          body.WinnerScoreOverUnder == 'null'
            ? null
            : body.WinnerScoreOverUnder,
        totalScoreOverUnder:
          body.TotalScoreOverUnder == 'null' ? null : body.TotalScoreOverUnder,
      };

      return NextResponse.json(await addMatchDataFor2025Event(data));
    default:
      return NextResponse.json(
        { error: `Season not supported... ${season}` },
        { status: 400 }
      );
  }
}
