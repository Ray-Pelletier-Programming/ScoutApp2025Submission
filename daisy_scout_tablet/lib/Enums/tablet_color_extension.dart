import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Constants/daisy_colors.dart';
import 'package:flutter/material.dart';

extension TabletColorExtension on TabletColor {
  bool isBlue() {
    return this == TabletColor.blue;
  }

  bool isRed() {
    return this == TabletColor.red;
  }

  Color get color {
    switch (this) {
      case TabletColor.red:
        return DaisyColors.redAlliance;
      case TabletColor.blue:
        return DaisyColors.blueAlliance;
    }
  }

  String get label {
    switch (this) {
      case TabletColor.red:
        return "Red";
      case TabletColor.blue:
        return "Blue";
    }
  }

  String get code {
    switch (this) {
      case TabletColor.red:
        return "R";
      case TabletColor.blue:
        return "B";
    }
  }

  static TabletColor getTabletColor(String code) {
    if (code.toString().toUpperCase() == "R") {
      return TabletColor.red;
    }
    return TabletColor.blue;
  }
}
