import 'package:daisy_scout_tablet/Constants/daisy_colors.dart';
import 'package:daisy_scout_tablet/FormObjects/counter_obj.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:daisy_scout_tablet/Utilities/ui_functions.dart';
import 'package:daisy_scout_tablet/Constants/custom_icons.dart';
import 'package:daisy_scout_tablet/FormObjects/radio_group.dart';
import 'package:daisy_scout_tablet/globals.dart';
import 'package:provider/provider.dart';

import '../FormObjects/slider_obj.dart';

class CasinoPage extends StatefulWidget {
  const CasinoPage({super.key});

  @override
  State<CasinoPage> createState() => _CasinoPage();
}

class _CasinoPage extends State<CasinoPage> with TickerProviderStateMixin {
  final GlobalKey<FormBuilderState> _key = GlobalKey<FormBuilderState>();
  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    bool betSomething = false;
    //double currentSliderValue = 0;
    return Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: const Text("CASINO🎲"),
          backgroundColor: Color.fromARGB(255, 0, 0, 0),
          foregroundColor: const Color.fromARGB(255, 255, 201, 14),
        ),
        body: FormBuilder(
            key: _key,
            child: SingleChildScrollView(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      "BET ON AT LEAST ONE THING! \n MORE CHOICES = MORE RISK AND MORE REWARDS!",
                      style: TextStyle(
                        fontSize: 25,
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  Row(
                    children: [
                      Expanded(
                        flex: 1,
                        child: RadioGroupObj(
                          context,
                          "Who will win?",
                          "BET_COLOR",
                          [
                            FormBuilderChipOption(
                              value: "Blue",
                              avatar: Icon(CustomIcons.robot,
                                  color: DaisyColors.blueAlliance, size: 15.0),
                            ),
                            FormBuilderChipOption(
                              value: "Red",
                              avatar: Icon(CustomIcons.robot,
                                  color: DaisyColors.redAlliance, size: 15.0),
                            ),
                          ],
                          validator: (value) {
                            if (value != null) {
                              betSomething = true;
                            }
                          },
                        ),
                      ),
                      Expanded(
                        flex: 1,
                        child: RadioGroupObj(
                          context,
                          "Who will score more in auto?",
                          "AUTO_COLOR",
                          [
                            FormBuilderChipOption(
                              value: "Blue",
                              avatar: Icon(CustomIcons.robot,
                                  color: DaisyColors.blueAlliance, size: 15.0),
                            ),
                            FormBuilderChipOption(
                              value: "Red",
                              avatar: Icon(CustomIcons.robot,
                                  color: DaisyColors.redAlliance, size: 15.0),
                            ),
                          ],
                          validator: (value) {
                            if (value != null) {
                              betSomething = true;
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      Expanded(
                        flex: 1,
                        child: RadioGroupObj(
                          context,
                          "Winning score Over/Under 100 points",
                          "WINNER_SCORE_OVER_UNDER",
                          const [
                            FormBuilderChipOption(
                              value: "Over",
                              avatar: Icon(Icons.arrow_upward,
                                  color: Colors.amber, size: 20.0),
                            ),
                            FormBuilderChipOption(
                              value: "Under",
                              avatar: Icon(Icons.arrow_downward,
                                  color: Colors.amber, size: 20.0),
                            ),
                          ],
                          validator: (value) {
                            if (value != null) {
                              betSomething = true;
                            }
                          },
                        ),
                      ),
                      Expanded(
                        flex: 1,
                        child: RadioGroupObj(
                          context,
                          "Total score Over/Under 150 points",
                          "TOTAL_SCORE_OVER_UNDER",
                          const [
                            FormBuilderChipOption(
                              value: "Over",
                              avatar: Icon(Icons.arrow_upward,
                                  color: Colors.amber, size: 20.0),
                            ),
                            FormBuilderChipOption(
                              value: "Under",
                              avatar: Icon(Icons.arrow_downward,
                                  color: Colors.amber, size: 20.0),
                            ),
                          ],
                          validator: (value) {
                            if (value != null) {
                              betSomething = true;
                            }
                          },
                        ),
                      ),
                    ],
                  ),
                  SliderObj("Bet (1-100)", "BET_AMOUNT", 1, 100,
                      discreteDivisions: 99),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: SizedBox(
                      width: 300,
                      height: 60,
                      child: ElevatedButton(
                          onPressed: () {
                            if (_key.currentState!.saveAndValidate()) {
                              if (betSomething == false) {
                                showSnackBar(
                                    context, "You must bet on something!");
                              } else if (casinoCache.isEmpty) {
                                setState(() {
                                  casinoCache = _key.currentState!.value;
                                });

                                showSnackBar(context, "Submitted!");
                              } else {
                                showSnackBar(
                                  context,
                                  "You have already submitted cheater!",
                                );
                              }
                            }
                            print(casinoCache);
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.blue,
                          ),
                          child: const Text(
                            "Submit",
                            style: TextStyle(fontSize: 30),
                          )),
                    ),
                  )
                ],
              ),
            )));
  }
}
