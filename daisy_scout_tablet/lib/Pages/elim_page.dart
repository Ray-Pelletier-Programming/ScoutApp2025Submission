// ignore_for_file: avoid_print

import 'package:daisy_scout_tablet/Constants/custom_icons.dart';
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position.dart';
import 'package:daisy_scout_tablet/FormObjects/checkbox_group_obj.dart';
import 'package:daisy_scout_tablet/Pages/stepper_base_page.dart';
import 'package:daisy_scout_tablet/Services/scout_data_service.dart';
import 'package:daisy_scout_tablet/Utilities/field_info.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Widgets/qr_code.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:daisy_scout_tablet/FormObjects/radio_group.dart';
import 'package:daisy_scout_tablet/Services/frc_query.dart';

import 'package:daisy_scout_tablet/Utilities/ui_functions.dart';
import 'package:daisy_scout_tablet/FormObjects/counter_obj.dart';
import 'package:daisy_scout_tablet/FormObjects/text_field_obj.dart';
import 'package:provider/provider.dart';

class ElimPage extends StepperBasePage {
  const ElimPage({super.key});

  @override
  StepperBasePageState createState() => _ElimPage();
}

class _ElimPage extends StepperBasePageState {
  // used for programmatically setting team number values when match
  // number is entered and match schedule is available
  TextEditingController teamController1 = TextEditingController();
  TextEditingController teamController2 = TextEditingController();
  TextEditingController teamController3 = TextEditingController();

  TextEditingController teamnotesController1 = TextEditingController();
  TextEditingController teamnotesController2 = TextEditingController();
  TextEditingController teamnotesController3 = TextEditingController();

  TextEditingController alliancenotesController = TextEditingController();

  List teamNums = List.generate(3, (int index) => 0, growable: false);

  bool isFirstCreation = true;

  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  static const pageLabel = ["Match Info", "Scouting"];

  @override
  void initState() {
    scoutDataService = ScoutDataService(
        _tabletIdentity, DataFolder.leader); // TO DO change to elims
    super.initState();
  }

  @override
  List<Step> getSteps() => [
        Step(
          state: getStepState(0),
          title: Text(pageLabel[0]),
          isActive: currentStep >= 0,
          content: SingleChildScrollView(
            child: getMatchInfoStep(),
          ),
        ),
        Step(
          state: getStepState(1),
          title: Text(pageLabel[1]),
          isActive: currentStep >= 1,
          content: getTeleopStep(),
        ),
      ];

  @override
  List<String> getStepTitles() {
    return pageLabel;
  }

  @override
  List<GlobalKey<FormBuilderState>> getStepperFormKeys() {
    return [
      GlobalKey<FormBuilderState>(),
      GlobalKey<FormBuilderState>(),
    ];
  }

