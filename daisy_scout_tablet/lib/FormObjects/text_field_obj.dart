import 'package:daisy_scout_tablet/Constants/daisy_constants.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

import 'package:daisy_scout_tablet/Utilities/field_info.dart';
import 'package:daisy_scout_tablet/Utilities/title_txt.dart';

class TextFieldObj extends StatelessWidget {
  late final FormBuilderTextField textField;
  late final TitleTxt txt;

  TextFieldObj(
    String label,
    String id,
    FieldInfo typeRestrictions, {
    super.key,
    Function(dynamic)? onChanged,
    String? initalValue,
    double? fontSize = TitleTxt.fontSize,
    TextEditingController? controller,
    int? maxLines,
  }) {
    txt = TitleTxt(label, fontSize: fontSize);

    textField = FormBuilderTextField(
      controller: controller,
      name: id,
      keyboardType: typeRestrictions.inputType,
      decoration: InputDecoration(
        helperText: "",
        contentPadding:
            const EdgeInsets.symmetric(horizontal: DaisyConstants.horizPadding),
        border: const OutlineInputBorder(
          borderRadius: BorderRadius.all(
            Radius.circular(10.0),
          ),
        ),
        hintText: label,
      ),
      validator: (value) {
        if (value == null || value == '') {
          return "Enter value";
        }
        return null;
      },
      inputFormatters: typeRestrictions.formatters,
      onChanged: onChanged,
      initialValue: initalValue,
      enabled: typeRestrictions.enabled,
      maxLines: maxLines,
    );
  }

  FormBuilderTextField getTextField() {
    return textField;
  }

  Text getText() {
    return txt.getText();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [getText(), getTextField()],
    );
  }
}
