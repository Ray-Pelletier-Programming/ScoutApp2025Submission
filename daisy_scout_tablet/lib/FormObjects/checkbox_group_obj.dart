import 'package:daisy_scout_tablet/Constants/daisy_constants.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import 'package:daisy_scout_tablet/Utilities/title_txt.dart';

class CheckboxGroupObj extends StatelessWidget {
  late final TitleTxt txt;
  late final FormBuilderFilterChip chk;

  CheckboxGroupObj( TabletIdentity tabletIdentity, String label, String id, List<FormBuilderChipOption> options,
      {super.key, final Color activeColor = Colors.green, Color inactiveColor = const Color.fromARGB(248, 83, 92, 213)}) {
        if (tabletIdentity.tabletColor == TabletColor.red)
        {
          inactiveColor = Color.fromARGB(248, 175, 18, 29);
        }
    txt = TitleTxt(label);
    chk = FormBuilderFilterChip(
        name: id,
        backgroundColor: inactiveColor,
        labelStyle: TextStyle(fontSize: 16),
        options: options,
        selectedColor: activeColor,
        alignment: WrapAlignment.center,
        spacing: DaisyConstants.horizPadding,
        decoration: const InputDecoration(
            helperText: "",
            contentPadding:
                EdgeInsets.symmetric(horizontal: DaisyConstants.horizPadding)));
  }

  Text getText() {
    return txt.getText();
  }

  FormBuilderFilterChip getCheckboxGroup() {
    return chk;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [getText(), getCheckboxGroup()],
    );
  }
}
