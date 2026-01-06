import 'package:daisy_scout_tablet/Constants/daisy_constants.dart';
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Utilities/field_info.dart';
import 'package:daisy_scout_tablet/FormObjects/text_field_obj.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';
import 'package:daisy_scout_tablet/Widgets/qr_code.dart';
import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:flutter/services.dart';

class QRCarouselItem extends StatefulWidget {
  final Map<String, dynamic> formData;
  final DataFolder dataFolder;
  final GlobalKey<FormBuilderState> stateKey;
  final TabletIdentity tabletIdentity;

  late final List<String> _fields;
  QRCarouselItem(
      {super.key,
      required this.formData,
      required this.stateKey,
      required this.dataFolder,
      required this.tabletIdentity}) {
    if (dataFolder == DataFolder.leader || dataFolder == DataFolder.elims) {
      _fields = ["MatchNumber", "ScoutName", "Team1", "Team2", "Team3"];
    } else if (dataFolder == DataFolder.match) {
      _fields = ["MatchNumber", "ScoutName", "TeamNumber"];
    } else {
      _fields = ["TeamNumber", "ScoutName"];
    }
  }

  @override
  State<StatefulWidget> createState() => _QRCarouselItem();
}

class _QRCarouselItem extends State<QRCarouselItem> {
  final List cols = [];

  @override
  void initState() {
    super.initState();
    for (String element in widget._fields) {
      cols.add({'title': element, 'key': element});
    }
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> res = [];
    int i = 0;

    for (String key in widget._fields) {
      res.add(Container(
          padding: const EdgeInsets.all(8.0),
          color: Colors.grey[500 + (i * 100) % 500]!,
          child: TextFieldObj(
            key,
            key,
            FieldInfo(
                formatters: [FilteringTextInputFormatter.deny('')],
                inputType: TextInputType.text,
                enabled: false),
            initalValue: widget.formData[key],
            fontSize: 8.5,
          )));
      ++i;
    }
    return Column(
      children: <Widget>[
        Expanded(
            flex: 10,
            child: Row(
              children: [
                QRCode(
                  formData: widget.formData,
                  context: context,
                  dataFolder: widget.dataFolder,
                  tabletIdentity: widget.tabletIdentity,
                ),
                const Spacer(flex: 1),
              ],
            )),
        const Spacer(flex: 1),
        Expanded(
            flex: 10,
            child: FormBuilder(
                key: widget.stateKey,
                child: GridView.builder(
                  clipBehavior: Clip.hardEdge,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                    crossAxisSpacing: 5,
                    mainAxisSpacing: 10,
                  ),
                  primary: false,
                  padding: const EdgeInsets.symmetric(
                      horizontal: DaisyConstants.horizPadding),
                  itemBuilder: (context, idx) {
                    return res[idx];
                  },
                  itemCount: res.length,
                ))),
      ],
    );
  }
}
