import 'package:flutter/material.dart';

class TitleTxt {
  static const double fontSize = 25;
  Text txt = const Text("");
  TitleTxt(String text, {fontSize = fontSize}) {
    if (text.isNotEmpty) {
      txt = Text(
        text,
        style: TextStyle(fontSize: fontSize),
        textAlign: TextAlign.center,
      );
    }
  }

  Text getText() {
    return txt;
  }

  void setText(String t) {
    txt = Text(t);
  }
}
