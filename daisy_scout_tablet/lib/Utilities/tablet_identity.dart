import 'dart:convert';
import 'package:daisy_scout_tablet/Enums/field_side.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position.dart';
import 'package:daisy_scout_tablet/Enums/tablet_mode.dart';
import 'package:daisy_scout_tablet/Services/daisy_storage.dart';
import 'package:flutter/material.dart';

class TabletIdentity with ChangeNotifier {
  TabletColor _tabletColor = TabletColor.blue;
  FieldSide _fieldSide = FieldSide.table;
  TabletPosition _tabletPosition = TabletPosition.one;
  TabletMode _tabletMode = TabletMode.scouting;
  int _compSeason = 2025;
  String _activeComp = "";

  TabletColor get tabletColor => _tabletColor;
  TabletPosition get tabletPosition => _tabletPosition;
  TabletMode get tabletMode => _tabletMode;
  int get compSeason => _compSeason;
  String get activeComp => _activeComp;
  FieldSide get fieldSide => _fieldSide;

  Future<void> set(
      TabletColor allianceColor,
      TabletPosition alliancePosition,
      TabletMode tabletMode,
      int compSeason,
      String activeComp,
      FieldSide fieldSide) async {
    _tabletColor = allianceColor;
    _tabletPosition = alliancePosition;
    _tabletMode = tabletMode;
    _compSeason = compSeason;
    _activeComp = activeComp;
    _fieldSide = fieldSide;
    var encodedData = json.encode(toJson());
    await DaisyStorage.saveConfig("config.json", encodedData);
  }

  Future<void> load() async {
    String? str = await DaisyStorage.getConfig("config.json");
    if (str != null) {
      Map<String, dynamic> config = jsonDecode(str) as Map<String, dynamic>;
      if (config.isNotEmpty) {
        _tabletColor = getAllianceColorFromString(config['tablet_color']);
        _tabletPosition =
            getAlliancePositionFromString(config['tablet_number']);
        _tabletMode = getTabletModeFromString(config['tablet_mode']);
        _compSeason = int.parse(config['comp_season'] ?? _compSeason);
        _activeComp = config['active_comp'] ?? "";
        _fieldSide = getFieldSideFromString(config['field_side']);
      }
    }
  }

  TabletMode getTabletModeFromString(String modeAsString) {
    for (TabletMode element in TabletMode.values) {
      if (element.toString() == modeAsString) {
        return element;
      }
    }
    return _tabletMode;
  }

  TabletColor getAllianceColorFromString(String colorAsString) {
    for (TabletColor element in TabletColor.values) {
      if (element.toString() == colorAsString) {
        return element;
      }
    }
    return _tabletColor;
  }

  TabletPosition getAlliancePositionFromString(String positionAsString) {
    for (TabletPosition element in TabletPosition.values) {
      if (element.toString() == positionAsString) {
        return element;
      }
    }
    return _tabletPosition;
  }

  FieldSide getFieldSideFromString(String? fieldSideAsString) {
    for (FieldSide element in FieldSide.values) {
      if (element.toString() == fieldSideAsString) {
        return element;
      }
    }
    return _fieldSide;
  }

  // Define a toJson method to convert User object to JSON
  Map<String, dynamic> toJson() {
    return {
      'tablet_number': tabletPosition.toString(),
      'tablet_color': tabletColor.toString(),
      'tablet_mode': tabletMode.toString(),
      'comp_season': compSeason.toString(),
      'active_comp': activeComp,
      'field_side': fieldSide.toString(),
    };
  }
}
