import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/tablet_mode.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Widgets/qr_carousel.dart';
import 'package:flutter/material.dart';
import 'package:daisy_scout_tablet/Widgets/navigation_drawer_custom.dart';
import 'package:provider/provider.dart';

class QRPage extends StatefulWidget {
  const QRPage({super.key});

  @override
  State<QRPage> createState() => _QRPageState();
}

class _QRPageState extends State<QRPage> with TickerProviderStateMixin {
  late final TabController _tabController;

  late final TabletIdentity _tabletIdentity =
      Provider.of<TabletIdentity>(context, listen: false);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            centerTitle: true,
            bottom: TabBar(
              controller: _tabController,
              tabs: <Widget>[
                Tab(
                  child: _tabletIdentity.tabletMode == TabletMode.leader
                      ? Text("Leader")
                      : _tabletIdentity.tabletMode == TabletMode.scouting
                          ? Text("Match")
                          : Text("Elims"),
                ),
                Tab(
                  child: Text("Pit"),
                )
              ],
            ),
            title: const Text("QR Codes")),
        drawer: NavigationDrawerCustom(),
        // body: QRCarousel(),
        body: TabBarView(controller: _tabController, children: [
          QRCarousel(
            key: widget.key,
            dataFolder: _tabletIdentity.tabletMode == TabletMode.leader
                ? DataFolder.leader
                : _tabletIdentity.tabletMode == TabletMode.scouting
                    ? DataFolder.match
                    : DataFolder.elims,
          ),
          QRCarousel(
            key: widget.key,
            dataFolder: DataFolder.pit,
          )
        ]));
  }
}
