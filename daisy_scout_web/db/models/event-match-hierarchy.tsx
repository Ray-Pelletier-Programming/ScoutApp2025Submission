export type EventMatchHierarchy = {
  eventMatchId: string;
  eventId: string;
  matchType: string;
  matchNumber: number | null;
  scheduledStartTime: Date | null;
  teams: EventMatchHierarchyTeam[] | undefined | null;
};

export type EventMatchHierarchyTeam = {
  eventMatchId: string;
  allianceColor: string;
  alliancePosition: number | null;
  teamNumber: number | null;
};
