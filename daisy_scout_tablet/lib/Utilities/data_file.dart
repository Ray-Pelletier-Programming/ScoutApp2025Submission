import 'package:daisy_scout_tablet/Enums/tablet_color_extension.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position_extension.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';

final class DataFile {
  late final String _activeComp;
  late final String _dataType;
  late final int _fileCount;
  late final TabletIdentity _tabletIdentity;

  int get _nextFileNum => _fileCount + 1;

  String get _fileNumStr => _nextFileNum.toString().padLeft(3, '0');

  DataFile(TabletIdentity tabletIdentity, String activeComp, String dataType,
      int fileCount) {
    _tabletIdentity = tabletIdentity;
    _activeComp = activeComp;
    _dataType = dataType;
    _fileCount = fileCount;
  }

  //2024paphi-r1-pit-#.json -- where # is one more than the count of files for the season's active comp.
  String get fileName =>
      "${_tabletIdentity.compSeason}$_activeComp-${_tabletIdentity.tabletColor.code}${_tabletIdentity.tabletPosition.label}-$_dataType-$_fileNumStr.json";
}
