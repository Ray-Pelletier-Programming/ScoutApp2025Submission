import 'package:daisy_scout_tablet/Enums/tablet_position.dart';

extension TabletPositionExtension on TabletPosition {
  String get label {
    switch (this) {
      case TabletPosition.one:
        return '1';
      case TabletPosition.two:
        return '2';
      case TabletPosition.three:
        return '3';
    }
  }

  static TabletPosition getTabletPosition(String label) {
    switch (label) {
      case '2':
        return TabletPosition.two;
      case '3':
        return TabletPosition.three;
      default:
        return TabletPosition.one;
    }
  }
}
