import 'package:flutter/services.dart';

class FieldInfo {
  List<TextInputFormatter> formatters;
  TextInputType inputType;
  bool enabled;
  FieldInfo({
    required this.formatters,
    required this.inputType,
    this.enabled = true,
  });
}
