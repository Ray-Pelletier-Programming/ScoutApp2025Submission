import 'package:daisy_scout_tablet/Enums/tablet_mode.dart';
import 'package:daisy_scout_tablet/Pages/elim_page.dart';
import 'package:daisy_scout_tablet/Pages/password.dart';
import 'package:daisy_scout_tablet/Pages/scanner_page.dart';
import 'package:daisy_scout_tablet/Pages/subjective_match_page.dart';
import 'package:daisy_scout_tablet/Enums/tablet_color_extension.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Enums/tablet_position_extension.dart';
import 'package:flutter/material.dart';
import 'package:daisy_scout_tablet/Constants/custom_icons.dart';

import 'package:daisy_scout_tablet/globals.dart';
import 'package:daisy_scout_tablet/Pages/casino_page.dart';
import 'package:provider/provider.dart';

import '../Pages/config_page.dart';
import '../Pages/match_page.dart';
import '../Pages/pit_page.dart';
import '../Pages/qr_page.dart';
import '../Utilities/ui_functions.dart';

// ignore: must_be_immutable
class NavigationDrawerCustom extends StatelessWidget {
  final void Function()? onPageTap;
  // ignore: prefer_const_constructors_in_immutables
  NavigationDrawerCustom({super.key, this.onPageTap});

  late TabletIdentity _tabletIdentity;
  bool wantPassword = false;

  @override
  Widget build(BuildContext context) {
    _tabletIdentity = Provider.of<TabletIdentity>(context, listen: false);
    return Drawer(
        backgroundColor: Color.fromARGB(255, 47, 49, 64),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              buildHeader(context),
              const Divider(
                height: 20,
                color: Colors.white,
              ),
              buildMenuItems(context)
            ],
          ),
        ));
  }

  buildHeader(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(top: 5.0),
      child: Column(
        children: [
          CircleAvatar(
            radius: 30.0,
            backgroundColor: _tabletIdentity.tabletColor.color,
            child: Text(
              _tabletIdentity.tabletPosition.label,
              style: const TextStyle(
                  color: Color.fromARGB(255, 47, 49, 64), fontSize: 40.0),
            ),
          ),
          const SizedBox(
            height: 10.0,
          ),
          Text(matchScheduleJson.isEmpty
              ? "No comp data loaded"
              : "${_tabletIdentity.activeComp} data loaded for ${_tabletIdentity.compSeason}")
        ],
      ),
    );
  }

  buildMenuItems(BuildContext context) {
    MaterialPageRoute configRoute;
    if (wantPassword == true) {
      configRoute = MaterialPageRoute(
          builder: (ctx) => PasswordPage(desiredPage: ConfigPage()));
    } else {
      configRoute = MaterialPageRoute(builder: (ctx) => ConfigPage());
    }
    return Wrap(
      runSpacing: 16.0,
      alignment: WrapAlignment.center,
      children: [
        ListTile(
          leading: const Icon(Icons.settings),
          title: const Text("Config"),
          onTap: () {
            onPageTap?.call();

            Navigator.of(context).pushReplacement(configRoute);
          },
        ),
        if (_tabletIdentity.tabletMode == TabletMode.leader) ...{
          ListTile(
            leading: const Icon(CustomIcons.robot),
            title: const Text("Subjective Scouting"),
            onTap: () {
              onPageTap?.call();

              Navigator.of(context).pushReplacement(MaterialPageRoute(
                  builder: (ctx) => const SubjectiveMatchPage()));
            },
          )
        } else if (_tabletIdentity.tabletMode == TabletMode.scouting) ...{
          ListTile(
            leading: const Icon(CustomIcons.robot),
            title: const Text("Match Scouting"),
            onTap: () {
              onPageTap?.call();

              Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (ctx) => const MatchPage()));
            },
          ),
        },
        if (_tabletIdentity.tabletMode == TabletMode.leader ||
            _tabletIdentity.tabletMode == TabletMode.scouting) ...{
          ListTile(
            leading: const Icon(CustomIcons.clipboardList),
            title: const Text("Pit Scouting"),
            onTap: () {
              onPageTap?.call();
              Navigator.of(context)
                  .push(MaterialPageRoute(builder: (ctx) => PitPage()));
            },
          ),
        },
        if (_tabletIdentity.tabletMode == TabletMode.elims) ...{
          ListTile(
            leading: const Icon(CustomIcons.robot),
            title: const Text("Elims Scouting"),
            onTap: () {
              onPageTap?.call();

              Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (ctx) => const ElimPage()));
            },
          )
        },
        if (_tabletIdentity.tabletMode == TabletMode.leader ||
            _tabletIdentity.tabletMode == TabletMode.scouting ||
            _tabletIdentity.tabletMode == TabletMode.elims) ...{
          ListTile(
            leading: const Icon(Icons.qr_code_2_outlined),
            title: const Text("QR Codes"),
            onTap: () {
              onPageTap?.call();

              Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (ctx) => QRPage()));
            },
          ),
        },
        if (_tabletIdentity.tabletMode == TabletMode.scanner) ...{
          ListTile(
            leading: const Icon(CustomIcons.clipboardList),
            title: const Text("Scan"),
            onTap: () {
              onPageTap?.call();
              Navigator.of(context)
                  .push(MaterialPageRoute(builder: (ctx) => ScannerPage()));
            },
          ),
        },
        if (_tabletIdentity.tabletMode == TabletMode.scouting ||
            _tabletIdentity.tabletMode == TabletMode.leader ||
            _tabletIdentity.tabletMode == TabletMode.scanner) ...{
          ListTile(
            leading: const Icon(Icons.casino_outlined),
            title: const Text("Backdoor"),
            onTap: () {
              onPageTap?.call();
              if (matchStarted) {
                showSnackBar(
                    context, "It seems the backdoor is locked right now...");
              } else {
                Navigator.of(context)
                    .push(MaterialPageRoute(builder: (ctx) => CasinoPage()));
              }
            },
          )
        }
      ],
    );
  }
}
