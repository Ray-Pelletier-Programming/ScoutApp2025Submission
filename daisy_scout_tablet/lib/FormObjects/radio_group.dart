import 'package:daisy_scout_tablet/Constants/daisy_constants.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import 'package:daisy_scout_tablet/Utilities/title_txt.dart';
import 'package:provider/provider.dart';

class RadioGroupObj extends StatelessWidget {
  late final TitleTxt txt;
  late final FormBuilderChoiceChip singleSel;

  RadioGroupObj(BuildContext context, label, String id,
      List<FormBuilderChipOption> options,
      {super.key,
      final Color activeColor = Colors.green,
      Function(dynamic)? onChanged,
      dynamic initialValue,
      Color inactiveColor = const Color.fromARGB(248, 83, 92, 213),
      required String? Function(dynamic value) validator}) {
    late final TabletIdentity tabletIdentity =
        Provider.of<TabletIdentity>(context, listen: false);
    if (tabletIdentity.tabletColor == TabletColor.red) {
      inactiveColor = Color.fromARGB(248, 190, 26, 37);
    }
    txt = TitleTxt(label);
    singleSel = FormBuilderChoiceChip(
      name: id,
      labelStyle:
          TextStyle(color: Color.fromARGB(197, 253, 253, 253), fontSize: 16),
      backgroundColor: inactiveColor,
      alignment: WrapAlignment.center,
      options: options,
      selectedColor: activeColor,
      spacing: DaisyConstants.horizPadding,
      decoration: const InputDecoration(
          helperText: "",
          contentPadding:
              EdgeInsets.symmetric(horizontal: DaisyConstants.horizPadding)),
      validator: validator,
      initialValue: initialValue,
      onChanged: onChanged,
      checkmarkColor: Colors.white,
    );
  }

  Text getText() {
    return txt.getText();
  }

  FormBuilderChoiceChip getSingleSelection() {
    return singleSel;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [getText(), getSingleSelection()],
    );
  }
}
