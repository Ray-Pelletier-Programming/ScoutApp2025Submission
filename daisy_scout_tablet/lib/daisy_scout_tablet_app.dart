import 'package:daisy_scout_tablet/Pages/config_page.dart';
import 'package:flutter/material.dart';

class DaisyScoutTabletApp extends StatelessWidget {
  const DaisyScoutTabletApp({super.key});

  static const String _title = 'Scouting App';

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: _title,
        theme: ThemeData.dark().copyWith(
            elevatedButtonTheme: ElevatedButtonThemeData(
          style: TextButton.styleFrom(
              shape: const RoundedRectangleBorder(
                  borderRadius: BorderRadius.all(Radius.circular(20.0))),
              backgroundColor: Colors.black87,
              foregroundColor: Colors.white),
        )),
        home: ConfigPage());
  }
}
