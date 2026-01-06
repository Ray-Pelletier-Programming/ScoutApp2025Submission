import {
  pgTable,
  uniqueIndex,
  smallint,
  timestamp,
  varchar,
  integer,
  numeric,
  boolean,
} from 'drizzle-orm/pg-core';

export const seasonsTable = pgTable('Seasons', {
  season: smallint('Season').primaryKey(),
  seasonName: varchar('Season_Name', { length: 200 }).notNull(),
});

export const eventsTable = pgTable(
  'Events',
  {
    eventId: varchar('Event_Id', { length: 20 }).primaryKey(),
    season: smallint('Season')
      .notNull()
      .references(() => seasonsTable.season),
    eventCode: varchar('Event_Code', { length: 12 }).notNull(),
    eventName: varchar('Event_Name', { length: 150 }).notNull(),
    eventType: varchar('Event_Type', { length: 100 }).notNull(),
    districtCode: varchar('District_Code', { length: 10 }),
    divisionCode: varchar('Division_Code', { length: 10 }),
    startDate: timestamp('Date_Start').notNull(),
    endDate: timestamp('Date_End').notNull(),
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [uniqueIndex('idx_u_event').on(t.eventCode, t.season)]
);

export const eventTeamsTable = pgTable(
  'EventTeams',
  {
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    teamNumber: smallint('Team_Number').notNull(),
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [uniqueIndex('idx_u_eventteam').on(t.eventId, t.teamNumber)]
);

export const eventMatchesTable = pgTable(
  'EventMatches',
  {
    eventMatchId: varchar('Event_Match_Id', { length: 30 }).primaryKey(),
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    matchType: varchar('Match_Type', { length: 15 }).notNull(),
    matchNumber: smallint('Match_Number').notNull(),
    scheduledStartTime: timestamp('Scheduled_Start_Time'),
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_eventMatch').on(t.eventId, t.matchType, t.matchNumber),
  ]
);

export const eventMatchTeamsTable = pgTable(
  'EventMatchTeams',
  {
    eventMatchId: varchar('Event_Match_Id', { length: 30 })
      .notNull()
      .references(() => eventMatchesTable.eventMatchId),
    allianceColor: varchar('Alliance_Color', { length: 5 }).notNull(),
    alliancePosition: smallint('Alliance_Position').notNull(),
    teamNumber: smallint('Team_Number').notNull(),
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_eventMatchTeam').on(
      t.eventMatchId,
      t.allianceColor,
      t.alliancePosition
    ),
  ]
);

export const leader2024DataTable = pgTable(
  'Leader2024Data',
  {
    // 2024 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    matchType: varchar('Match_Type', { length: 15 }).notNull(),
    matchNumber: smallint('Match_Number').notNull(),
    source: varchar('Source', { length: 10 }),
    teamNumber: smallint('Team_Number').notNull(),
    scoutName: varchar('Scout_Name', { length: 40 }).notNull(),
    allianceColor: varchar('Alliance_Color', { length: 5 }).notNull(),

    // 2024 season specific
    autoTime: varchar('Auto_Time', { length: 20 }),
    driverAbility: integer('Driver_Ability'),
    sourceTime: integer('Source_Time'),
    ampTime: integer('Amp_Time'),
    break: varchar('Break', { length: 20 }).notNull(),
    class: varchar('Class', { length: 20 }).notNull(),

    // 2024 timestamp fields
    otherNotes: varchar('Other_Notes', { length: 500 }),
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_leader2024Data').on(
      t.eventId,
      t.matchType,
      t.matchNumber,
      t.source,
      t.teamNumber,
      t.scoutName
    ),
  ]
);

