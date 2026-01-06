// ignore_for_file: avoid_print

import 'package:daisy_scout_tablet/Constants/custom_icons.dart';
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position.dart';
import 'package:daisy_scout_tablet/FormObjects/checkbox_group_obj.dart';
import 'package:daisy_scout_tablet/FormObjects/checkbox_obj.dart';
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

class SubjectiveMatchPage extends StepperBasePage {
  static var isReordering = false;

  static void updateReordering(bool newVal) {
    isReordering = newVal;
  }

  const SubjectiveMatchPage({super.key});

  @override
  StepperBasePageState createState() => _SubjectiveMatchPage();
}

class _SubjectiveMatchPage extends StepperBasePageState {
  // used for programmatically setting team number values when match
  // number is entered and match schedule is available
  TextEditingController teamController1 = TextEditingController();
  TextEditingController teamController2 = TextEditingController();
  TextEditingController teamController3 = TextEditingController();

  TextEditingController notesController1 = TextEditingController();
  TextEditingController notesController2 = TextEditingController();
  TextEditingController notesController3 = TextEditingController();

  TextEditingController driverAbilityController1 = TextEditingController();
  TextEditingController driverAbilityController2 = TextEditingController();
  TextEditingController driverAbilityController3 = TextEditingController();

  List teamNums = List.generate(3, (int index) => 0, growable: false);

  bool isFirstCreation = true;

  dynamic teamOneBreakInitial = "Working";
  dynamic teamTwoBreakInitial = "Working";
  dynamic teamThreeBreakInitial = "Working";

  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  static const pageLabel = ["Match Info", "Notes", "Ratings"];

  static bool onReorder = false;
  bool isVisible = false;

