import 'package:daisy_scout_tablet/Enums/field_side.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position.dart';
import 'package:daisy_scout_tablet/Constants/daisy_colors.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color_extension.dart';
import 'package:daisy_scout_tablet/Services/local_data_handler.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Enums/tablet_mode.dart';
import 'package:daisy_scout_tablet/Constants/custom_icons.dart';
import 'package:daisy_scout_tablet/Utilities/ui_functions.dart';
import 'package:daisy_scout_tablet/FormObjects/radio_group.dart';
import 'package:daisy_scout_tablet/Widgets/navigation_drawer_custom.dart';
import 'package:daisy_scout_tablet/Services/frc_query.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import 'package:daisy_scout_tablet/Utilities/field_info.dart';
import 'package:daisy_scout_tablet/FormObjects/text_field_obj.dart';
import 'package:provider/provider.dart';

class ConfigPage extends StatefulWidget {
  const ConfigPage({super.key});

  @override
  State<StatefulWidget> createState() => _ConfigPage();
}

class _ConfigPage extends State<ConfigPage> {
  final GlobalKey<FormBuilderState> _configKey = GlobalKey<FormBuilderState>();

  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(centerTitle: true, title: const Text("Config")),
        drawer: NavigationDrawerCustom(),
        body: SingleChildScrollView(
            child: Column(children: [
          FormBuilder(
              key: _configKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: RadioGroupObj(
                          context,
                          "Field Side",
                          "FIELD_SIDE",
                          const [
                            FormBuilderChipOption(
                                value: FieldSide.table,
                                child: Text('Table Side')),
                            FormBuilderChipOption(
                                value: FieldSide.nontable,
                                child: Text('Nontable Side')),
                          ],
                          initialValue: _tabletIdentity.fieldSide,
                          validator: (value) {
                            if (value == null) {
                              return "Select one";
                            }
                            return null;
                          },
                        ),
                      ),
                      Expanded(
                        child: RadioGroupObj(
                          context,
                          "Tablet Color",
                          "_TAB_COLOR",
                          [
                            FormBuilderChipOption(
                              value: TabletColor.blue,
                              avatar: Icon(CustomIcons.robot,
                                  color: DaisyColors.blueAlliance, size: 15.0),
                              child: Text(TabletColor.blue.code),
                            ),
                            FormBuilderChipOption(
                              value: TabletColor.red,
                              avatar: Icon(
                                CustomIcons.robot,
                                color: DaisyColors.redAlliance,
                                size: 15.0,
                              ),
                              child: Text(TabletColor.red.code),
                            ),
                          ],
                          initialValue: _tabletIdentity.tabletColor,
                          validator: (value) {
                            if (value == null) {
                              return "Select one";
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: RadioGroupObj(
                          context,
                          "Tablet Number",
                          "_NUMBER",
                          const [
                            FormBuilderChipOption(
                              value: TabletPosition.one,
                              child: Text("1"),
                            ),
                            FormBuilderChipOption(
                              value: TabletPosition.two,
                              child: Text("2"),
                            ),
                            FormBuilderChipOption(
                              value: TabletPosition.three,
                              child: Text("3"),
                            ),
                          ],
                          initialValue: _tabletIdentity.tabletPosition,
                          validator: (value) {
                            if (value == null) {
                              return "Select one";
                            }
                            return null;
                          },
                        ),
                      ),
                      Expanded(
                        child: RadioGroupObj(
                          context,
                          "Tablet Mode",
                          "_MODE",
                          const [
                            FormBuilderChipOption(
                              value: TabletMode.scouting,
                              child: Text("Scouting"),
                            ),
                            FormBuilderChipOption(
                              value: TabletMode.leader,
                              child: Text("Leader"),
                            ),
                            FormBuilderChipOption(
                              value: TabletMode.scanner,
                              child: Text("Scanner"),
                            ),
                            FormBuilderChipOption(
                              value: TabletMode.elims,
                              child: Text("Elims"),
                            ),
                          ],
                          initialValue: _tabletIdentity.tabletMode,
                          validator: (value) {
                            if (value == null) {
                              return "Select one";
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(4.0),
                          child: TextFieldObj(
                            "Season",
                            "_SEASON",
                            FieldInfo(
                              inputType: TextInputType.number,
                              formatters: [
                                FilteringTextInputFormatter.deny(''),
                              ],
                            ),
                            initalValue: _tabletIdentity.compSeason.toString(),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.all(4.0),
                          child: TextFieldObj(
                            "FRC Event Code",
                            "COMP_ID",
                            FieldInfo(
                              formatters: [
                                FilteringTextInputFormatter.deny('')
                              ],
                              inputType: TextInputType.text,
                            ),
                            initalValue: _tabletIdentity.activeComp,
                          ),
                        ),
                      ),
                    ],
                  ),
                  ElevatedButton.icon(
                      onPressed: () async {
                        if (_configKey.currentState!.validate()) {
                          await _tabletIdentity.set(
                              _configKey
                                  .currentState!.fields["_TAB_COLOR"]!.value,
                              _configKey.currentState!.fields["_NUMBER"]!.value,
                              _configKey.currentState!.fields["_MODE"]!.value,
                              int.parse(_configKey
                                  .currentState!.fields["_SEASON"]!.value),
                              _configKey.currentState!.fields["COMP_ID"]!.value,
                              _configKey
                                  .currentState!.fields["FIELD_SIDE"]!.value);
                          if (context.mounted) {
                            showSnackBar(context, "Successfully saved config");
                          }
                          await fetchLocalMatchScheduleData(
                              _tabletIdentity.activeComp);
                        }
                      },
                      icon: const Icon(Icons.download_rounded),
                      label: const Text("Save Config")),
                ],
              )),
          ElevatedButton.icon(
              onPressed: () async {
                updateJson(
                        _tabletIdentity.compSeason, _tabletIdentity.activeComp)
                    .then((val) {
                  saveLocalMatchScheduleData();
                  if (context.mounted) {
                    showSnackBar(context, "Successfully loaded data");
                  }
                }, onError: (err) {
                  if (context.mounted) {
                    showSnackBar(context, "Could not load data");
                  }
                });
              },
              icon: const Icon(Icons.refresh_rounded),
              label: const Text("Reload FRC Data")),
          ElevatedButton.icon(
              onPressed: () {
                clearData();
                saveLocalMatchScheduleData();
                showSnackBar(context, "Successfully cleared FRC Data");
              },
              icon: const Icon(Icons.delete_rounded),
              label: const Text("Delete FRC Data")),
        ])));
  }
}
