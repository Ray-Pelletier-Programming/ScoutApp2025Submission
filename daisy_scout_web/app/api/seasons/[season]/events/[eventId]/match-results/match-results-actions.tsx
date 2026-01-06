'use server';

import { matchTypes } from '@/app/ui/constants/match-type';
import {
  addEventMatches2025Results,
  addEventMatches2025TbaResults,
  addEventMatchTeams2025Results,
} from '@/db/queries/match-result-2025-queries';
import {
  InsertEventMatches2025Result,
  InsertEventMatches2025TbaResult,
  InsertEventMatchTeams2025Result,
} from '@/db/schema';

interface ReefRow {
  nodeA: boolean;
  nodeB: boolean;
  nodeC: boolean;
  nodeD: boolean;
  nodeE: boolean;
  nodeF: boolean;
  nodeG: boolean;
  nodeH: boolean;
  nodeI: boolean;
  nodeJ: boolean;
  nodeK: boolean;
  nodeL: boolean;
}

interface Reef {
  topRow: ReefRow;
  midRow: ReefRow;
  botRow: ReefRow;
  trough: number;
}

interface Alliance {
  autoLineRobot1: string;
  endGameRobot1: string;
  autoLineRobot2: string;
  endGameRobot2: string;
  autoLineRobot3: string;
  endGameRobot3: string;

  alliance: string;
  autoReef: Reef;

  autoCoralCount: number;
  autoMobilityPoints: number;
  autoPoints: number;
  autoCoralPoints: number;
  teleopReef: Reef;

  teleopCoralCount: number;
  teleopPoints: number;
  teleopCoralPoints: number;

  algaePoints: number;
  netAlgaeCount: number;
  wallAlgaeCount: number;
  endGameBargePoints: number;

  autoBonusAchieved: boolean;
  coralBonusAchieved: boolean;
  bargeBonusAchieved: boolean;
  coopertitionCriteriaMet: boolean;
  foulCount: number;
  g206Penalty: boolean;
  g410Penalty: boolean;
  g418Penalty: boolean;
  g428Penalty: boolean;
  adjustPoints: number;
  foulPoints: number;
  rp: number;
  totalPoints: number;
}

interface MatchScore {
  matchLevel: string;
  matchNumber: number;
  alliances: Alliance[];
}

interface EventMatches2025Result {
  MatchScores: MatchScore[];
}

type TbaEventMatches2025Result = {
  comp_level: string;
  match_number: number;
  videos: TbaVideo[];
};

