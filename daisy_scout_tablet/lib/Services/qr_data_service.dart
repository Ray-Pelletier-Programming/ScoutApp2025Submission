import 'package:daisy_scout_tablet/Constants/daisy_constants.dart';
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color_extension.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position_extension.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/globals.dart';
import 'package:flutter/foundation.dart';

final class QrDataService {
  static String encodeScoutDataForQR(DataFolder folder,
      Map<String, dynamic> scoutData, TabletIdentity tabletIdentity) {
    String result = "";

    print("data to encode ${scoutData.toString()}");

    String source = kIsWeb ? 'web' : 'tablet';

    switch (folder) {
      case DataFolder.pit:
        result = _encodePitData(scoutData, tabletIdentity, source);
        break;
      case DataFolder.match:
        result = _encodeMatchData(scoutData, tabletIdentity, source);
        break;
      case DataFolder.leader:
        result = _encodeLeaderData(scoutData, tabletIdentity, source);
        break;
      case DataFolder.elims:
        result = _encodeElimsData(scoutData, tabletIdentity, source);
    }

    print("generated QR string $result");
    return result;
  }

  static String _encodePitData(Map<String, dynamic> scoutData,
      TabletIdentity tabletIdentity, String source) {
    // loop through list and append the values in a prefered sequence based for the type of data
    return "p${DaisyConstants.qrFieldSeparator}${scoutData['ScoutName']}${ //1
        DaisyConstants.qrFieldSeparator}${scoutData['TeamNumber']}${ //2
        DaisyConstants.qrFieldSeparator}${scoutData['Drivetrain']}${ //3
        DaisyConstants.qrFieldSeparator}${scoutData['RobotWidth']}${ //4
        DaisyConstants.qrFieldSeparator}${scoutData['RobotLength']}${ //5
        DaisyConstants.qrFieldSeparator}${scoutData['HumanPlayer']}${ //6
        DaisyConstants.qrFieldSeparator}${scoutData['CanIntakeLocations']}${ //7
        DaisyConstants.qrFieldSeparator}${scoutData['CanAutoScoreLocations']}${ //8
        DaisyConstants.qrFieldSeparator}${scoutData['CanTeleopScoreLocations']}${ //9
        DaisyConstants.qrFieldSeparator}${scoutData['PrefStartLoc']}${ //10
        DaisyConstants.qrFieldSeparator}${scoutData['CanAutoIntakeLocations']}${ //11
        DaisyConstants.qrFieldSeparator}${scoutData['MaxGamepiecesAuto']}${ //12
        DaisyConstants.qrFieldSeparator}${scoutData['CanClimb']}${ //13
        DaisyConstants.qrFieldSeparator}${scoutData['NotableFeat']}${ //14
        DaisyConstants.qrFieldSeparator}${tabletIdentity.compSeason}${ //15
        DaisyConstants.qrFieldSeparator}${tabletIdentity.activeComp}${ //16
        DaisyConstants.qrFieldSeparator}$source"; //17
  }

  static String _encodeMatchData(Map<String, dynamic> scoutData,
      TabletIdentity tabletIdentity, String source) {
    if (casinoCache.isEmpty) {
      casinoCache['BET_AMOUNT'] = 0;
      casinoCache['BET_COLOR'] = null;
      casinoCache['AUTO_COLOR'] = null;
      casinoCache['WINNER_SCORE_OVER_UNDER'] = null;
      casinoCache['TOTAL_SCORE_OVER_UNDER'] = null;
    }

    // loop through list and append the values in a prefered sequence based for the type of data
    String data = "m${ // match
        DaisyConstants.qrFieldSeparator}${tabletIdentity.tabletColor.code}${ //1
        DaisyConstants.qrFieldSeparator}${tabletIdentity.tabletPosition.label}${ //2
        DaisyConstants.qrFieldSeparator}${scoutData['MatchNumber']}${ //3
        DaisyConstants.qrFieldSeparator}${scoutData['TeamNumber']}${ //4
        DaisyConstants.qrFieldSeparator}${scoutData['ScoutName']}${ //5
        DaisyConstants.qrFieldSeparator}${scoutData['ASL']}${ //6
        DaisyConstants.qrFieldSeparator}${scoutData['AutoReefL1']}${ //7
        DaisyConstants.qrFieldSeparator}${scoutData['AutoReefL2']}${ //8
        DaisyConstants.qrFieldSeparator}${scoutData['AutoReefL3']}${ //9
        DaisyConstants.qrFieldSeparator}${scoutData['AutoReefL4']}${ //10
        DaisyConstants.qrFieldSeparator}${scoutData['CoralA']}${ //11
        DaisyConstants.qrFieldSeparator}${scoutData['CoralB']}${ //12
        DaisyConstants.qrFieldSeparator}${scoutData['CoralC']}${ //13
        DaisyConstants.qrFieldSeparator}${scoutData['CoralD']}${ //14
        DaisyConstants.qrFieldSeparator}${scoutData['CoralE']}${ //15
        DaisyConstants.qrFieldSeparator}${scoutData['CoralF']}${ //16
        DaisyConstants.qrFieldSeparator}${scoutData['Leave']}${ //17
        DaisyConstants.qrFieldSeparator}${scoutData['AutoNet']}${ //18
        DaisyConstants.qrFieldSeparator}${scoutData['AutoProcessor']}${ //19
        DaisyConstants.qrFieldSeparator}${scoutData['TeleopReefL1']}${ //20
        DaisyConstants.qrFieldSeparator}${scoutData['TeleopReefL2']}${ //21
        DaisyConstants.qrFieldSeparator}${scoutData['TeleopReefL3']}${ //22
        DaisyConstants.qrFieldSeparator}${scoutData['TeleopReefL4']}${ //23
        DaisyConstants.qrFieldSeparator}${scoutData['TeleopProcessor']}${ //24
        DaisyConstants.qrFieldSeparator}${scoutData['TeleopNet']}${ //25
        DaisyConstants.qrFieldSeparator}${scoutData['Endgame']}${ //26
        DaisyConstants.qrFieldSeparator}${tabletIdentity.compSeason}${ //27
        DaisyConstants.qrFieldSeparator}${tabletIdentity.activeComp}${ //28
        DaisyConstants.qrFieldSeparator}$source${ //29
        DaisyConstants.qrFieldSeparator}${casinoCache['BET_AMOUNT']}${ //30
        DaisyConstants.qrFieldSeparator}${casinoCache['BET_COLOR']}${ //31
        DaisyConstants.qrFieldSeparator}${casinoCache['AUTO_COLOR']}${ //32
        DaisyConstants.qrFieldSeparator}${casinoCache['WINNER_SCORE_OVER_UNDER']}${ //33
        DaisyConstants.qrFieldSeparator}${casinoCache['TOTAL_SCORE_OVER_UNDER']}${ //34
        DaisyConstants.qrFieldSeparator}${scoutData['TeleopAlgaeRemoved']}"; //35

    casinoCache = {};

    print(data);

    return data;
  }

  static String _encodeLeaderData(Map<String, dynamic> scoutData,
      TabletIdentity tabletIdentity, String source) {
    // loop through list and append the values in a prefered sequence based for the type of data
    return "l${DaisyConstants.qrFieldSeparator}${scoutData['MatchNumber']}${ //1
        DaisyConstants.qrFieldSeparator}${scoutData['ScoutName']}${ // FIRST ROBOT 2
        DaisyConstants.qrFieldSeparator}${scoutData['Team1']}${ //3
        DaisyConstants.qrFieldSeparator}${scoutData['DriverAbility1']}${ //4
        DaisyConstants.qrFieldSeparator}${scoutData['Break1']}${ //5
        DaisyConstants.qrFieldSeparator}${scoutData['PrimRole1']}${ //6
        DaisyConstants.qrFieldSeparator}${scoutData['OtherNotes1']}${ // SECOND ROBOT 7
        DaisyConstants.qrFieldSeparator}${scoutData['Team2']}${ //8
        DaisyConstants.qrFieldSeparator}${scoutData['DriverAbility2']}${ //9
        DaisyConstants.qrFieldSeparator}${scoutData['Break2']}${ //10
        DaisyConstants.qrFieldSeparator}${scoutData['PrimRole2']}${ //11
        DaisyConstants.qrFieldSeparator}${scoutData['OtherNotes2']}${ //  THIRD ROBOT 12
        DaisyConstants.qrFieldSeparator}${scoutData['Team3']}${ //13
        DaisyConstants.qrFieldSeparator}${scoutData['DriverAbility3']}${ //14
        DaisyConstants.qrFieldSeparator}${scoutData['Break3']}${ //15
        DaisyConstants.qrFieldSeparator}${scoutData['PrimRole3']}${ //16
        DaisyConstants.qrFieldSeparator}${scoutData['OtherNotes3']}${ //  HUMAN PLAYER 17
        DaisyConstants.qrFieldSeparator}${scoutData['NetShotsMade']}${ //18
        DaisyConstants.qrFieldSeparator}${scoutData['NetShotsMissed']}${ //19
        DaisyConstants.qrFieldSeparator}${tabletIdentity.tabletColor.code}${ //20
        DaisyConstants.qrFieldSeparator}${tabletIdentity.compSeason}${ //21
        DaisyConstants.qrFieldSeparator}${tabletIdentity.activeComp}${ //22
        DaisyConstants.qrFieldSeparator}$source${ //23
        DaisyConstants.qrFieldSeparator}${scoutData['HPTeamNumber']}"; //24

    // DaisyConstants.qrFieldSeparator}${scoutData['NoShowOne']}${ //25
    // DaisyConstants.qrFieldSeparator}${scoutData['NoShowTwo']}${ //26
    // DaisyConstants.qrFieldSeparator}${scoutData['NoShowThree']}"; //27
  }

  static String _encodeElimsData(Map<String, dynamic> scoutData,
      TabletIdentity tabletIdentity, String source) {
    // loop through list and append the values in a prefered sequence based for the type of data
    return "e${DaisyConstants.qrFieldSeparator}${scoutData['MatchNumber']}${DaisyConstants.qrFieldSeparator}${scoutData['ScoutName']}${DaisyConstants.qrFieldSeparator}${scoutData['Team1']}${DaisyConstants.qrFieldSeparator}${scoutData['Team2']}${DaisyConstants.qrFieldSeparator}${scoutData['Team3']}${DaisyConstants.qrFieldSeparator}${scoutData['PrimRole1']}${DaisyConstants.qrFieldSeparator}${scoutData['PrimRole2']}${DaisyConstants.qrFieldSeparator}${scoutData['PrimRole3']}${DaisyConstants.qrFieldSeparator}${scoutData['OtherNotes1']}${DaisyConstants.qrFieldSeparator}${scoutData['OtherNotes2']}${DaisyConstants.qrFieldSeparator}${scoutData['OtherNotes3']}${DaisyConstants.qrFieldSeparator}${scoutData['AllianceNotes']}";
  }

  static (DataFolder, Map<String, dynamic>) decodeScoutDataForQR(
      String qrData) {
    List<String> qrDataArray = qrData.split(DaisyConstants.qrFieldSeparator);

    DataFolder folder;
    Map<String, dynamic> data;

    print("received QR string $qrData");

    switch (qrDataArray[0]) {
      case 'p':
        folder = DataFolder.pit;
        data = _decodePitData(qrDataArray);
        break;
      case 'm':
        folder = DataFolder.match;
        data = _decodeMatchData(qrDataArray);
        break;
      case 'l':
        folder = DataFolder.leader;
        data = _decodeLeaderData(qrDataArray);
        break;
      case 'e':
        folder = DataFolder.elims;
        data = _decodeElimsData(qrDataArray);
      default:
        throw Exception("Need to add new Folder Type here...");
    }

    debugPrint("Decoded QR String ${data.toString()}");

    return (folder, data);
  }

  static Map<String, dynamic> _decodePitData(List<String> qrDataList) {
    // loop through list starting with element 1 (since 0 got us to this function)
    // get name for position and build name-value pairs to return.
    Map<String, dynamic> decodedPitData = {
      'ScoutName': qrDataList[1],
      'TeamNumber': qrDataList[2],
      'DriveTrain': qrDataList[3],
      'RobotWidth': qrDataList[4],
      'RobotLength': qrDataList[5],
      'HumanPlayer': qrDataList[6],
      'CanIntakeLocations': qrDataList[7],
      'CanAutoScoreLocations': qrDataList[8],
      'CanTeleopScoreLocations': qrDataList[9],
      'PrefStartLoc': qrDataList[10],
      'CanAutoIntakeLocations': qrDataList[11],
      'MaxGamepiecesAuto': qrDataList[12],
      'CanClimb': qrDataList[13],
      'NotableFeat': qrDataList[14],
      'Season': qrDataList[15],
      'CompetitionID': qrDataList[16],
      'Source': qrDataList[17]
    };
    return decodedPitData;
  }

  static Map<String, dynamic> _decodeMatchData(List<String> qrDataList) {
    // loop through list starting with element 1 (since 0 got us to this function)
    // get name for position and build name-value pairs to return.
    Map<String, dynamic> decodedMatchData = {
      'MatchType': "qual",
      'TabletColor': qrDataList[1],
      'TabletPosition': qrDataList[2],
      'MatchNumber': qrDataList[3],
      'TeamNumber': qrDataList[4],
      'ScoutName': qrDataList[5],
      'ASL': qrDataList[6],
      'AutoReefL1': qrDataList[7],
      'AutoReefL2': qrDataList[8],
      'AutoReefL3': qrDataList[9],
      'AutoReefL4': qrDataList[10],
      'CoralA': qrDataList[11],
      'CoralB': qrDataList[12],
      'CoralC': qrDataList[13],
      'CoralD': qrDataList[14],
      'CoralE': qrDataList[15],
      'CoralF': qrDataList[16],
      'Leave': qrDataList[17],
      'AutoNet': qrDataList[18],
      'AutoProcessor': qrDataList[19],
      'TeleopReefL1': qrDataList[20],
      'TeleopReefL2': qrDataList[21],
      'TeleopReefL3': qrDataList[22],
      'TeleopReefL4': qrDataList[23],
      'TeleopProcessor': qrDataList[24],
      'TeleopNet': qrDataList[25],
      'Endgame': qrDataList[26],
      'Season': qrDataList[27],
      'CompetitionID': qrDataList[28],
      'Source': qrDataList[29],
      'BetAmount': qrDataList[30],
      'BetColor': qrDataList[31],
      'AutoColor': qrDataList[32],
      'WinnerScoreOverUnder': qrDataList[33],
      'TotalScoreOverUnder': qrDataList[34],
      'TeleopAlgaeRemoved': qrDataList[35]
    };
    print(decodedMatchData);
    return decodedMatchData;
  }

  static Map<String, dynamic> _decodeLeaderData(List<String> qrDataList) {
    // loop through list starting with element 1 (since 0 got us to this function)
    // get name for position and build name-value pairs to return.
    Map<String, dynamic> decodedLeaderData = {
      'MatchType': "qual",
      'MatchNumber': qrDataList[1],
      'ScoutName': qrDataList[2],
      'Team1': qrDataList[3],
      'DriverAbility1': qrDataList[4],
      'Break1': qrDataList[5],
      'PrimRole1': qrDataList[6],
      'OtherNotes1': qrDataList[7],
      'Team2': qrDataList[8],
      'DriverAbility2': qrDataList[9],
      'Break2': qrDataList[10],
      'PrimRole2': qrDataList[11],
      'OtherNotes2': qrDataList[12],
      'Team3': qrDataList[13],
      'DriverAbility3': qrDataList[14],
      'Break3': qrDataList[15],
      'PrimRole3': qrDataList[16],
      'OtherNotes3': qrDataList[17],
      'NetShotsMade': qrDataList[18],
      'NetShotsMissed': qrDataList[19],
      'TabletColor': qrDataList[20],
      'Season': qrDataList[21],
      'CompetitionID': qrDataList[22],
      'Source': qrDataList[23],
      'HPTeamNumber': qrDataList[24],
      // 'NoShowOne': qrDataList[25],
      // 'NoShowTwo': qrDataList[26],
      // 'NoShowThree': qrDataList[27]
    };
    debugPrint("after decodedLeaderData");
    return decodedLeaderData;
  }

  static Map<String, dynamic> _decodeElimsData(List<String> qrDataList) {
    // loop through list starting with element 1 (since 0 got us to this function)
    // get name for position and build name-value pairs to return.
    Map<String, dynamic> decodedElimsData = {
      'MatchNumber': qrDataList[1],
      'ScoutName': qrDataList[2],
      'Team1': qrDataList[3],
      'Team2': qrDataList[4],
      'Team3': qrDataList[5],
      'PrimRole1': qrDataList[6],
      'PrimRole2': qrDataList[7],
      'PrimRole3': qrDataList[8],
      'OtherNotes1': qrDataList[9],
      'OtherNotes2': qrDataList[10],
      'OtherNotes3': qrDataList[11],
      'AllianceNotes': qrDataList[12]
    };
    return decodedElimsData;
  }

  static getDataType(String qrData) {
    List<String> qrDataArray = qrData.split(DaisyConstants.qrFieldSeparator);
    return qrDataArray[0];
  }
}
