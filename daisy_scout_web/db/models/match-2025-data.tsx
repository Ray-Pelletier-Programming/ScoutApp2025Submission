export type Match2025Data = {
  eventId: string;
  matchType: string;
  matchNumber: number;
  source: string | null;
  teamNumber: number;
  scoutName: string;
  allianceColor: string;
  alliancePosition: number;

  autoStartLoc: string;
  autoReefL1: number | null;
  autoReefL2: number | null;
  autoReefL3: number | null;
  autoReefL4: number | null;
  coralA: number | null;
  coralB: number | null;
  coralC: number | null;
  coralD: number | null;
  coralE: number | null;
  coralF: number | null;
  leave: string | null;
  autoNet: number | null;
  autoProcessor: number | null;
  teleopReefL1: number | null;
  teleopReefL2: number | null;
  teleopReefL3: number | null;
  teleopReefL4: number | null;
  teleopProcessor: number | null;
  teleopNet: number | null;
  teleopAlgaeRemoved: number | null;
  endgame: string | null;

  createdAt: Date | null | undefined;
  updatedAt: Date | null | undefined;
};