export const leader2025DataTable = pgTable(
  'Leader2025Data',
  {
    // 2025 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    matchType: varchar('Match_Type', { length: 15 }).notNull(),
    matchNumber: smallint('Match_Number').notNull(),
    source: varchar('Source', { length: 10 }),
    teamNumber: smallint('Team_Number').notNull(),
    scoutName: varchar('Scout_Name', { length: 40 }).notNull(),
    allianceColor: varchar('Alliance_Color', { length: 5 }).notNull(),
    alliancePosition: smallint('Alliance_Position').notNull(),

    // 2025 season specific
    driverAbility: integer('Driver_Ability'),
    sourceTime: integer('Source_Time'),
    break: varchar('Break', { length: 20 }).notNull(),
    primaryRole: varchar('Primary_Role', { length: 30 }),
    netShotsMade: smallint('Net_Shots_Made').notNull(),
    netShotsMissed: smallint('Net_Shots_Missed').notNull(),
    otherNotes: varchar('Other_Notes', { length: 500 }),

    // 2025 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_leader2025Data').on(
      t.eventId,
      t.matchType,
      t.matchNumber,
      t.source,
      t.teamNumber,
      t.scoutName,
      t.allianceColor,
      t.alliancePosition
    ),
  ]
);

export const match2024DataTable = pgTable(
  'Match2024Data',
  {
    // 2024 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    matchType: varchar('Match_Type', { length: 15 }).notNull(),
    matchNumber: smallint('Match_Number').notNull(),
    source: varchar('Source', { length: 10 }),
    teamNumber: smallint('Team_Number').notNull(),
    scoutName: varchar('Scout_Name', { length: 40 }).notNull(),
    allianceColor: varchar('Alliance_Color', { length: 5 }).notNull(),

    // 2024 season specific
    robotLeave: integer('Robot_Leave').notNull(),
    autoStartLoc: varchar('Auto_Start_Loc', { length: 15 }).notNull(),
    autoNotesIntook1: varchar('Auto_Notes_Intook_1', { length: 2 }),
    autoNotesIntook2: varchar('Auto_Notes_Intook_2', { length: 2 }),
    autoNotesIntook3: varchar('Auto_Notes_Intook_3', { length: 2 }),
    autoNotesIntook4: varchar('Auto_Notes_Intook_4', { length: 2 }),
    autoNotesIntook5: varchar('Auto_Notes_Intook_5', { length: 2 }),
    autoNotesIntook6: varchar('Auto_Notes_Intook_6', { length: 2 }),
    autoNotesIntook7: varchar('Auto_Notes_Intook_7', { length: 2 }),
    autoNotesIntook8: varchar('Auto_Notes_Intook_8', { length: 2 }),
    autoNotesIntook9: varchar('Auto_Notes_Intook_9', { length: 2 }),
    autoAmpScored: integer('Auto_Amp_Scored').notNull(),
    autoSpeakerScored: integer('Auto_Speaker_Scored').notNull(),
    autoAmpMissed: integer('Auto_Amp_Missed').notNull(),
    autoSpeakerMissed: integer('Auto_Speaker_Missed').notNull(),
    teleAmpScored: integer('Tele_Amp_Scored').notNull(),
    teleSpeakerScored: integer('Tele_Speaker_Scored').notNull(),
    teleAmpMissed: integer('Tele_Amp_Missed').notNull(),
    teleSpeakerMissed: integer('Tele_Speaker_Missed').notNull(),
    climbState: varchar('Climb_State', { length: 25 }).notNull(),
    ferry: integer('Ferry'),
    trap: integer('Trap').notNull(),
    harmony: integer('Harmony').notNull(),
    betColor: varchar('Bet_Color', { length: 5 }).notNull(),
    betAmount: integer('Bet_Amount').notNull(),
    overUnder: varchar('Over_Under', { length: 5 }).notNull(),

    // 2024 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_match2024Data').on(
      t.eventId,
      t.matchType,
      t.matchNumber,
      t.source,
      t.teamNumber,
      t.scoutName
    ),
  ]
);

