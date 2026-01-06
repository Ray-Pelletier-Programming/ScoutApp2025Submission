export type CmpPrescoutData = {
  startDate: Date;
  eventMatchId: string;
  eventName: string;
  eventCode: string;
  matchNumber: number;
  teamNumber: number;
  allianceColor: string;
  alliancePosition: number;
  source: string | null;
  scoutName: string | null;
  lastEventStartDate: Date | null;
  leave: string | null;
  endgame: string | null;
  matchVideo: string | null;
};
