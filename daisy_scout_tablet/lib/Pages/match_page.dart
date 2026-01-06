// ignore_for_file: avoid_print

import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/field_side.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color_extension.dart';
import 'package:daisy_scout_tablet/FormObjects/checkbox_obj.dart';
import 'package:daisy_scout_tablet/Pages/stepper_base_page.dart';
import 'package:daisy_scout_tablet/Services/scout_data_service.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Widgets/qr_code.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:daisy_scout_tablet/FormObjects/radio_group.dart';
import 'package:daisy_scout_tablet/Services/frc_query.dart';
import 'package:daisy_scout_tablet/Utilities/field_info.dart';
import 'package:flutter/services.dart';

import 'package:daisy_scout_tablet/Utilities/ui_functions.dart';
import 'package:daisy_scout_tablet/FormObjects/counter_obj.dart';
import 'package:daisy_scout_tablet/FormObjects/text_field_obj.dart';
import 'package:provider/provider.dart';

class MatchPage extends StepperBasePage {
  const MatchPage({super.key});

  @override
  StepperBasePageState createState() => _MatchPage();
}

class _MatchPage extends StepperBasePageState with TickerProviderStateMixin {
  // Used for programatically setting team field on change of match number
  // when match schedule data is available...
  TextEditingController teamController = TextEditingController();
  //  Image.File will not work in Web-based App, but should work on Tablet Simulations.
  // var redScoringTableReef = File('');
  // var redNoTableReef = File('');
  // var blueScoringTableReef = File('');
  // var blueNoTableReef = File('');
  // var test = File('blue reef.png');

  bool isNoShow = false;

  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  bool resetCall = false;

  static const pageLabel = ["Match Info", "Autonomous", "Teleop"];

