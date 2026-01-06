// ignore_for_file: avoid_print

import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Services/qr_data_service.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Widgets/enlarged_qr_code.dart';
import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QRCode extends StatelessWidget {
  const QRCode(
      {super.key,
      required this.formData,
      required this.dataFolder,
      required this.context,
      required this.tabletIdentity});

  final Map<String, dynamic> formData;
  final BuildContext context;
  final DataFolder dataFolder;
  final TabletIdentity tabletIdentity;

  @override
  Widget build(BuildContext context) {
    var encodedData = QrDataService.encodeScoutDataForQR(
        dataFolder, formData, tabletIdentity);

    QrImageView qrImg = QrImageView(
      data: encodedData,
      size: 200.0,
      padding: EdgeInsets.zero,
      backgroundColor: Colors.white,
    );

    return Expanded(
        flex: 3,
        child: GestureDetector(
          child: Hero(
              tag: 'imageHero',
              child: FittedBox(
                  fit: BoxFit.contain,
                  alignment: Alignment.center,
                  child: SizedBox(
                    child: qrImg,
                  ))),
          onTap: () {
            Navigator.push(context, MaterialPageRoute(builder: (_) {
              return EnlargedQRCode(qrImg);
            }));
          },
        ));
  }
}