type TbaVideo = {
  type: string;
  key: string;
};
export async function GetMatchResultsFromFms(
  season: number,
  eventCode: string
) {
  const vals = process.env.FRCAPI_User + ':' + process.env.FRCAPI_Pass;
  const token = Buffer.from(vals).toString('base64');

  const response = await fetch(
    `https://frc-api.firstinspires.org/v3.0/${season}/scores/${eventCode}/qual`,
    {
      method: 'GET',
      headers: {
        //'Content-Type': 'application/json',
        Authorization: `Basic ${token}`,
      },
      //body: JSON.stringify({ comment }),
    }
  );

  if (response.status !== 200) {
    console.log('Error fetching match results:', response.text());
    return;
  }
  const result = await response.json();

  if (result.MatchScores.length > 0) {
    const MatchData: InsertEventMatches2025Result[] = (
      result as EventMatches2025Result
    ).MatchScores.flatMap((match: MatchScore) =>
      match.alliances.map(
        ({
          alliance,
          autoReef,
          autoCoralCount,
          autoMobilityPoints,
          autoPoints,
          autoCoralPoints,
          teleopReef,
          teleopCoralCount,
          teleopPoints,
          teleopCoralPoints,

          algaePoints,
          netAlgaeCount,
          wallAlgaeCount,
          endGameBargePoints,
          autoBonusAchieved,
          coralBonusAchieved,
          bargeBonusAchieved,
          coopertitionCriteriaMet,
          foulCount,
          g206Penalty,
          g410Penalty,
          g418Penalty,
          g428Penalty,
          adjustPoints,
          foulPoints,
          rp,
          totalPoints,
        }: Alliance) => ({
          eventMatchId:
            season +
            eventCode.toUpperCase() +
            matchTypes.qual +
            match.matchNumber.toString().padStart(3, '0'),
          allianceColor: alliance.includes('Red') ? 'r' : 'b',
          autoL4_A: autoReef.topRow.nodeA,
          autoL4_B: autoReef.topRow.nodeB,
          autoL4_C: autoReef.topRow.nodeC,
          autoL4_D: autoReef.topRow.nodeD,
          autoL4_E: autoReef.topRow.nodeE,
          autoL4_F: autoReef.topRow.nodeF,
          autoL4_G: autoReef.topRow.nodeG,
          autoL4_H: autoReef.topRow.nodeH,
          autoL4_I: autoReef.topRow.nodeI,
          autoL4_J: autoReef.topRow.nodeJ,
          autoL4_K: autoReef.topRow.nodeK,
          autoL4_L: autoReef.topRow.nodeL,
          autoL3_A: autoReef.midRow.nodeA,
          autoL3_B: autoReef.midRow.nodeB,
          autoL3_C: autoReef.midRow.nodeC,
          autoL3_D: autoReef.midRow.nodeD,
          autoL3_E: autoReef.midRow.nodeE,
          autoL3_F: autoReef.midRow.nodeF,
          autoL3_G: autoReef.midRow.nodeG,
          autoL3_H: autoReef.midRow.nodeH,
          autoL3_I: autoReef.midRow.nodeI,
          autoL3_J: autoReef.midRow.nodeJ,
          autoL3_K: autoReef.midRow.nodeK,
          autoL3_L: autoReef.midRow.nodeL,
          autoL2_A: autoReef.botRow.nodeA,
          autoL2_B: autoReef.botRow.nodeB,
          autoL2_C: autoReef.botRow.nodeC,
          autoL2_D: autoReef.botRow.nodeD,
          autoL2_E: autoReef.botRow.nodeE,
          autoL2_F: autoReef.botRow.nodeF,
          autoL2_G: autoReef.botRow.nodeG,
          autoL2_H: autoReef.botRow.nodeH,
          autoL2_I: autoReef.botRow.nodeI,
          autoL2_J: autoReef.botRow.nodeJ,
          autoL2_K: autoReef.botRow.nodeK,
          autoL2_L: autoReef.botRow.nodeL,
          autoL1: autoReef.trough,

          autoCoralCount: autoCoralCount,
          autoMobilityPoints: autoMobilityPoints,
          autoPoints: autoPoints,
          autoCoralPoints: autoCoralPoints,

          teleopL4_A: teleopReef.topRow.nodeA,
          teleopL4_B: teleopReef.topRow.nodeB,
          teleopL4_C: teleopReef.topRow.nodeC,
          teleopL4_D: teleopReef.topRow.nodeD,
          teleopL4_E: teleopReef.topRow.nodeE,
          teleopL4_F: teleopReef.topRow.nodeF,
          teleopL4_G: teleopReef.topRow.nodeG,
          teleopL4_H: teleopReef.topRow.nodeH,
          teleopL4_I: teleopReef.topRow.nodeI,
          teleopL4_J: teleopReef.topRow.nodeJ,
          teleopL4_K: teleopReef.topRow.nodeK,
          teleopL4_L: teleopReef.topRow.nodeL,
          teleopL3_A: teleopReef.midRow.nodeA,
          teleopL3_B: teleopReef.midRow.nodeB,
          teleopL3_C: teleopReef.midRow.nodeC,
          teleopL3_D: teleopReef.midRow.nodeD,
          teleopL3_E: teleopReef.midRow.nodeE,
          teleopL3_F: teleopReef.midRow.nodeF,
          teleopL3_G: teleopReef.midRow.nodeG,
          teleopL3_H: teleopReef.midRow.nodeH,
          teleopL3_I: teleopReef.midRow.nodeI,
          teleopL3_J: teleopReef.midRow.nodeJ,
          teleopL3_K: teleopReef.midRow.nodeK,
          teleopL3_L: teleopReef.midRow.nodeL,
          teleopL2_A: teleopReef.botRow.nodeA,
          teleopL2_B: teleopReef.botRow.nodeB,
          teleopL2_C: teleopReef.botRow.nodeC,
          teleopL2_D: teleopReef.botRow.nodeD,
          teleopL2_E: teleopReef.botRow.nodeE,
          teleopL2_F: teleopReef.botRow.nodeF,
          teleopL2_G: teleopReef.botRow.nodeG,
          teleopL2_H: teleopReef.botRow.nodeH,
          teleopL2_I: teleopReef.botRow.nodeI,
          teleopL2_J: teleopReef.botRow.nodeJ,
          teleopL2_K: teleopReef.botRow.nodeK,
          teleopL2_L: teleopReef.botRow.nodeL,
          teleopL1: teleopReef.trough,

          teleopCoralCount: teleopCoralCount,
          teleopPoints: teleopPoints,
          teleopCoralPoints: teleopCoralPoints,

          algaePoints: algaePoints,
          netAlgaeCount: netAlgaeCount,
          wallAlgaeCount: wallAlgaeCount,
          endgameBargePoints: endGameBargePoints,

          autoBonusAchieved: autoBonusAchieved,
          coralBonusAchieved: coralBonusAchieved,
          bargeBonusAchieved: bargeBonusAchieved,
          coopertitionCriteriaMet: coopertitionCriteriaMet,
          foulCount: foulCount,
          g206Penalty: g206Penalty,
          g410Penalty: g410Penalty,
          g418Penalty: g418Penalty,
          g428Penalty: g428Penalty,
          anjustPoints: adjustPoints,
          foulPoints: foulPoints,
          rp: rp,
          totalPoints: totalPoints,
        })
      )
    ); // no error

    const MatchTeamDataTeam1: InsertEventMatchTeams2025Result[] = (
      result as EventMatches2025Result
    ).MatchScores.flatMap((match: MatchScore) =>
      match.alliances.map(
        ({ alliance, autoLineRobot1, endGameRobot1 }: Alliance) => ({
          eventMatchId:
            season +
            eventCode.toUpperCase() +
            matchTypes.qual +
            match.matchNumber.toString().padStart(3, '0'),
          allianceColor: alliance.includes('Red') ? 'r' : 'b',
          alliancePosition: 1,
          leave: autoLineRobot1,
          endgame: endGameRobot1,
        })
      )
    ); // no error

    const MatchTeamDataTeam2: InsertEventMatchTeams2025Result[] = (
      result as EventMatches2025Result
    ).MatchScores.flatMap((match: MatchScore) =>
      match.alliances.map(
        ({ alliance, autoLineRobot2, endGameRobot2 }: Alliance) => ({
          eventMatchId:
            season +
            eventCode.toUpperCase() +
            matchTypes.qual +
            match.matchNumber.toString().padStart(3, '0'),
          allianceColor: alliance.includes('Red') ? 'r' : 'b',
          alliancePosition: 2,
          leave: autoLineRobot2,
          endgame: endGameRobot2,
        })
      )
    ); // no error

    const MatchTeamDataTeam3: InsertEventMatchTeams2025Result[] = (
      result as EventMatches2025Result
    ).MatchScores.flatMap((match: MatchScore) =>
      match.alliances.map(
        ({ alliance, autoLineRobot3, endGameRobot3 }: Alliance) => ({
          eventMatchId:
            season +
            eventCode.toUpperCase() +
            matchTypes.qual +
            match.matchNumber.toString().padStart(3, '0'),
          allianceColor: alliance.includes('Red') ? 'r' : 'b',
          alliancePosition: 3,
          leave: autoLineRobot3,
          endgame: endGameRobot3,
        })
      )
    ); // no error

    const MatchTeamData = MatchTeamDataTeam1;
    MatchTeamData.push(...MatchTeamDataTeam2);
    MatchTeamData.push(...MatchTeamDataTeam3);

    await addEventMatches2025Results(MatchData);
    await addEventMatchTeams2025Results(MatchTeamData);
  }
}

