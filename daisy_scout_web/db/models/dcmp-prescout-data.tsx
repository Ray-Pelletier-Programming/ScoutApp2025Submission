export type DcmpPrescoutData = {
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
  totalDcmpPoints: number | undefined;
  dcmpLocked: string | undefined;
  lockedVal: number | undefined;
  primarySort: number | undefined;
  hasUnplayedEvent: boolean | undefined;
  lastEventStartDate: Date | null;
};
