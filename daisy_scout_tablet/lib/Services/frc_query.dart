import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color_extension.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position_extension.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:http/http.dart' as http;
import 'dart:convert' as convert;

import 'package:daisy_scout_tablet/globals.dart';

void clearData() {
  matchScheduleJson = [];
}

Future<void> updateJson(int season, String eventCode) async {
  var url = Uri.parse(
      'https://frc-api.firstinspires.org/v3.0/$season/schedule/$eventCode?tournamentLevel=qual');

  var username = dotenv.env["FRCAPI_User"];
  var password = dotenv.env["FRCAPI_Pass"];
  String basicAuth =
      'Basic ${convert.base64.encode(convert.utf8.encode('$username:$password'))}';

  var headers = {'authorization': basicAuth, 'accept': 'application/json'};

  if (kIsWeb) {
    // if we are running in the browser, the above will not work due to CORS
    url = Uri.parse(
        "http://localhost:8080/api/seasons/$season/events/$eventCode/match-schedule");
    headers = {'accept': 'application/json'};
  }

  var response = await http.get(url, headers: headers).timeout(
      const Duration(seconds: 15),
      onTimeout: () => http.Response('Error', 408));
  if (response.statusCode == 408) {
    throw ErrorDescription("No data available");
  }
  var jsonResponse =
      convert.jsonDecode(response.body)['Schedule'] as List<dynamic>;

  // save event to response
  for (var match in jsonResponse) {
    match['event_key'] = eventCode;
  }

  matchScheduleJson = List.from(jsonResponse);
}

Future<int?> getTeam(TabletColor allianceColor, TabletPosition alliancePosition,
    int matchNumber) async {
  if (matchScheduleJson.isEmpty) throw ErrorDescription("Empty data");
  String color = allianceColor.code;
  int scoutingNumber = int.parse(alliancePosition.label);
  return _queryTeam(color, scoutingNumber, matchNumber);
}

int? _queryTeam(String color, int scoutingNumber, int matchNumber) {
  var value = matchScheduleJson.firstWhere((element) {
    return element['matchNumber'] == matchNumber;
  }, orElse: () => null);
  if (value == null) {
    return null;
  }
  color = color == 'B' ? 'blue' : 'red';
  var station = color + scoutingNumber.toString().toLowerCase();
  var res = value['teams'].firstWhere(
      (team) => team['station'].toLowerCase() == station,
      orElse: () => null);

  if (res == null) {
    return null;
  }
  var teamNum = res['teamNumber'].toString();

  return int.tryParse(teamNum);
}
