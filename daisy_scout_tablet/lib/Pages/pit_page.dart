import 'package:daisy_scout_tablet/Utilities/field_info.dart';
import 'package:flutter/services.dart';
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/FormObjects/checkbox_group_obj.dart';
import 'package:daisy_scout_tablet/Services/scout_data_service.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:daisy_scout_tablet/FormObjects/counter_obj.dart';
import 'package:daisy_scout_tablet/Widgets/navigation_drawer_custom.dart';

import 'package:daisy_scout_tablet/Utilities/ui_functions.dart';
//import 'package:daisy_scout_tablet/FormObjects/checkbox_obj.dart';
import 'package:daisy_scout_tablet/FormObjects/radio_group.dart';
import 'package:daisy_scout_tablet/FormObjects/text_field_obj.dart';
import 'package:provider/provider.dart';
import 'qr_page.dart';

class PitPage extends StatefulWidget {
  const PitPage({super.key});

  @override
  State<PitPage> createState() => _PitPageState();
}

class _PitPageState extends State<PitPage> {
  final GlobalKey<FormBuilderState> _key = GlobalKey<FormBuilderState>();

  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  late ScoutDataService _pitDataService;

  @override
  Widget build(BuildContext context) {
    _pitDataService = ScoutDataService(_tabletIdentity, DataFolder.pit);
    return Scaffold(
        appBar: AppBar(centerTitle: true, title: const Text("Pit Scouting")),
        drawer: NavigationDrawerCustom(),
        body: FormBuilder(
            key: _key,
            autovalidateMode: AutovalidateMode.disabled,
            child: SingleChildScrollView(
                child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                  SizedBox(
                    width: 800,
                    child: Row(
                      children: [
                        Expanded(
                            child: TextFieldObj(
                          "Scout Name",
                          "ScoutName",
                          FieldInfo(formatters: [
                            FilteringTextInputFormatter.deny('')
                          ], inputType: TextInputType.name),
                        )),
                        Expanded(
                            child: TextFieldObj(
                          "Team",
                          "TeamNumber",
                          FieldInfo(formatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(5)
                          ], inputType: TextInputType.number),
                        )),
                      ],
                    ),
                  ),
                  Divider(color: Colors.grey),
                  RadioGroupObj(
                    context,
                    "Drivetrain",
                    "Drivetrain",
                    const [
                      FormBuilderChipOption(
                        value: "Swerve",
                      ),
                      FormBuilderChipOption(
                        value: "Tank",
                      ),
                      FormBuilderChipOption(
                        value: "Mecanum",
                      ),
                      FormBuilderChipOption(
                        value: "Other",
                      )
                    ],
                    validator: (value) {
                      if (value == null) {
                        return "Select one";
                      }
                      return null;
                    },
                  ),
                  Center(
                    child: SizedBox(
                      width: 800,
                      child: Row(
                        spacing: 25,
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          Expanded(
                              child: TextFieldObj(
                            "Robot Width With Bumpers",
                            "RobotWidth",
                            FieldInfo(
                                formatters: [
                                  FilteringTextInputFormatter.allow(
                                      RegExp(r'(^\-?\d*\.?\d*)'))
                                ],
                                inputType:
                                    const TextInputType.numberWithOptions(
                                        decimal: true)),
                          )),
                          Text(
                            'X',
                            textScaleFactor: 2,
                          ),
                          Expanded(
                              child: TextFieldObj(
                            "Robot Length With Bumpers",
                            "RobotLength",
                            FieldInfo(
                                formatters: [
                                  FilteringTextInputFormatter.allow(
                                      RegExp(r'(^\-?\d*\.?\d*)'))
                                ],
                                inputType:
                                    const TextInputType.numberWithOptions(
                                        decimal: true)),
                          )),
                        ],
                      ),
                    ),
                  ),
                  Text('EXACT MEASUREMENT IN INCHES',
                      textScaleFactor: 1.25,
                      style: TextStyle(fontStyle: FontStyle.italic)),
                  Divider(color: Colors.grey),
                  // TextFieldObj(
                  //   "Robot Height (EXACT IN INCHES)",
                  //   "RobotHeight",
                  //   pitFields["RobotHeight"]!,
                  // ),
                  RadioGroupObj(
                    context,
                    "Where do you prefer your human player?",
                    "HumanPlayer",
                    const [
                      FormBuilderChipOption(
                        value: "Processor",
                      ),
                      FormBuilderChipOption(
                        value: "Coral Station",
                      ),
                      FormBuilderChipOption(
                        value: "No Preference",
                      )
                    ],
                    validator: (value) {
                      if (value == null) {
                        return "Select one";
                      }
                      return null;
                    },
                  ),
                  CheckboxGroupObj(
                      _tabletIdentity,
                      "What is your preferred starting location?",
                      "PrefStartLoc", const [
                    FormBuilderChipOption(
                      value: "Center",
                    ),
                    FormBuilderChipOption(
                      value: "Alliance Barge",
                    ),
                    FormBuilderChipOption(
                      value: "Opposing Barge",
                    ),
                    FormBuilderChipOption(
                      value: "No Preference",
                    )
                  ]),
                  CheckboxGroupObj(
                      _tabletIdentity,
                      "Where can you intake from?",
                      "CanIntakeLocations", const [
                    FormBuilderChipOption(
                      value: "Algae from Ground",
                    ),
                    FormBuilderChipOption(
                      value: "Algae from Reef",
                    ),
                    FormBuilderChipOption(
                      value: "Coral from Human Player",
                    ),
                    FormBuilderChipOption(
                      value: "Coral from Ground",
                    )
                  ]),
                  Row(
                    children: [
                      Expanded(
                          child: CheckboxGroupObj(
                              _tabletIdentity,
                              "Where can your robot score in auto?",
                              "CanAutoScoreLocations", [
                        FormBuilderChipOption(
                          value: "L1",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "L2",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "L3",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "L4",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "Processor",
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
                          value: "Net",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(
                                AssetImage(
                                  'assets/icons/algae_icon.png',
                                ),
                                color: Colors.teal,
                              )),
                        )
                      ])),
                      Expanded(
                          child: CheckboxGroupObj(
                              _tabletIdentity,
                              "Where can your robot score in teleop?",
                              "CanTeleopScoreLocations", [
                        FormBuilderChipOption(
                          value: "L1",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "L2",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "L3",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "L4",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(AssetImage(
                                'assets/icons/coral_icon.png',
                              ))),
                        ),
                        FormBuilderChipOption(
                          value: "Processor",
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
                          value: "Net",
                          avatar: Transform.scale(
                              scale: 1.5,
                              child: ImageIcon(
                                AssetImage(
                                  'assets/icons/algae_icon.png',
                                ),
                                color: Colors.teal,
                              )),
                        )
                      ])),
                    ],
                  ),
                  CheckboxGroupObj(
                      _tabletIdentity,
                      "Where can you intake coral in auto?",
                      "CanAutoIntakeLocations", const [
                    FormBuilderChipOption(
                      value: "Coral Station",
                    ),
                    FormBuilderChipOption(
                      value: "Ground",
                    )
                  ]),
                  CounterObj(
                    _tabletIdentity,
                    "What is the max number of gamepieces you can score in auto?",
                    "MaxGamepiecesAuto",
                    max: 9,
                  ),
                  Divider(
                    color: Colors.grey,
                  ),
                  CheckboxGroupObj(_tabletIdentity, "Where can you climb?",
                      "CanClimb", const [
                    FormBuilderChipOption(
                      value: "Shallow Cage",
                    ),
                    FormBuilderChipOption(
                      value: "Deep Cage",
                    ),
                    FormBuilderChipOption(
                      value: "None",
                    ),
                  ]),
                  TextFieldObj(
                    "Any other notable features?",
                    "NotableFeat",
                    FieldInfo(
                        formatters: [FilteringTextInputFormatter.deny('')],
                        inputType: TextInputType.text),
                  ),
                  const Text("Remember to Take a Picture!",
                      style:
                          TextStyle(fontSize: 30, fontWeight: FontWeight.bold)),
                  const Text(""), // Spacer
                  ElevatedButton(
                      style: ButtonStyle(
                          backgroundColor: WidgetStateProperty.all<Color>(
                              Color.fromRGBO(20, 163, 51, 1))),
                      onPressed: () async {
                        if (_key.currentState!.validate()) {
                          _key.currentState!.save();
                          await _pitDataService
                              .saveScoutData(_key.currentState!.value);

                          if (context.mounted) {
                            showSnackBar(context, "Added QR Code!",
                                action: SnackBarAction(
                                    label: "Go to QR Codes",
                                    textColor:
                                        Color.fromRGBO(196, 225, 255, 0.8),
                                    onPressed: () => Navigator.of(context)
                                        .pushReplacement(MaterialPageRoute(
                                            builder: (ctx) => QRPage()))));
                          }
                          // reset form
                          var activeScout =
                              _key.currentState!.value["ScoutName"];
                          _key.currentState!.reset();
                          _key.currentState!.patchValue(
                              {'ScoutName': activeScout, 'MaxNotesAuto': 0});
                          //TODO: Not resetting counter properly, investigate...
                        } else {
                          showSnackBar(context, "Missing fields");
                        }
                      },
                      child:
                          const Text("Submit", style: TextStyle(fontSize: 40)))
                ]))));
  }
}