export const match2025DataTable = pgTable(
  'Match2025Data',
  {
    // 2025 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    matchType: varchar('Match_Type', { length: 15 }).notNull(),
    matchNumber: smallint('Match_Number').notNull(),
    source: varchar('Source', { length: 10 }),
    teamNumber: smallint('Team_Number').notNull(),
    scoutName: varchar('Scout_Name', { length: 40 }).notNull(),
    allianceColor: varchar('Alliance_Color', { length: 5 }).notNull(),
    alliancePosition: smallint('Alliance_Position').notNull(),

    // 2025 season specific
    autoStartLoc: varchar('Auto_Start_Loc', { length: 14 }).notNull(),
    autoReefL1: smallint('Auto_Reef_L1'),
    autoReefL2: smallint('Auto_Reef_L2'),
    autoReefL3: smallint('Auto_Reef_L3'),
    autoReefL4: smallint('Auto_Reef_L4'),
    coralA: smallint('Coral_A'),
    coralB: smallint('Coral_B'),
    coralC: smallint('Coral_C'),
    coralD: smallint('Coral_D'),
    coralE: smallint('Coral_E'),
    coralF: smallint('Coral_F'),
    leave: varchar('Leave', { length: 20 }).notNull(),
    autoNet: smallint('Auto_Net'),
    autoProcessor: smallint('Auto_Processor'),
    teleopReefL1: smallint('Teleop_Reef_L1'),
    teleopReefL2: smallint('Teleop_Reef_L2'),
    teleopReefL3: smallint('Teleop_Reef_L3'),
    teleopReefL4: smallint('Teleop_Reef_L4'),
    teleopProcessor: smallint('Teleop_Processor'),
    teleopNet: smallint('Teleop_Net'),
    teleopAlgaeRemoved: smallint('Teleop_Algae_Removed'),
    endgame: varchar('Endgame', { length: 7 }).notNull(),
    betAmount: integer('Bet_Amount'),
    betColor: varchar('Bet_Color', { length: 5 }),
    autoColor: varchar('Auto_Color', { length: 5 }),
    winnerScoreOverUnder: varchar('Winner_Score_Over_Under', { length: 5 }),
    totalScoreOverUnder: varchar('Over_Under', { length: 5 }),

    // 2025 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_match2025Data').on(
      t.eventId,
      t.matchType,
      t.matchNumber,
      t.source,
      t.teamNumber,
      t.scoutName
    ),
  ]
);

export const pit2024DataTable = pgTable(
  'Pit2024Data',
  {
    // 2024 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    source: varchar('Source', { length: 10 }),
    teamNumber: smallint('Team_Number').notNull(),
    scoutName: varchar('Scout_Name', { length: 40 }).notNull(),

    // 2024 season specific
    driveTrain: varchar('Drive_Train', { length: 10 }).notNull(),
    robotWidth: numeric('Robot_Width', { precision: 10, scale: 3 }).notNull(),
    robotLength: numeric('Robot_Length', { precision: 10, scale: 3 }).notNull(),
    robotHeight: numeric('Robot_Height', { precision: 10, scale: 3 }).notNull(),
    humanPlayer: varchar('Human_Player', { length: 10 }).notNull(),
    canLeave: integer('Can_Leave').notNull(),
    canAutoAmp: integer('Can_Auto_Amp').notNull(),
    canAutoSpeaker: integer('Can_Auto_Speaker').notNull(),
    contestMiddle: integer('Contest_Middle').notNull(),
    maxNotesAuto: integer('Max_Notes_Auto').notNull(),
    intakeLocation: varchar('Intake_Location', { length: 10 }).notNull(),
    scoringPref: varchar('Scoring_Pref', { length: 100 }).notNull(),
    canTeleAmp: integer('Can_Tele_Amp').notNull(),
    canTeleSpeaker: integer('Can_Tele_Speaker').notNull(),
    climbLocation: varchar('Climb_Location', { length: 10 }).notNull(),
    climbHeight: numeric('Climb_Height', { precision: 10, scale: 3 }).notNull(),
    canTrap: varchar('Can_Trap', { length: 20 }).notNull(),
    notableFeat: varchar('Notable_Feat', { length: 500 }).notNull(),

    // 2024 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_pit2024Data').on(
      t.eventId,
      t.source,
      t.teamNumber,
      t.scoutName
    ),
  ]
);

