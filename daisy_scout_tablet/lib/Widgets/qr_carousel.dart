import 'package:daisy_scout_tablet/Constants/daisy_constants.dart';
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Services/scout_data_service.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Widgets/qr_carousel_item.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:provider/provider.dart';

class QRCarousel extends StatefulWidget {
  final DataFolder dataFolder;
  const QRCarousel({super.key, required this.dataFolder});

  @override
  State<StatefulWidget> createState() => _QRCarousel();
}

class _QRCarousel extends State<QRCarousel> {
  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  Widget _buildCarouselItem(int itemIndex, ScoutDataService dataService) {
    final GlobalKey<FormBuilderState> key = GlobalKey<FormBuilderState>();

    return FutureBuilder<Map<String, dynamic>>(
        future: dataService.getScoutData(dataService.getFileName(itemIndex)),
        builder: (context, AsyncSnapshot<Map<String, dynamic>> snapshot) {
          if (snapshot.hasData) {
            return Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: DaisyConstants.horizPadding),
                child: QRCarouselItem(
                  formData: snapshot.data!,
                  stateKey: key,
                  dataFolder: widget.dataFolder,
                  tabletIdentity: _tabletIdentity,
                ));
          } else {
            return CircularProgressIndicator();
          }
        });
  }

  @override
  Widget build(BuildContext context) {
    ScoutDataService dataService =
        ScoutDataService(_tabletIdentity, widget.dataFolder);

    return FutureBuilder<int>(
        future: dataService.getFileCount(),
        builder: (context, AsyncSnapshot<int> snapshot) {
          if (snapshot.hasData) {
            return Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Text(
                  '${snapshot.data} to Scan',
                  style: const TextStyle(fontSize: 18),
                ),
                Expanded(
                  child: PageView.builder(
                    itemCount: snapshot.data,
                    controller: PageController(),
                    physics: const BouncingScrollPhysics(),
                    itemBuilder: (BuildContext context, int itemIndex) {
                      return _buildCarouselItem(
                          (snapshot.data!) - itemIndex - 1, dataService);
                    },
                  ),
                )
              ],
            );
          } else {
            return CircularProgressIndicator();
          }
        });
  }
}