export async function GetMatchResultsFromTba(
  season: number,
  eventCode: string
) {
  const tbaKey = process.env.TBAAuthKey;

  //TODO: TBA uses different codes for COMPTX Divisions...
  let theCode = eventCode.toLowerCase();
  if (theCode === 'archimedes') {
    theCode = 'arc';
  }
  if (theCode === 'curie') {
    theCode = 'cur';
  }
  if (theCode === 'daly') {
    theCode = 'dal';
  }
  if (theCode === 'galileo') {
    theCode = 'gal';
  }
  if (theCode === 'hopper') {
    theCode = 'hop';
  }
  if (theCode === 'johnson') {
    theCode = 'joh';
  }
  if (theCode === 'milstein') {
    theCode = 'mil';
  }
  if (theCode === 'newton') {
    theCode = 'new';
  }

  const response = await fetch(
    `https://www.thebluealliance.com/api/v3/event/${season}${theCode}/matches`,
    {
      method: 'GET',
      headers: {
        //'Content-Type': 'application/json',
        'X-TBA-Auth-Key': tbaKey!,
      },
      //body: JSON.stringify({ comment }),
    }
  );

  if (response.status !== 200) {
    console.log('Error fetching TBA Data:', response.text());
    return;
  }
  const result = await response.json();
  console.log('Got TBA results!');
  console.log(result);
  if (result.length > 0) {
    const MatchData: InsertEventMatches2025TbaResult[] = (
      result as TbaEventMatches2025Result[]
    )
      .filter((x) => x.comp_level === 'qm') // only quals...
      .filter((x) => x.videos.length > 0) // only matches with videos
      .map((x) => ({
        eventMatchId:
          season +
          eventCode.toUpperCase() +
          matchTypes.qual +
          x.match_number.toString().padStart(3, '0'),

        videoKey: x.videos[0].key,
        videoType: x.videos[0].type,
      })); // no error

    await addEventMatches2025TbaResults(MatchData);
  }
}
