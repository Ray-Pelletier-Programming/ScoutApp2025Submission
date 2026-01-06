import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';

class CheckboxObj extends StatelessWidget {
  late final FormBuilderCheckbox checkbox;

  CheckboxObj(
    String label,
    String id, {
    super.key,
    final Color checkColor = Colors.white,
    final Color activeColor = Colors.green,
    Function(dynamic)? onChanged,
  }) {
    checkbox = FormBuilderCheckbox(
        name: id,
        title: Text(label, style: TextStyle(fontSize: 20)),
        initialValue: false,
        checkColor: checkColor,
        activeColor: activeColor,
        controlAffinity: ListTileControlAffinity.leading,
        side: BorderSide(color: Colors.white, width: 2),
        onChanged: onChanged);
  }

  FormBuilderCheckbox getCheckbox() {
    return checkbox;
  }

  @override
  Widget build(BuildContext context) {
    return getCheckbox();
  }
}