  FormBuilder getMatchInfoStep() {
    return FormBuilder(
      key: stepperFormKeys[0],
      autovalidateMode: AutovalidateMode.always,
      child: SingleChildScrollView(
        child: Column(
          children: [
            Row(
              children: <Widget>[
                Expanded(
                    flex: 1,
                    child: TextFieldObj(
                      "Match #",
                      "MatchNumber",
                      FieldInfo(formatters: [
                        FilteringTextInputFormatter.digitsOnly,
                        LengthLimitingTextInputFormatter(3)
                      ], inputType: TextInputType.number),
                      onChanged: (val) async {
                        getTeam(_tabletIdentity.tabletColor, TabletPosition.one,
                                int.parse(val))
                            .then((team) {
                          if (team == null) {
                            teamController1.text = "";
                          } else {
                            teamController1.text = team.toString();
                          }
                        }, onError: (err) {
                          if (err is StateError) {
                            if (context.mounted) {
                              // ignore: use_build_context_synchronously
                              showSnackBar(context,
                                  "No team found for that match number");
                            }
                          }
                        });
                        getTeam(_tabletIdentity.tabletColor, TabletPosition.two,
                                int.parse(val))
                            .then((team) {
                          if (team == null) {
                            teamController2.text = "";
                          } else {
                            teamController2.text = team.toString();
                          }
                        }, onError: (err) {
                          if (err is StateError) {
                            if (context.mounted) {
                              // ignore: use_build_context_synchronously
                              showSnackBar(context,
                                  "No team found for that match number");
                            }
                          }
                        });
                        getTeam(_tabletIdentity.tabletColor,
                                TabletPosition.three, int.parse(val))
                            .then((team) {
                          if (team == null) {
                            teamController3.text = "";
                          } else {
                            teamController3.text = team.toString();
                          }
                        }, onError: (err) {
                          if (err is StateError) {
                            if (context.mounted) {
                              // ignore: use_build_context_synchronously
                              showSnackBar(context,
                                  "No team found for that match number");
                            }
                          }
                        });
                      },
                    )),
                Expanded(
                  flex: 1,
                  child: TextFieldObj(
                    "Robot 1",
                    "Team1",
                    FieldInfo(formatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(5)
                    ], inputType: TextInputType.number),
                    controller: teamController1,
                    onChanged: (p0) => {teamNums[0] = teamController1.text},
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: TextFieldObj(
                    "Robot 2",
                    "Team2",
                    FieldInfo(formatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(5)
                    ], inputType: TextInputType.number),
                    controller: teamController2,
                    onChanged: (p0) => {teamNums[1] = teamController2.text},
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: TextFieldObj(
                    "Robot 3",
                    "Team3",
                    FieldInfo(formatters: [
                      FilteringTextInputFormatter.digitsOnly,
                      LengthLimitingTextInputFormatter(5)
                    ], inputType: TextInputType.number),
                    controller: teamController3,
                    onChanged: (p0) => {teamNums[2] = teamController3.text},
                  ),
                ),
              ],
            ),
            // Center(
            //   child: Row(
            //     children: [
            //       SizedBox(width: 100, child: Text("")),
            //       Expanded(
            //           child: CheckboxObj(
            //         "No Show",
            //         "NoShowOne",
            //         onChanged: (p0) => {
            //           setState(() {
            //             teamOneBreakInitial = "No Show";
            //           })
            //         },
            //       )),
            //       Expanded(
            //           child: CheckboxObj(
            //         "No Show",
            //         "NoShowTwo",
            //         onChanged: (p0) => {
            //           setState(() {
            //             teamTwoBreakInitial = "No Show";
            //           })
            //         },
            //       )),
            //       Expanded(
            //           child: CheckboxObj(
            //         "No Show",
            //         "NoShowThree",
            //         onChanged: (p0) => {
            //           setState(() {
            //             teamThreeBreakInitial = "No Show";
            //           })
            //         },
            //       ))
            //     ],
            //   ),
            // ),
            TextFieldObj(
              "Scout Name",
              "ScoutName",
              FieldInfo(
                  formatters: [FilteringTextInputFormatter.deny('')],
                  inputType: TextInputType.name),
            ),
          ],
        ),
      ),
    );
  }

