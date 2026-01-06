// ignore: must_be_immutable
import 'package:daisy_scout_tablet/Constants/daisy_constants.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:number_inc_dec/number_inc_dec.dart';

import 'package:daisy_scout_tablet/Utilities/title_txt.dart';

class CounterObj extends StatelessWidget {
  late final TitleTxt txt;
  late final FormBuilderField numberInput;

  CounterObj(
    TabletIdentity tabletIdentity,
    String label,
    String id, {
    super.key,
    int min = 0,
    int max = 999999,
    final color = Colors.black,
    final arrangement = ButtonArrangement.incRightDecLeft,
    avatar,
  }) {
    Color borderColor = Color.fromARGB(248, 83, 92, 213);
    if (tabletIdentity.tabletColor == TabletColor.red) {
      borderColor = Color.fromARGB(248, 175, 18, 29);
    }

    txt = TitleTxt(label);
    TextEditingController edit = TextEditingController();

    numberInput = FormBuilderField<int>(
        name: id,
        initialValue: 0,
        onSaved: (newValue) => edit.text = newValue.toString(),
        onReset: () => edit.text = "0",
        builder: (FormFieldState<dynamic> field) {
          return SizedBox(
            width: 175,
            child: Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: DaisyConstants.horizPadding),
                child: NumberInputWithIncrementDecrement(
                  numberFieldDecoration: InputDecoration(
                    border: InputBorder.none,
                  ),
                  style: TextStyle(fontSize: 30),
                  widgetContainerDecoration: BoxDecoration(
                      borderRadius: BorderRadius.all(Radius.circular(10)),
                      border: Border.all(
                        color: borderColor,
                        width: 3,
                      )),
                  incIconDecoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.only(
                      bottomLeft: Radius.circular(10),
                    ),
                  ),
                  separateIcons: true,
                  decIconDecoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(10),
                    ),
                  ),
                  incIconSize: 50,
                  decIconSize: 50,
                  incIcon: Icons.add_rounded,
                  decIcon: Icons.horizontal_rule_rounded,
                  controller: edit,
                  incDecBgColor: color,
                  buttonArrangement: arrangement,
                  min: min,
                  max: max,
                  onChanged: (newValue) => field.didChange(newValue),
                  onIncrement: (newValue) => field.didChange(newValue),
                  onDecrement: (newValue) => field.didChange(newValue),
                )),
          );
        });
  }

  Text getText() {
    return txt.getText();
  }

  FormBuilderField getNumberInput() {
    return numberInput;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [getText(), getNumberInput()],
    );
  }
}
