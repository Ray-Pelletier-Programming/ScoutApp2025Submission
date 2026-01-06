import 'package:daisy_scout_tablet/Services/daisy_storage.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/daisy_scout_tablet_app.dart';
import 'package:daisy_scout_tablet/Services/local_data_handler.dart';
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:provider/provider.dart';

Future main() async {
  await dotenv.load(fileName: '.env');
  var identity = TabletIdentity();
  await identity.load();
  await DaisyStorage.ensureDataStorageLocationExists();
  await fetchLocalMatchScheduleData(identity.activeComp);

  runApp(ChangeNotifierProvider(
    create: (_) {
      return identity;
    },
    child: const DaisyScoutTabletApp(),
  ));
}