  @override
  void initState() {
    scoutDataService = ScoutDataService(_tabletIdentity, DataFolder.leader);
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
        Step(
          state: getStepState(2),
          title: Text(pageLabel[2]),
          isActive: currentStep >= 2,
          content: getAutonomousStep(),
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
                    onChanged: (p0) => {
                      driverAbilityController1.text = "1",
                      teamNums[0] = teamController1.text
                    },
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
                    onChanged: (p0) => {
                      driverAbilityController2.text = "2",
                      teamNums[1] = teamController2.text
                    },
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
                    onChanged: (p0) => {
                      driverAbilityController3.text = "3",
                      teamNums[2] = teamController3.text
                    },
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
    return FormBuilder(
      key: stepperFormKeys[1],
      autovalidateMode: AutovalidateMode.always,
      child: SingleChildScrollView(
          child: Column(
        children: [
          Row(children: [
            Expanded(
              flex: 1,
              child: RadioGroupObj(
                context,
                'Processor HP Team #',
                'HPTeamNumber',
                [
                  FormBuilderChipOption(
                    value: teamController1.text,
                  ),
                  FormBuilderChipOption(
                    value: teamController2.text,
                  ),
                  FormBuilderChipOption(
                    value: teamController3.text,
                  ),
                  FormBuilderChipOption(value: "None")
                ],
                validator: (value) {
                  if (value == null) {
                    return 'Select One';
                  }
                  return null;
                },
              ),
            )
          ]),
          Row(children: <Widget>[
            Expanded(
              flex: 1,
              child: CounterObj(
                _tabletIdentity,
                "HP Net Shots Made🤑",
                "NetShotsMade",
                min: 0,
              ),
            ),
            Expanded(
              flex: 1,
              child: CounterObj(
                _tabletIdentity,
                "HP Net Shots Missed😡",
                "NetShotsMissed",
                min: 0,
              ),
            ),
          ]),
          Row(mainAxisAlignment: MainAxisAlignment.spaceEvenly, children: [
            SizedBox(
              width: 180,
              child: TextFieldObj(
                "Team ${teamController1.text} Notes: ",
                "OtherNotes1",
                FieldInfo(
                    formatters: [FilteringTextInputFormatter.deny('')],
                    inputType: TextInputType.name),
                controller: notesController1,
                maxLines: 20,
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
                controller: notesController2,
                maxLines: 20,
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
                controller: notesController3,
                maxLines: 20,
              ),
            ),
          ]),
        ],
      )),
    );
  }

  FormBuilder getAutonomousStep() {
    if (isFirstCreation == true) {
      teamNums[0] = teamController1.text;
      teamNums[1] = teamController2.text;
      teamNums[2] = teamController3.text;
    }
    return FormBuilder(
      key: stepperFormKeys[2],
      autovalidateMode: AutovalidateMode.always,
      child: SingleChildScrollView(
        child: Column(children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("1 - BEST | 3 - WORST (PRESS, HOLD, THEN DRAG):",
                  style: TextStyle(fontSize: 20, fontStyle: FontStyle.italic),
                  textAlign: TextAlign.center)
            ],
          ),
          Row(children: <Widget>[
            Expanded(
                flex: 1,
                child: SizedBox(
                  width: 200,
                  height: 200,
                  child: ReorderableListView(
                    children: [
                      for (int i = 0; i < 3; i++)
                        ListTile(
                          key: Key('$i'),
                          tileColor: Color.fromARGB(248, 83, 92, 213),
                          title: Text('${i + 1} | Team ${teamNums[i]}'),
                          shape: RoundedRectangleBorder(
                            side: BorderSide(color: Colors.white, width: 2),
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                    ],
                    onReorder: (int oldIndex, int newIndex) {
                      onReorder = true;
                      SubjectiveMatchPage.updateReordering(onReorder);
                      setState(() {
                        isFirstCreation = false;
                        if (oldIndex < newIndex) {
                          newIndex -= 1;
                        }
                        final String item = teamNums[oldIndex];
                        List newList = teamNums
                            .where((x) => teamNums.indexOf(x) != oldIndex)
                            .toList();
                        teamNums = newList;
                        teamNums.insert(newIndex, item);

                        driverAbilityController1.text =
                            "${teamNums.indexOf(teamController1.text) + 1}";
                        driverAbilityController2.text =
                            "${teamNums.indexOf(teamController2.text) + 1}";
                        driverAbilityController3.text =
                            "${teamNums.indexOf(teamController3.text) + 1}";
                      });
                    },
                    onReorderEnd: (index) {
                      onReorder = false;
                      SubjectiveMatchPage.updateReordering(onReorder);
                    },
                  ),
                )),
          ]),
          Row(children: [
            Visibility(
              visible: false,
              maintainState: true,
              child: SizedBox(
                width: 1,
                child: TextFieldObj(
                  "",
                  "DriverAbility1",
                  FieldInfo(
                      formatters: [FilteringTextInputFormatter.digitsOnly],
                      inputType: TextInputType.number),
                  // initalValue: "1",
                  controller: driverAbilityController1,
                ),
              ),
            ),
            Visibility(
              visible: false,
              maintainState: true,
              child: SizedBox(
                width: 1,
                child: TextFieldObj(
                  "",
                  "DriverAbility2",
                  FieldInfo(
                      formatters: [FilteringTextInputFormatter.digitsOnly],
                      inputType: TextInputType.number),
                  // initalValue: "2",
                  controller: driverAbilityController2,
                ),
              ),
            ),
            Visibility(
              visible: false,
              maintainState: true,
              child: SizedBox(
                width: 1,
                child: TextFieldObj(
                  "",
                  "DriverAbility3",
                  FieldInfo(
                      formatters: [FilteringTextInputFormatter.digitsOnly],
                      inputType: TextInputType.number),
                  // initalValue: "3",
                  controller: driverAbilityController3,
                ),
              ),
            ),
          ]),
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
          Row(children: <Widget>[
            Expanded(
              child: RadioGroupObj(
                context,
                "Break",
                "Break1",
                const [
                  FormBuilderChipOption(
                    value: "Working",
                  ),
                  FormBuilderChipOption(
                    value: "Broken",
                  ),
                  FormBuilderChipOption(
                    value: "Dead",
                  ),
                  FormBuilderChipOption(value: 'No Show')
                ],
                validator: (value) {
                  // if (teamOneNoShow == false) {
                  if (value == null) {
                    return "Select one";
                  }
                  // }
                  return null;
                },
                // initialValue: teamOneBreakInitial,
              ),
            ),
            Expanded(
              child: RadioGroupObj(
                context,
                "Break",
                "Break2",
                const [
                  FormBuilderChipOption(
                    value: "Working",
                  ),
                  FormBuilderChipOption(
                    value: "Broken",
                  ),
                  FormBuilderChipOption(
                    value: "Dead",
                  ),
                  FormBuilderChipOption(value: "No Show")
                ],
                validator: (value) {
                  // if (teamTwoNoShow == false) {
                  if (value == null) {
                    return "Select one";
                    // }
                  }
                  return null;
                },
                // initialValue: teamTwoBreakInitial,
              ),
            ),
            Expanded(
              child: RadioGroupObj(
                context,
                "Break",
                "Break3",
                const [
                  FormBuilderChipOption(
                    value: "Working",
                  ),
                  FormBuilderChipOption(
                    value: "Broken",
                  ),
                  FormBuilderChipOption(
                    value: "Dead",
                  ),
                  FormBuilderChipOption(value: "No Show")
                ],
                validator: (value) {
                  // if (teamThreeNoShow == false) {
                  if (value == null) {
                    return "Select one";
                  }
                  // }
                  return null;
                },
                // initialValue: teamThreeBreakInitial,
              ),
            ),
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
        ]),
      ),
    );
  }

  @override
  buildSuccessPage() {
    // all TextEditControllers that should be reset when form is reset.
    List<TextEditingController> controllersToReset = [
      teamController1,
      teamController2,
      teamController3,
      notesController1,
      notesController2,
      notesController3
    ];

    isVisible = true;

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
