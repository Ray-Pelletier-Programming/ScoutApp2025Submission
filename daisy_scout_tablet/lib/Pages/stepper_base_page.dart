// ignore_for_file: avoid_print

import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color_extension.dart';
import 'package:daisy_scout_tablet/Enums/tablet_mode.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position_extension.dart';
import 'package:daisy_scout_tablet/Pages/subjective_match_page.dart';
import 'package:daisy_scout_tablet/Services/scout_data_service.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Utilities/ui_functions.dart';
import 'package:daisy_scout_tablet/Widgets/navigation_drawer_custom.dart';
import 'package:daisy_scout_tablet/globals.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

abstract class StepperBasePage extends StatefulWidget {
  const StepperBasePage({super.key});

  @override
  StepperBasePageState createState() => StepperBasePageState();
}

class StepperBasePageState<T extends StepperBasePage> extends State<T> {
  late final List<GlobalKey<FormBuilderState>> stepperFormKeys;
  bool hasSwiped = false;
  int currentStep = 0;
  Map<String, dynamic> savedData = <String, dynamic>{};

  bool get _isFirstStep => currentStep == 0;
  bool get _isLastStep => currentStep == ((getSteps().length) - 1);
  bool _isComplete = false;

  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  // if LateError occurs indicating that scoutDataService is not initialized,
  // make sure that the initState overload in the sub-class initializes this variable.
  late ScoutDataService scoutDataService;

  late List<String> stepTitles;

  @override
  void initState() {
    super.initState();
    stepperFormKeys = getStepperFormKeys();
    stepTitles = getStepTitles();
    if (getSteps().length != stepTitles.length) {
      throw Exception("Make sure number of steps and step titles are the same");
    }
  }

