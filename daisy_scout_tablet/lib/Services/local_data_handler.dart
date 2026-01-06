import 'package:daisy_scout_tablet/Services/daisy_storage.dart';
import 'package:daisy_scout_tablet/globals.dart';

import 'dart:convert' as convert;

//TODO: This will not guarantee the match data was for the same season.
// Need to store season in the cached data too.
Future<void> fetchLocalMatchScheduleData(String curComp) async {
  String? str = await DaisyStorage.getConfig('MatchScheduleCache.json');
  if (str != null) {
    matchScheduleJson = convert.jsonDecode(str) as List<dynamic>;
  }
  if (matchScheduleJson.isNotEmpty) {
    if (matchScheduleJson[0].containsKey('event_key')) {
      // if the stored config is for a different match schedule, clear it
      if (curComp != matchScheduleJson[0]['event_key'].toString()) {
        matchScheduleJson = [];
      }
    }
  }
}

void saveLocalMatchScheduleData() async {
  await DaisyStorage.saveConfig(
      'MatchScheduleCache.json', convert.jsonEncode(matchScheduleJson));
}
