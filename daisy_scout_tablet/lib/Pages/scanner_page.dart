import 'dart:convert'; // For jsonEncode
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/scanner_action.dart';
import 'package:daisy_scout_tablet/Enums/scanner_tablet.dart';
import 'package:daisy_scout_tablet/Services/qr_data_service.dart';
import 'package:daisy_scout_tablet/Utilities/ui_functions.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:daisy_scout_tablet/Widgets/navigation_drawer_custom.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';

class ScannerPage extends StatefulWidget {
  const ScannerPage({super.key});

  @override
  State<ScannerPage> createState() => _PitPageState();
}

class _PitPageState extends State<ScannerPage> {
  final GlobalKey<FormBuilderState> _key = GlobalKey<FormBuilderState>();

  //  There has to be a better way to do this, but my brain cannot think of a better way so.
  Map<String, dynamic> nullMap = {};

  List<Map<String, dynamic>> pits = [];
  List<Map<String, dynamic>> match = [{}, {}, {}, {}, {}, {}];
  /*
    0 - Red One
    1 - Red Two
    2 - Red Three
    3 - Blue One
    4 - Blue Two
    5 - Blue Three
  */
  List<Map<String, dynamic>> leader = [{}, {}];
  /*
   0 - Red Leader
   1 - Blue Leader
  */

  List<Map<String, dynamic>> elims = [];

  bool matchEmpty = true;
  bool leaderEmpty = true;

  DataFolder typeScanned = DataFolder.pit;

  String? code;

  String pitName = "Pit Data Scanned: 0";
  String data = "";
  ScannerTabletIdentity tabletIdentity = ScannerTabletIdentity.blue1;

  // late final TabletIdentity _tabletIdentity =
  //     Provider.of<TabletIdentity>(context, listen: false);
  Color redOneColor = Colors.grey;
  Color redTwoColor = Colors.grey;
  Color redThreeColor = Colors.grey;
  Color redLeaderColor = Colors.grey;

  Color blueOneColor = Colors.grey;
  Color blueTwoColor = Colors.grey;
  Color blueThreeColor = Colors.grey;
  Color blueLeaderColor = Colors.grey;

  String redOneText = "Red 1";
  String redTwoText = "Red 2";
  String redThreeText = "Red 3";
  String redLeaderText = "Red Leader";

  String blueOneText = "Blue 1";
  String blueTwoText = "Blue 2";
  String blueThreeText = "Blue 3";
  String blueLeaderText = "Blue Leader";

  static const apiHost = "http://localhost:8080";

  Future<bool> pushMatch(String data) async {
    var url = Uri.parse('$apiHost/api/match-data');
    var response = await http.post(url, body: data).timeout(
        const Duration(seconds: 10),
        onTimeout: () => http.Response('Error', 408));

    return response.statusCode == 200;
    // if (response.statusCode != 408) {
    //   isOnline = true;
    // } else {
    //   isOnline = false;
    // }
  }

  Future<bool> pushLeader(String data) async {
    var url = Uri.parse('$apiHost/api/leader-data');
    var response = await http.post(url, body: data).timeout(
        const Duration(seconds: 1),
        onTimeout: () => http.Response('Error', 408));

    return response.statusCode == 200;
    // if (response.statusCode != 408) {
    //   isOnline = true;
    // } else {
    //   isOnline = false;
    // }
  }

  Future<bool> pushPit(String data) async {
    var url = Uri.parse('$apiHost/api/pit-data');
    var response = await http.post(url, body: data).timeout(
        const Duration(seconds: 1),
        onTimeout: () => http.Response('Error', 408));

    return response.statusCode == 200;
    // if (response.statusCode != 408) {
    //   isOnline = true;
    // } else {
    //   isOnline = false;
    // }
  }

  Future<bool> pushElim(String data) async {
    var url = Uri.parse('$apiHost/api/elim-data');
    var response = await http.post(url, body: data).timeout(
        const Duration(seconds: 1),
        onTimeout: () => http.Response('Error', 408));

    return response.statusCode == 200;
    // if (response.statusCode != 408) {
    //   isOnline = true;
    // } else {
    //   isOnline = false;
    // }
  }

