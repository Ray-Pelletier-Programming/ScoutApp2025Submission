import 'package:daisy_scout_tablet/Enums/data_folder.dart';

extension DataFolderExtension on DataFolder {
  String get folderName {
    switch (this) {
      case DataFolder.pit:
        return "PitData";
      case DataFolder.match:
        return "MatchData";
      case DataFolder.leader:
        return "LeaderData";
      case DataFolder.elims:
        return "ElimsData";
    }
  }

  String get fileType {
    switch (this) {
      case DataFolder.pit:
        return "pit";
      case DataFolder.match:
        return "match";
      case DataFolder.leader:
        return "leader";
      case DataFolder.elims:
        return "elims";
    }
  }
}
