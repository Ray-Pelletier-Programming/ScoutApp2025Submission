import { addLeaderDataFor2025Event } from '@/db/queries/leader-2025-queries';
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
      const hpTeamNumber: string = body.HPTeamNumber;
      // hp team number can be Team1's #, Team2's #, Team3's # or None

      const team1data = {
        eventId: body.Season + comp,
        matchType: body.MatchType,
        matchNumber: parseInt(body.MatchNumber),
        source: body.Source == 'null' ? null : body.Source,
        scoutName: body.ScoutName,
        allianceColor: body.TabletColor,
        alliancePosition: 1,
        teamNumber: parseInt(body.Team1),
        driverAbility: parseInt(body.DriverAbility1),
        break: body.Break1,
        primaryRole: body.PrimRole1.replace('[', '').replace(']', ''),
        otherNotes: body.OtherNotes1,
        netShotsMade:
          body.Team1 == hpTeamNumber ? parseInt(body.NetShotsMade) : 0,
        netShotsMissed:
          body.Team1 == hpTeamNumber ? parseInt(body.NetShotsMissed) : 0,
      };
      await addLeaderDataFor2025Event(team1data);

      const team2data = {
        eventId: body.Season + comp,
        matchType: body.MatchType,
        matchNumber: parseInt(body.MatchNumber),
        source: body.Source == 'null' ? null : body.Source,
        scoutName: body.ScoutName,
        allianceColor: body.TabletColor,
        alliancePosition: 2,
        teamNumber: parseInt(body.Team2),
        driverAbility: parseInt(body.DriverAbility2),
        break: body.Break2,
        primaryRole: body.PrimRole2.replace('[', '').replace(']', ''),
        otherNotes: body.OtherNotes2,
        netShotsMade:
          body.Team2 == hpTeamNumber ? parseInt(body.NetShotsMade) : 0,
        netShotsMissed:
          body.Team2 == hpTeamNumber ? parseInt(body.NetShotsMissed) : 0,
      };
      await addLeaderDataFor2025Event(team2data);

      const team3data = {
        eventId: body.Season + comp,
        matchType: body.MatchType,
        matchNumber: parseInt(body.MatchNumber),
        source: body.Source == 'null' ? null : body.Source,
        scoutName: body.ScoutName,
        allianceColor: body.TabletColor,
        alliancePosition: 3,
        teamNumber: parseInt(body.Team3),
        driverAbility: parseInt(body.DriverAbility3),
        break: body.Break3,
        primaryRole: body.PrimRole3.replace('[', '').replace(']', ''),
        otherNotes: body.OtherNotes3,
        netShotsMade:
          body.Team3 == hpTeamNumber ? parseInt(body.NetShotsMade) : 0,
        netShotsMissed:
          body.Team3 == hpTeamNumber ? parseInt(body.NetShotsMissed) : 0,
      };
      await addLeaderDataFor2025Event(team3data);

      return NextResponse.json('ok');
    default:
      return NextResponse.json(
        { error: `Season not supported... ${season}` },
        { status: 400 }
      );
  }
}