  @override
  void initState() {
    scoutDataService = ScoutDataService(_tabletIdentity, DataFolder.match);
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
          content: getAutonomousStep(),
        ),
        Step(
          state: getStepState(2),
          title: Text(pageLabel[2]),
          isActive: currentStep >= 2,
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
      GlobalKey<FormBuilderState>(),
    ];
  }

  FormBuilder getMatchInfoStep() {
    Color allyColor = Colors.red;
    Color opponentColor = Colors.blue;
    switch (_tabletIdentity.tabletColor.code) {
      case ('R'):
        allyColor = Colors.red;
        opponentColor = Colors.blue;
      case ('B'):
        allyColor = Colors.blue;
        opponentColor = Colors.red;
    }
    return FormBuilder(
      key: stepperFormKeys[0],
      autovalidateMode: AutovalidateMode.disabled,
      child: Column(children: [
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
                    if (val == null || int.tryParse(val) == null) {
                      return;
                    }

                    getTeam(_tabletIdentity.tabletColor,
                            _tabletIdentity.tabletPosition, int.parse(val))
                        .then((team) {
                      if (team == null) {
                        teamController.text = "";
                      } else {
                        teamController.text = team.toString();
                      }
                    }, onError: (err) {
                      if (err is StateError) {
                        if (context.mounted) {
                          showSnackBar(
                            // ignore: use_build_context_synchronously
                            context,
                            "No team found for that match number",
                          );
                        }
                      }
                    });
                  },
                )),
            Expanded(
              flex: 1,
              child: TextFieldObj(
                "Team #",
                "TeamNumber",
                FieldInfo(formatters: [
                  FilteringTextInputFormatter.digitsOnly,
                  LengthLimitingTextInputFormatter(5)
                ], inputType: TextInputType.number),
                controller: teamController,
                onChanged: (value) => stepperFormKeys[0]
                    .currentState!
                    .patchValue({'TeamNumber': value}),
              ),
            ),
          ],
        ),
        TextFieldObj(
          "Scout Name",
          "ScoutName",
          FieldInfo(
              formatters: [FilteringTextInputFormatter.deny('')],
              inputType: TextInputType.name),
        ),
        // Center(
        //   child: CheckboxObj(
        //     "No Show",
        //     "NoShow",
        //     onChanged: (p0) => {isNoShow = !isNoShow},
        //   ),
        // ),
        RadioGroupObj(
          context,
          "Auto Start Location:",
          "ASL",
          [
            FormBuilderChipOption(
                value: "Alliance Barge",
                avatar: Transform.scale(
                    scale: 1.5,
                    child: ImageIcon(
                      AssetImage(
                        'assets/icons/algae_icon.png',
                      ),
                      color: allyColor,
                    )),
                child: Text("Alliance Barge",
                    style: TextStyle(
                      color: Colors.white,
                    ))),
            FormBuilderChipOption(
                value: "Center",
                child: Text("Center",
                    style: TextStyle(
                      color: Colors.white,
                    ))),
            FormBuilderChipOption(
                value: "Opponent Barge",
                avatar: Transform.scale(
                    scale: 1.5,
                    child: ImageIcon(
                      AssetImage(
                        'assets/icons/algae_icon.png',
                      ),
                      color: opponentColor,
                    )),
                child: Text("Opponent Barge",
                    style: TextStyle(
                      color: Colors.white,
                    ))),
            FormBuilderChipOption(
                value: "No Show",
                avatar: Transform.scale(scale: 1.5),
                child: Text("No Show",
                    style: TextStyle(
                      color: Colors.white,
                    )))
          ],
          validator: (value) {
            if (isNoShow == false) {
              if (value == null) {
                return "Select one";
              }
            }
            return null;
          },
        ),
      ]),
    );
  }

  FormBuilder getAutonomousStep() {
    Image reefImage = Image.asset('assets/images/red_table_image.png');
    FieldSide side = _tabletIdentity.fieldSide;
    TabletColor color = _tabletIdentity.tabletColor;
    if (side == FieldSide.table && color == TabletColor.blue) {
      reefImage = Image.asset('assets/images/blue_table_image.png');
    }
    if (side == FieldSide.nontable) {
      if (color == TabletColor.blue) {
        reefImage = Image.asset('assets/images/blue_notable_image.png');
      } else {
        reefImage = Image.asset('assets/images/red_notable_image.png');
      }
    }
    return FormBuilder(
        key: stepperFormKeys[1],
        autovalidateMode: AutovalidateMode.disabled,
        child: SingleChildScrollView(
          child: Column(children: [
            Row(
              children: [
                Expanded(
                  flex: 4,
                  child: Column(children: [
                    Text(
                      "Level Scored:",
                      textScaleFactor: 2,
                    ),
                    Row(
                      children: [
                        Expanded(
                          flex: 1,
                          child: CounterObj(
                            _tabletIdentity,
                            "🪸 L4",
                            "AutoReefL4",
                            max: 9,
                            // avatar: Transform.scale(
                            //     scale: 1.5,
                            //     child:
                            //         Icon(MyFlutterApp.coral, color: Colors.red)

                            //     // ImageIcon(AssetImage(
                            //     //   'assets/icons/coral_icon.png',
                            //     // )
                            //     // )
                            //     ),
                          ),
                        ),
                        Expanded(
                            flex: 1,
                            child: CounterObj(
                                _tabletIdentity, "🪸 L3", "AutoReefL3",
                                max: 9)),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(
                            flex: 1,
                            child: CounterObj(
                                _tabletIdentity, "🪸 L2", "AutoReefL2",
                                max: 9)),
                        Expanded(
                            flex: 1,
                            child: CounterObj(
                                _tabletIdentity, "🪸 L1", "AutoReefL1",
                                max: 9)),
                      ],
                    ),
                    Divider(color: Colors.grey),
                    Row(
                      children: [
                        Expanded(
                          flex: 1,
                          child: CounterObj(
                              _tabletIdentity, "🟢 Net Scored", "AutoNet",
                              max: 9),
                        ),
                        // Expanded(
                        //   flex: 1,
                        //   child: CounterObj(_tabletIdentity, "🟢 Algae Removed",
                        //       "AutoAlgaeRemoved"),
                        // ),
                        Expanded(
                            flex: 1,
                            child: CounterObj(_tabletIdentity, "🟢 Processor",
                                "AutoProcessor",
                                max: 9)),
                      ],
                    ),
                    // Row(
                    //     mainAxisAlignment: MainAxisAlignment.center,
                    //     children: [
                    //       Expanded(
                    //         flex: 1,
                    //         child: CounterObj(_tabletIdentity, "Algae Removed", "AlgaeRemoved")
                    //       ),
                    //     ],),
                  ]),
                ),
                Expanded(
                    flex: 3,
                    child: Column(
                      children: [
                        Row(children: [
                          Expanded(
                            flex: 1,
                            child: Text("Reef Diagram:",
                                textAlign: TextAlign.center,
                                style: TextStyle(fontSize: 25)),
                          )
                        ]),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Expanded(
                              flex: 1,
                              child: SizedBox(
                                  width: 200, height: 200, child: reefImage),
                            ),
                          ],
                        ),
                        Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Expanded(
                                  flex: 1,
                                  child: RadioGroupObj(
                                    context,
                                    "Leave?",
                                    "Leave",
                                    const [
                                      FormBuilderChipOption(value: "Yes"),
                                      FormBuilderChipOption(value: "No"),
                                      FormBuilderChipOption(value: "No Show")
                                    ],
                                    validator: (value) {
                                      if (isNoShow == false) {
                                        if (value == null) {
                                          return "Select one";
                                        }
                                      }
                                      return null;
                                    },
                                    // initialValue: "Yes",
                                  )),
                            ]),
                      ],
                    )),
                Expanded(
                    flex: 4,
                    child: Column(
                      children: [
                        Text(
                          "Sides Visited:",
                          textScaleFactor: 2,
                        ),
                        if ((side == FieldSide.table &&
                                color == TabletColor.red) ||
                            (side == FieldSide.nontable &&
                                color == TabletColor.blue)) ...[
                          Row(children: [
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "B", "CoralB",
                                    max: 9)),
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "C", "CoralC",
                                    max: 9))
                          ]),
                          Row(children: [
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "A", "CoralA",
                                    max: 9)),
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "D", "CoralD",
                                    max: 9))
                          ]),
                          Row(children: [
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "F", "CoralF",
                                    max: 9)),
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "E", "CoralE",
                                    max: 9))
                          ]),
                        ] else ...[
                          Row(children: [
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "E", "CoralE",
                                    max: 9)),
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "F", "CoralF",
                                    max: 9))
                          ]),
                          Row(children: [
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "D", "CoralD",
                                    max: 9)),
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "A", "CoralA",
                                    max: 9))
                          ]),
                          Row(children: [
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "C", "CoralC",
                                    max: 9)),
                            Expanded(
                                flex: 1,
                                child: CounterObj(
                                    _tabletIdentity, "B", "CoralB",
                                    max: 9))
                          ]),
                        ],
                      ],
                    ))
              ],
            ),
          ]),
        ));
  }

  FormBuilder getTeleopStep() {
    return FormBuilder(
      key: stepperFormKeys[2],
      autovalidateMode: AutovalidateMode.disabled,
      child: SingleChildScrollView(
          child: Center(
        child: Column(
          children: [
            Row(children: <Widget>[
              Expanded(
                  child: CounterObj(_tabletIdentity, "🪸 L1", "TeleopReefL1",
                      max: 150)),
              Expanded(
                  child: CounterObj(_tabletIdentity, "🪸 L2", "TeleopReefL2",
                      max: 150)),
              Expanded(
                  child: CounterObj(_tabletIdentity, "🪸 L3", "TeleopReefL3",
                      max: 150)),
              Expanded(
                  child: CounterObj(_tabletIdentity, "🪸 L4", "TeleopReefL4",
                      max: 150)),
            ]),
            Row(
              children: [
                Expanded(
                  child: CounterObj(_tabletIdentity, "🟢 Processor Scored",
                      "TeleopProcessor"),
                ),
                Expanded(
                  flex: 1,
                  child: CounterObj(_tabletIdentity, "🟢 Algae Removed",
                      "TeleopAlgaeRemoved"),
                ),
                Expanded(
                  child: CounterObj(
                      _tabletIdentity, "🟢 Net Scored by Robot", "TeleopNet"),
                ),
              ],
            ),
            Row(
              children: [
                Expanded(
                    child: RadioGroupObj(
                  context,
                  "End Game",
                  "Endgame",
                  const [
                    FormBuilderChipOption(value: "Park"),
                    FormBuilderChipOption(value: "Shallow"),
                    FormBuilderChipOption(value: "Deep"),
                    FormBuilderChipOption(value: "None"),
                    FormBuilderChipOption(value: "No Show"),
                  ],
                  validator: (value) {
                    // if (isNoShow) {
                    if (value == null) {
                      return "Select one";
                    }
                    // }
                    return null;
                  },
                )),
              ],
            )
          ],
        ),
      )),
    );
  }

  @override
  buildSuccessPage() {
    // all TextEditControllers that should be reset when form is reset.
    List<TextEditingController> controllersToReset = [
      teamController,
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
            dataFolder: DataFolder.match,
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