  void updateStatus(
      ScannerTabletIdentity identity, ScannerAction action) async {
    if (action == ScannerAction.sync) {
      if (pits.isNotEmpty) {
        debugPrint('doing pits');
        for (var pit in pits) {
          await pushPit(jsonEncode(pit));
        }
        pits = [];
      }

      if (elims.isNotEmpty) {
        debugPrint('doing pits');
        for (var elim in elims) {
          await pushElim(jsonEncode(elim));
        }
        elims = [];
      }

      if (matchEmpty == false) {
        debugPrint('doing matches');
        for (var theMatch in match) {
          if (theMatch.isNotEmpty) {
            await pushMatch(jsonEncode(theMatch));
          }
        }
        match = [{}, {}, {}, {}, {}, {}];
        matchEmpty = true;
      }

      if (leaderEmpty == false) {
        debugPrint('doing leaders');
        for (var theLeader in leader) {
          if (theLeader.isNotEmpty) {
            await pushLeader(jsonEncode(theLeader));
          }
        }
        leader = [{}, {}];
        leaderEmpty = true;
      }

      setState(() {
        redOneColor = Colors.grey;
        redTwoColor = Colors.grey;
        redThreeColor = Colors.grey;
        redLeaderColor = Colors.grey;

        blueOneColor = Colors.grey;
        blueTwoColor = Colors.grey;
        blueThreeColor = Colors.grey;
        blueLeaderColor = Colors.grey;

        redOneText = "Red 1";
        redTwoText = "Red 2";
        redThreeText = "Red 3";
        redLeaderText = "Red Leader";

        blueOneText = "Blue 1";
        blueTwoText = "Blue 2";
        blueThreeText = "Blue 3";
        blueLeaderText = "Blue Leader";

        pitName = "Pit Data Scanned: ${pits.length}";
      });
    }
    if (action == ScannerAction.scan) {
      if (identity == ScannerTabletIdentity.red1) {
        setState(() {
          redOneColor = Colors.red;
          redOneText = "✓ Red 1";
        });
      }
      if (identity == ScannerTabletIdentity.red2) {
        setState(() {
          redTwoColor = Colors.red;
          redTwoText = "✓ Red 2";
        });
      }
      if (identity == ScannerTabletIdentity.red3) {
        setState(() {
          redThreeColor = Colors.red;
          redThreeText = "✓ Red 3";
        });
      }
      if (identity == ScannerTabletIdentity.redLeader) {
        setState(() {
          redLeaderColor = Colors.red;
          redLeaderText = "✓ Red Leader";
        });
      }
      if (identity == ScannerTabletIdentity.blue1) {
        setState(() {
          blueOneColor = Colors.blue;
          blueOneText = "✓ Blue 1";
        });
      }
      if (identity == ScannerTabletIdentity.blue2) {
        setState(() {
          blueTwoColor = Colors.blue;
          blueTwoText = "✓ Blue 2";
        });
      }
      if (identity == ScannerTabletIdentity.blue3) {
        setState(() {
          blueThreeColor = Colors.blue;
          blueThreeText = "✓ Blue 3";
        });
      }
      if (identity == ScannerTabletIdentity.blueLeader) {
        setState(() {
          blueLeaderColor = Colors.blue;
          blueLeaderText = "✓ Blue Leader";
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(centerTitle: true, title: const Text("Scanner")),
        drawer: NavigationDrawerCustom(),
        body: FormBuilder(
            key: _key,
            autovalidateMode: AutovalidateMode.disabled,
            child: Row(
              children: [
                Expanded(
                  flex: 1,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: redOneColor,
                                border: Border.all(
                                    color: Colors.grey,
                                    width:
                                        6)), //Color change from black to red after tablet has been scanned
                            child: Text(
                              redOneText,
                              style: TextStyle(
                                  fontSize: 50,
                                  height:
                                      2.5), //height of 3 centers it vertically
                              textAlign: TextAlign.center,
                            ),
                          )),
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: redTwoColor,
                                border:
                                    Border.all(color: Colors.grey, width: 6)),
                            child: Text(
                              redTwoText,
                              style: TextStyle(fontSize: 50, height: 2.5),
                              textAlign: TextAlign.center,
                            ),
                          )),
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: redThreeColor,
                                border:
                                    Border.all(color: Colors.grey, width: 6)),
                            child: Text(
                              redThreeText,
                              style: TextStyle(fontSize: 50, height: 2.5),
                              textAlign: TextAlign.center,
                            ),
                          )),
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: redLeaderColor,
                                border:
                                    Border.all(color: Colors.grey, width: 6)),
                            child: Text(
                              redLeaderText,
                              style: TextStyle(fontSize: 50, height: 2.5),
                              textAlign: TextAlign.center,
                            ),
                          )),
                    ],
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                          width: 400,
                          height: 175,
                          child: ElevatedButton(
                              onPressed: () {
                                _openScan(context);
                              },
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.green,
                                  side:
                                      BorderSide(color: Colors.grey, width: 6)),
                              child: Text(
                                "Scan",
                                style: TextStyle(fontSize: 50, height: 3.5),
                                textAlign: TextAlign.center,
                              ))),
                      SizedBox(
                          width: 400,
                          height: 175,
                          child: ElevatedButton(
                              onPressed: () {
                                updateStatus(ScannerTabletIdentity.red1,
                                    ScannerAction.sync);
                              },
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.green,
                                  side:
                                      BorderSide(color: Colors.grey, width: 6)),
                              child: Text(
                                "Sync",
                                style: TextStyle(fontSize: 50, height: 3.5),
                                textAlign: TextAlign.center,
                              ))),
                      SizedBox(
                          width: 400,
                          height: 175,
                          child: ElevatedButton(
                              onPressed: () {},
                              style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.lightBlue,
                                  side:
                                      BorderSide(color: Colors.grey, width: 6)),
                              child: Text(pitName,
                                  style: TextStyle(fontSize: 50, height: 1.75),
                                  textAlign: TextAlign.center))),
                    ],
                  ),
                ),
                Expanded(
                  flex: 1,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: blueOneColor,
                                border:
                                    Border.all(color: Colors.grey, width: 6)),
                            child: Text(
                              blueOneText,
                              style: TextStyle(fontSize: 50, height: 2.5),
                              textAlign: TextAlign.center,
                            ),
                          )),
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: blueTwoColor,
                                border:
                                    Border.all(color: Colors.grey, width: 6)),
                            child: Text(
                              blueTwoText,
                              style: TextStyle(fontSize: 50, height: 2.5),
                              textAlign: TextAlign.center,
                            ),
                          )),
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: blueThreeColor,
                                border:
                                    Border.all(color: Colors.grey, width: 6)),
                            child: Text(
                              blueThreeText,
                              style: TextStyle(fontSize: 50, height: 2.5),
                              textAlign: TextAlign.center,
                            ),
                          )),
                      SizedBox(
                          width: 400,
                          height: 125,
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                                color: blueLeaderColor,
                                border:
                                    Border.all(color: Colors.grey, width: 6)),
                            child: Text(
                              blueLeaderText,
                              style: TextStyle(fontSize: 50, height: 2.5),
                              textAlign: TextAlign.center,
                            ),
                          )),
                    ],
                  ),
                ),
              ],
            )));
  }

  void _openScan(BuildContext context) async {
    // building puts assets under assets folder...
    final String scriptUrl =
        "/assets/assets/zxing_library@0.21.3_umd_index.min.js";

    if (kIsWeb) {
      MobileScannerPlatform.instance.setBarcodeLibraryScriptUrl(scriptUrl);
    }

    final code = await showDialog<String?>(
        context: context,
        builder: (BuildContext context) {
          return AlertDialog(
              insetPadding: EdgeInsets.all(5),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.all(Radius.circular(10.0)),
              ),
              title: const Text('Scan QR Code'),
              content: SizedBox(
                width: 640,
                height: 480,
                child: MobileScanner(
                  onDetect: (BarcodeCapture capture) {
                    final List<Barcode> barcodes = capture.barcodes;
                    if (barcodes.isNotEmpty &&
                        barcodes.first.rawValue != null) {
                      Navigator.of(context).pop(barcodes.first.rawValue!);
                    }
                  },
                ),
              ));
        });

    String dataType = QrDataService.getDataType(code.toString());

    switch (dataType) {
      case 'p':
        typeScanned = DataFolder.pit;
        pits.add(QrDataService.decodeScoutDataForQR(code.toString()).$2);
        if (context.mounted) {
          showSnackBar(context, "Scanned Pit QR");
        }
        break;
      case 'm':
        typeScanned = DataFolder.match;
        if (context.mounted) {
          showSnackBar(context, "Scanned Match QR");
        }
        break;
      case 'l':
        typeScanned = DataFolder.leader;
        if (context.mounted) {
          showSnackBar(context, "Scanned Leader QR");
        }
        break;
      case 'e':
        typeScanned = DataFolder.elims;
        if (context.mounted) {
          showSnackBar(context, "Scanned Elims QR");
        }
        break;
      default:
        if (context.mounted) {
          showSnackBar(context, "Scanned UNSUPPORTED QR - $code");
        }
        // return from method instead of exiting from switch
        // did not get a code we know how to handle.
        return;
    }

    // moved from above, was running on scan button click
    // not after the code was scanned.
    switch (typeScanned) {
      case DataFolder.pit:
        break;
      case DataFolder.elims:
        break;
      case DataFolder.match:
        Map<String, dynamic> dataMap =
            QrDataService.decodeScoutDataForQR(code.toString()).$2;
        String dataColorString = dataMap['TabletColor'];
        String dataNumberString = dataMap['TabletPosition'];

        if (dataColorString == 'R') {
          if (dataNumberString == '1') {
            tabletIdentity = ScannerTabletIdentity.red1;
            match[0] = dataMap;
            matchEmpty = false;
          }
          if (dataNumberString == '2') {
            tabletIdentity = ScannerTabletIdentity.red2;
            match[1] = dataMap;
            matchEmpty = false;
          }
          if (dataNumberString == '3') {
            tabletIdentity = ScannerTabletIdentity.red3;
            match[2] = dataMap;
            matchEmpty = false;
          }
        }
        if (dataColorString == 'B') {
          if (dataNumberString == '1') {
            tabletIdentity = ScannerTabletIdentity.blue1;
            match[3] = dataMap;
            matchEmpty = false;
          }
          if (dataNumberString == '2') {
            tabletIdentity = ScannerTabletIdentity.blue2;
            match[4] = dataMap;
            matchEmpty = false;
          }
          if (dataNumberString == '3') {
            tabletIdentity = ScannerTabletIdentity.blue3;
            match[5] = dataMap;
            matchEmpty = false;
          }
        }
        break;
      case DataFolder.leader:
        Map<String, dynamic> dataMap =
            QrDataService.decodeScoutDataForQR(code.toString()).$2;
        String dataColorString = dataMap['TabletColor'];
        if (dataColorString == 'B') {
          tabletIdentity = ScannerTabletIdentity.blueLeader;
          leader[0] = dataMap;
          leaderEmpty = false;
        }
        if (dataColorString == 'R') {
          tabletIdentity = ScannerTabletIdentity.redLeader;
          leader[1] = dataMap;
          leaderEmpty = false;
        }
        break;
    }
    if (typeScanned != DataFolder.pit) {
      updateStatus(tabletIdentity, ScannerAction.scan);
    } else {
      setState(() {
        pitName = "Pit Data Scanned: ${pits.length}";
      });
    }
  }
}