export const pit2025DataTable = pgTable(
  'Pit2025Data',
  {
    // 2025 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    source: varchar('Source', { length: 10 }),
    teamNumber: smallint('Team_Number').notNull(),
    scoutName: varchar('Scout_Name', { length: 40 }).notNull(),

    // 2025 season specific
    driveTrain: varchar('Drive_Train', { length: 7 }).notNull(),
    robotWidth: numeric('Robot_Width', { precision: 10, scale: 3 }).notNull(),
    robotLength: numeric('Robot_Length', { precision: 10, scale: 3 }).notNull(),
    humanPlayerLoc: varchar('Human_Player_Loc', { length: 15 }),
    intakeGroundAlgae: boolean('Intake_Ground_Algae'),
    intakeReefAlgae: boolean('Intake_Reef_Algae'),
    intakeReefCoral: boolean('Intake_Reef_Coral'),
    intakeGroundCoral: boolean('Intake_Ground_Coral'),
    scoreTeleopL1: boolean('Score_Teleop_L1'),
    scoreTeleopL2: boolean('Score_Teleop_L2'),
    scoreTeleopL3: boolean('Score_Teleop_L3'),
    scoreTeleopL4: boolean('Score_Teleop_L4'),
    scoreTeleopProcessor: boolean('Score_Teleop_Processor'),
    scoreTeleopNet: boolean('Score_Teleop_Net'),
    scoreAutoL1: boolean('Score_Auto_L1'),
    scoreAutoL2: boolean('Score_Auto_L2'),
    scoreAutoL3: boolean('Score_Auto_L3'),
    scoreAutoL4: boolean('Score_Auto_L4'),
    scoreAutoProcessor: boolean('Score_Auto_Processor'),
    scoreAutoNet: boolean('Score_Auto_Net'),
    prefStartCenter: boolean('Pref_Start_Center'),
    prefStartAllyHP: boolean('Pref_Start_Ally_HP'),
    prefStartOppHP: boolean('Pref_Start_Opp_HP'),
    prefStartNone: boolean('Pref_Start_None'),
    autoIntakeHPCoral: boolean('Auto_Intake_HP_Coral'),
    autoIntakeGroundCoral: boolean('Auto_Intake_Ground_Coral'),
    autoMaxGamePieces: smallint('Auto_Max_Game_Pieces'),
    canShallowClimb: boolean('Can_Shallow_Climb'),
    canDeepClimb: boolean('Can_Deep_Climb'),
    noClimb: boolean('No_Climb'),
    notableFeatures: varchar('Notable_Features', { length: 100 }).notNull(),

    // 2025 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_pit2025Data').on(
      t.eventId,
      t.source,
      t.teamNumber,
      t.scoutName
    ),
  ]
);

export const casino2025DataTable = pgTable(
  'Casino2025Data',
  {
    // 2025 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    matchType: varchar('Match_Type', { length: 15 }).notNull(),
    matchNumber: smallint('Match_Number').notNull(),
    source: varchar('Source', { length: 10 }),
    scoutName: varchar('Scout_Name', { length: 40 }).notNull(),

    // 2025 season specific
    betColor: varchar('Bet_Color', { length: 4 }),
    autoColor: varchar('Auto_Color', { length: 4 }),
    winnerScoreOverUnder: varchar('Winner_Score_Over_Under', { length: 5 }),
    totalScoreOverUnder: varchar('Total_Score_Over_Under', { length: 5 }),
    betAmount: smallint('Bet_Amount').notNull(),

    // 2025 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_casino2025Data').on(
      t.eventId,
      t.matchType,
      t.matchNumber,
      t.source,
      t.scoutName
    ),
  ]
);

