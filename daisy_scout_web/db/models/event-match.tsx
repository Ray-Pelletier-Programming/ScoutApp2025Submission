export type EventMatch = {
  eventMatchId: string;
  eventId: string;
  matchType: string;
  matchNumber: number | null;
  blue1: number | null;
  blue2: number | null;
  blue3: number | null;
  red1: number | null;
  red2: number | null;
  red3: number | null;
  allEvents: boolean | null | undefined; //TODO: match predictor only, refactor to differfent type?
  scheduledStartTime: Date | null;
};