  @override
  Widget build(BuildContext context) {
    Text label;
    if (_tabletIdentity.tabletMode == TabletMode.scouting) {
      label = Text(
        '${stepTitles[currentStep]} // ${_tabletIdentity.tabletColor.label} ${_tabletIdentity.tabletPosition.label}',
        style: TextStyle(color: _tabletIdentity.tabletColor.color),
      );
    } else {
      label = Text(
        '${stepTitles[currentStep]} // ${_tabletIdentity.tabletColor.label} Leader',
        style: TextStyle(color: _tabletIdentity.tabletColor.color),
      );
    }
    TabletColor color = _tabletIdentity.tabletColor;
    TabletMode mode = _tabletIdentity.tabletMode;
    return GestureDetector(
        onPanUpdate: (details) {
          if (SubjectiveMatchPage.isReordering == true) {
            if (details.delta.dx > 0) {
              // Code to go to past page
              setState(() {
                if (!_isFirstStep && !hasSwiped) {
                  currentStep--;
                  hasSwiped = true;
                }
                hideKeyboard(context);
              });
            }
            if (details.delta.dx < 0) {
              if (!_isLastStep && !hasSwiped) {
                currentStep++;
                hasSwiped = true;
              }
              hideKeyboard(context);
            }
          }
        },
        onPanEnd: (details) {
          hasSwiped = false;
        },
        onTap: () {
          // final bottomInsets = MediaQuery.of(context).viewInsets.bottom;
          // if (bottomInsets != 0) hideKeyboard(context);
        }, // Think this works - Test on Tablets

        child: Scaffold(
          appBar: AppBar(
            centerTitle: true,
            title: label,
            toolbarHeight: 35.0,
          ),
          drawer: NavigationDrawerCustom(),
          body: _isComplete
              ? buildSuccessPage()
              : Stepper(
                  currentStep: currentStep,
                  type: StepperType.horizontal,
                  steps: getSteps(),
                  onStepContinue: () async {
                    if (_isLastStep) {
                      // ensure each step is valid
                      for (var i = 0; i < stepperFormKeys.length; i++) {
                        if (!stepperFormKeys[i].currentState!.validate()) {
                          setState(() {
                            // NOTE: this requires every step to have a FormBuilderState on it.
                            // if there is a page without a FormBuilder on it
                            // setting focus would have to find the page that contains the
                            // formbuilderstate object on it.
                            currentStep = i;
                          });
                          showSnackBar(context, "Missing required fields");
                          return;
                        }
                      }

                      // now that we are sure the steps all have valid data
                      // save it to the state
                      for (var i = 0; i < stepperFormKeys.length; i++) {
                        stepperFormKeys[i].currentState!.save();
                      }

                      // concatenate all step states together
                      Map<String, dynamic> allFields = <String, dynamic>{};
                      for (var i = 0; i < stepperFormKeys.length; i++) {
                        allFields
                            .addAll(stepperFormKeys[i].currentState!.value);
                        allFields.addAll(casinoCache);
                      }

                      // save the data to a file
                      await scoutDataService.saveScoutData(allFields);

                      // Indicate that match data is complete and valid, so show
                      // the QR for scanning...
                      setState(() {
                        debugPrint("$allFields");
                        _isComplete = true;
                        savedData = allFields;
                      });
                      return;
                    }
                    setState(() {
                      currentStep++;
                      hideKeyboard(context);
                    });
                  },
                  onStepCancel: () {
                    _isFirstStep ? null : setState(() => currentStep--);
                  },
                  onStepTapped: (step) => setState(() => currentStep = step),
                  controlsBuilder: (context, details) => Padding(
                        padding: const EdgeInsets.only(top: 8),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (!_isFirstStep) ...[
                              ElevatedButton(
                                  onPressed: _isFirstStep
                                      ? null
                                      : details.onStepCancel,
                                  style: (mode == TabletMode.scouting &&
                                          color == TabletColor.red)
                                      ? TextButton.styleFrom(
                                          backgroundColor: const Color.fromARGB(
                                              248, 175, 18, 29))
                                      : TextButton.styleFrom(
                                          backgroundColor: const Color.fromARGB(
                                              248, 83, 92, 213)),
                                  child: SizedBox(
                                      width: 175,
                                      height: 20,
                                      child: const Text('Back',
                                          textAlign: TextAlign.center))),
                            ],
                            const SizedBox(width: 16),
                            ElevatedButton(
                                onPressed: details.onStepContinue,
                                style: (mode == TabletMode.scouting &&
                                        color == TabletColor.red)
                                    ? TextButton.styleFrom(
                                        backgroundColor: const Color.fromARGB(
                                            248, 175, 18, 29))
                                    : TextButton.styleFrom(
                                        backgroundColor: const Color.fromARGB(
                                            248, 83, 92, 213)),
                                child: SizedBox(
                                    width: 175,
                                    height: 20,
                                    child: Text(_isLastStep ? 'Save' : 'Next',
                                        textAlign: TextAlign.center))),
                          ],
                        ),
                      )),
        ));
  }

  StepState getStepState(int step) {
    var state = StepState.indexed;
    if (currentStep >= step) {
      if (stepperFormKeys[step].currentState != null) {
        if (stepperFormKeys[step].currentState!.validate()) {
          state = StepState.complete;
        }
      }
    }
    return state;
  }

  // to be oberriden
  List<Step> getSteps() {
    return [
      Step(
        title: Text("Override steps to implement"),
        content: Text("To implement..."),
      ),
    ];
  }

  // to be obverridden...
  Widget? buildSuccessPage() {
    return Text("Success page");
  }

  List<String> getStepTitles() {
    return [
      "First Step",
    ];
  }

  List<GlobalKey<FormBuilderState>> getStepperFormKeys() {
    return [];
  }

  void reset(List<TextEditingController> controllersToClear) {
    setState(() {
      currentStep = 0;
      _isComplete = false;
      savedData = {};
      for (var controller in controllersToClear) {
        controller.text = "";
      }
      if (stepperFormKeys[0].currentState != null) {
        stepperFormKeys[0].currentState!.reset();
      }
      if (stepperFormKeys[1].currentState != null) {
        stepperFormKeys[1].currentState!.reset();
      }
      if (stepperFormKeys[2].currentState != null) {
        stepperFormKeys[2].currentState!.reset();
      }
    });
  }
}