  FormBuilder getTeleopStep() {
    if (isFirstCreation == true) {
      teamNums[0] = teamController1.text;
      teamNums[1] = teamController2.text;
      teamNums[2] = teamController3.text;
    }
    return FormBuilder(
      key: stepperFormKeys[1],
      autovalidateMode: AutovalidateMode.always,
      child: SingleChildScrollView(
          child: Column(
        children: [
          Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                Expanded(
                  flex: 1,
                  child: Text(
                    teamController1.text,
                    style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Text(
                    teamController2.text,
                    style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Text(
                    teamController3.text,
                    style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold),
                    textAlign: TextAlign.center,
                  ),
                )
              ]),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Expanded(
                  child:
                      CheckboxGroupObj(_tabletIdentity, "Role", "PrimRole1", [
                FormBuilderChipOption(
                  value: "Coral",
                  avatar: Transform.scale(
                      scale: 1.5,
                      child: ImageIcon(AssetImage(
                        'assets/icons/coral_icon.png',
                      ))),
                ),
                FormBuilderChipOption(
                  value: "Algae",
                  avatar: Transform.scale(
                      scale: 1.5,
                      child: ImageIcon(
                        AssetImage(
                          'assets/icons/algae_icon.png',
                        ),
                        color: Colors.teal,
                      )),
                ),
                FormBuilderChipOption(
                  value: "Defense",
                  avatar:
                      Icon(CustomIcons.shield, size: 30, color: Colors.grey),
                )
              ])),
              Expanded(
                  child:
                      CheckboxGroupObj(_tabletIdentity, "Role", "PrimRole2", [
                FormBuilderChipOption(
                  value: "Coral",
                  avatar: Transform.scale(
                      scale: 1.5,
                      child: ImageIcon(AssetImage(
                        'assets/icons/coral_icon.png',
                      ))),
                ),
                FormBuilderChipOption(
                  value: "Algae",
                  avatar: Transform.scale(
                      scale: 1.5,
                      child: ImageIcon(
                        AssetImage(
                          'assets/icons/algae_icon.png',
                        ),
                        color: Colors.teal,
                      )),
                ),
                FormBuilderChipOption(
                  value: "Defense",
                  avatar:
                      Icon(CustomIcons.shield, size: 30, color: Colors.grey),
                )
              ])),
              Expanded(
                  child:
                      CheckboxGroupObj(_tabletIdentity, "Role", "PrimRole3", [
                FormBuilderChipOption(
                  value: "Coral",
                  avatar: Transform.scale(
                      scale: 1.5,
                      child: ImageIcon(AssetImage(
                        'assets/icons/coral_icon.png',
                      ))),
                ),
                FormBuilderChipOption(
                  value: "Algae",
                  avatar: Transform.scale(
                      scale: 1.5,
                      child: ImageIcon(
                        AssetImage(
                          'assets/icons/algae_icon.png',
                        ),
                        color: Colors.teal,
                      )),
                ),
                FormBuilderChipOption(
                  value: "Defense",
                  avatar:
                      Icon(CustomIcons.shield, size: 30, color: Colors.grey),
                )
              ])),
            ],
          ),
          Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
            SizedBox(
              width: 180,
              child: TextFieldObj(
                "Team ${teamController1.text} Notes: ",
                "OtherNotes1",
                FieldInfo(
                    formatters: [FilteringTextInputFormatter.deny('')],
                    inputType: TextInputType.name),
                controller: teamnotesController1,
                maxLines: 15,
              ),
            ),
            SizedBox(
              width: 180,
              child: TextFieldObj(
                "Team ${teamController2.text} Notes: ",
                "OtherNotes2",
                FieldInfo(
                    formatters: [FilteringTextInputFormatter.deny('')],
                    inputType: TextInputType.name),
                controller: teamnotesController2,
                maxLines: 15,
              ),
            ),
            SizedBox(
              width: 180,
              child: TextFieldObj(
                "Team ${teamController3.text} Notes: ",
                "OtherNotes3",
                FieldInfo(
                    formatters: [FilteringTextInputFormatter.deny('')],
                    inputType: TextInputType.name),
                controller: teamnotesController3,
                maxLines: 15,
              ),
            ),
          ]),
          Row(mainAxisAlignment: MainAxisAlignment.center, children: [
            SizedBox(
              width: 540,
              child: TextFieldObj(
                "Alliance Notes: ",
                "AllianceNotes",
                FieldInfo(
                    formatters: [FilteringTextInputFormatter.deny('')],
                    inputType: TextInputType.name),
                controller: alliancenotesController,
                maxLines: 15,
              ),
            ),
          ]),
        ],
      )),
    );
  }

  @override
  buildSuccessPage() {
    // all TextEditControllers that should be reset when form is reset.
    List<TextEditingController> controllersToReset = [
      teamController1,
      teamController2,
      teamController3,
      teamnotesController1,
      teamnotesController2,
      teamnotesController3,
      alliancenotesController
    ];

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.check_circle, size: 100, color: Colors.green),
          Text("All done!"),
          const SizedBox(height: 20),
          QRCode(
            formData: savedData,
            context: context,
            dataFolder: DataFolder.leader,
            tabletIdentity: _tabletIdentity,
          ),
          const Spacer(),
          Align(
            alignment: Alignment.centerRight,
            child: ElevatedButton(
              onPressed: () {
                reset(controllersToReset);
              },
              child: const Text('RESET'),
            ),
          )
        ],
      ),
    );
  }
}