export const pickList2025Table = pgTable(
  'PickList2025',
  {
    // 2025 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    teamNumber: smallint('Team_Number').notNull(),

    pickIndex: smallint('Pick_Index').notNull(),
    allianceSelected: boolean('Alliance_Selected').notNull().default(false),

    // 2025 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [uniqueIndex('idx_u_picklist2025').on(t.eventId, t.teamNumber)]
);

export const doNotPickList2025Table = pgTable(
  'DoNotPickList2025',
  {
    // 2025 core fields
    eventId: varchar('Event_Id', { length: 20 })
      .notNull()
      .references(() => eventsTable.eventId),
    teamNumber: smallint('Team_Number').notNull(),
    reason: varchar('Reason').notNull(),

    // 2025 timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [uniqueIndex('idx_u_donotpicklist2025').on(t.eventId, t.teamNumber)]
);

export const EventMatches2025Result = pgTable(
  'EventMatches2025Result',
  {
    // core fields
    eventMatchId: varchar('Event_Match_Id', { length: 30 })
      .notNull()
      .references(() => eventMatchesTable.eventMatchId),
    allianceColor: varchar('Alliance_Color', { length: 5 }).notNull(),

    // 2025 season specific
    autoL4_A: boolean('Auto_L4_A').notNull(),
    autoL4_B: boolean('Auto_L4_B').notNull(),
    autoL4_C: boolean('Auto_L4_C').notNull(),
    autoL4_D: boolean('Auto_L4_D').notNull(),
    autoL4_E: boolean('Auto_L4_E').notNull(),
    autoL4_F: boolean('Auto_L4_F').notNull(),
    autoL4_G: boolean('Auto_L4_G').notNull(),
    autoL4_H: boolean('Auto_L4_H').notNull(),
    autoL4_I: boolean('Auto_L4_I').notNull(),
    autoL4_J: boolean('Auto_L4_J').notNull(),
    autoL4_K: boolean('Auto_L4_K').notNull(),
    autoL4_L: boolean('Auto_L4_L').notNull(),
    autoL3_A: boolean('Auto_L3_A').notNull(),
    autoL3_B: boolean('Auto_L3_B').notNull(),
    autoL3_C: boolean('Auto_L3_C').notNull(),
    autoL3_D: boolean('Auto_L3_D').notNull(),
    autoL3_E: boolean('Auto_L3_E').notNull(),
    autoL3_F: boolean('Auto_L3_F').notNull(),
    autoL3_G: boolean('Auto_L3_G').notNull(),
    autoL3_H: boolean('Auto_L3_H').notNull(),
    autoL3_I: boolean('Auto_L3_I').notNull(),
    autoL3_J: boolean('Auto_L3_J').notNull(),
    autoL3_K: boolean('Auto_L3_K').notNull(),
    autoL3_L: boolean('Auto_L3_L').notNull(),
    autoL2_A: boolean('Auto_L2_A').notNull(),
    autoL2_B: boolean('Auto_L2_B').notNull(),
    autoL2_C: boolean('Auto_L2_C').notNull(),
    autoL2_D: boolean('Auto_L2_D').notNull(),
    autoL2_E: boolean('Auto_L2_E').notNull(),
    autoL2_F: boolean('Auto_L2_F').notNull(),
    autoL2_G: boolean('Auto_L2_G').notNull(),
    autoL2_H: boolean('Auto_L2_H').notNull(),
    autoL2_I: boolean('Auto_L2_I').notNull(),
    autoL2_J: boolean('Auto_L2_J').notNull(),
    autoL2_K: boolean('Auto_L2_K').notNull(),
    autoL2_L: boolean('Auto_L2_L').notNull(),
    autoL1: smallint('Auto_L1').notNull(),

    autoCoralCount: smallint('Auto_Coral_Count').notNull(),
    autoMobilityPoints: smallint('Auto_Mobility_Points').notNull(),
    autoPoints: smallint('Auto_Points').notNull(),
    autoCoralPoints: smallint('Auto_Coral_Points').notNull(),

    teleopL4_A: boolean('Teleop_L4_A').notNull(),
    teleopL4_B: boolean('Teleop_L4_B').notNull(),
    teleopL4_C: boolean('Teleop_L4_C').notNull(),
    teleopL4_D: boolean('Teleop_L4_D').notNull(),
    teleopL4_E: boolean('Teleop_L4_E').notNull(),
    teleopL4_F: boolean('Teleop_L4_F').notNull(),
    teleopL4_G: boolean('Teleop_L4_G').notNull(),
    teleopL4_H: boolean('Teleop_L4_H').notNull(),
    teleopL4_I: boolean('Teleop_L4_I').notNull(),
    teleopL4_J: boolean('Teleop_L4_J').notNull(),
    teleopL4_K: boolean('Teleop_L4_K').notNull(),
    teleopL4_L: boolean('Teleop_L4_L').notNull(),
    teleopL3_A: boolean('Teleop_L3_A').notNull(),
    teleopL3_B: boolean('Teleop_L3_B').notNull(),
    teleopL3_C: boolean('Teleop_L3_C').notNull(),
    teleopL3_D: boolean('Teleop_L3_D').notNull(),
    teleopL3_E: boolean('Teleop_L3_E').notNull(),
    teleopL3_F: boolean('Teleop_L3_F').notNull(),
    teleopL3_G: boolean('Teleop_L3_G').notNull(),
    teleopL3_H: boolean('Teleop_L3_H').notNull(),
    teleopL3_I: boolean('Teleop_L3_I').notNull(),
    teleopL3_J: boolean('Teleop_L3_J').notNull(),
    teleopL3_K: boolean('Teleop_L3_K').notNull(),
    teleopL3_L: boolean('Teleop_L3_L').notNull(),
    teleopL2_A: boolean('Teleop_L2_A').notNull(),
    teleopL2_B: boolean('Teleop_L2_B').notNull(),
    teleopL2_C: boolean('Teleop_L2_C').notNull(),
    teleopL2_D: boolean('Teleop_L2_D').notNull(),
    teleopL2_E: boolean('Teleop_L2_E').notNull(),
    teleopL2_F: boolean('Teleop_L2_F').notNull(),
    teleopL2_G: boolean('Teleop_L2_G').notNull(),
    teleopL2_H: boolean('Teleop_L2_H').notNull(),
    teleopL2_I: boolean('Teleop_L2_I').notNull(),
    teleopL2_J: boolean('Teleop_L2_J').notNull(),
    teleopL2_K: boolean('Teleop_L2_K').notNull(),
    teleopL2_L: boolean('Teleop_L2_L').notNull(),
    teleopL1: smallint('Teleop_L1').notNull(),

    teleopCoralCount: smallint('Teleop_Coral_Count').notNull(),
    teleopPoints: smallint('Teleop_Points').notNull(),
    teleopCoralPoints: smallint('Teleop_Coral_Points').notNull(),

    algaePoints: smallint('Algae_Points').notNull(),
    netAlgaeCount: smallint('Net_Algae_Count').notNull(),
    wallAlgaeCount: smallint('Wall_Algae_Count').notNull(),
    endgameBargePoints: smallint('Endgame_Barge_Points').notNull(),

    autoBonusAchieved: boolean('Auto_Bonus_Achieved').notNull(),
    coralBonusAchieved: boolean('Coral_Bonus_Achieved').notNull(),
    bargeBonusAchieved: boolean('Barge_Bonus_Achieved').notNull(),
    coopertitionCriteriaMet: boolean('Coopertition_Criteria_Met').notNull(),
    foulCount: smallint('Foul_Count').notNull(),
    g206Penalty: boolean('G206_Penalty').notNull(),
    g410Penalty: boolean('G410_Penalty').notNull(),
    g418Penalty: boolean('G418_Penalty').notNull(),
    g428Penalty: boolean('G428_Penalty').notNull(),
    anjustPoints: smallint('Anjust_Points').notNull(),
    foulPoints: smallint('Foul_Points').notNull(),
    rp: smallint('RP').notNull(),
    totalPoints: smallint('Total_Points').notNull(),

    // timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_eventmatches2025result').on(
      t.eventMatchId,
      t.allianceColor
    ),
  ]
);

export const EventMatches2025TbaResult = pgTable(
  'EventMatches2025TbaResult',
  {
    // core fields
    eventMatchId: varchar('Event_Match_Id', { length: 30 })
      .notNull()
      .references(() => eventMatchesTable.eventMatchId),
    // 2025 season specific
    videoKey: varchar('videoKey', { length: 20 }),
    videoType: varchar('videoType', { length: 50 }),

    // timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [uniqueIndex('idx_u_eventmatches2025tbaresult').on(t.eventMatchId)]
);

export const EventMatchTeams2025Result = pgTable(
  'EventMatchTeams2025Result',
  {
    // core fields
    eventMatchId: varchar('Event_Match_Id', { length: 30 })
      .notNull()
      .references(() => eventMatchesTable.eventMatchId),
    allianceColor: varchar('Alliance_Color', { length: 5 }).notNull(),
    alliancePosition: smallint('Alliance_Position').notNull(),

    // 2025 season specific

    leave: varchar('Leave', { length: 20 }).notNull(),
    endgame: varchar('Endgame', { length: 15 }).notNull(),

    // timestamp fields
    createdAt: timestamp('Created_At').notNull().defaultNow(),
    updatedAt: timestamp('Updated_At')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    syncedAt: timestamp('Synced_At'),
  },
  (t) => [
    uniqueIndex('idx_u_eventmatchteams2025result').on(
      t.eventMatchId,
      t.allianceColor,
      t.alliancePosition
    ),
  ]
);

export type SelectSeason = typeof seasonsTable.$inferSelect;
export type SelectEvent = typeof eventsTable.$inferSelect;
export type SelectEventTeam = typeof eventTeamsTable.$inferSelect;
export type SelectEventMatch = typeof eventMatchesTable.$inferSelect;
export type SelectLeader2024Data = typeof leader2024DataTable.$inferSelect;
export type SelectLeader2025Data = typeof leader2025DataTable.$inferSelect;
export type SelectMatch2024Data = typeof match2024DataTable.$inferSelect;
export type SelectMatch2025Data = typeof match2025DataTable.$inferSelect;
export type SelectCasino2025Data = typeof casino2025DataTable.$inferSelect;
export type SelectPit2024Data = typeof pit2024DataTable.$inferSelect;
export type SelectPit2025Data = typeof pit2025DataTable.$inferSelect;
export type SelectPickList2025Data = typeof pickList2025Table.$inferSelect;
export type SelectDoNotPick2025Data =
  typeof doNotPickList2025Table.$inferSelect;

export type InsertLeader2025Data = typeof leader2025DataTable.$inferInsert;
export type InsertMatch2025Data = typeof match2025DataTable.$inferInsert;
export type InsertCasino2025Data = typeof casino2025DataTable.$inferInsert;
export type InsertPit2025Data = typeof pit2025DataTable.$inferInsert;
export type InsertEvent = typeof eventsTable.$inferInsert;
export type InsertEventTeam = typeof eventTeamsTable.$inferInsert;
export type InsertEventMatch = typeof eventMatchesTable.$inferInsert;
export type InsertEventMatchTeam = typeof eventMatchTeamsTable.$inferInsert;
export type InsertPickList2025Data = typeof pickList2025Table.$inferInsert;
export type InsertDoNotPickList2025Data =
  typeof doNotPickList2025Table.$inferInsert;
export type InsertEventMatches2025Result =
  typeof EventMatches2025Result.$inferInsert;
export type InsertEventMatchTeams2025Result =
  typeof EventMatchTeams2025Result.$inferInsert;
export type InsertEventMatches2025TbaResult =
  typeof EventMatches2025TbaResult.$inferInsert;
