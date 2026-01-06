import 'package:daisy_scout_tablet/Pages/config_page.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:daisy_scout_tablet/Widgets/navigation_drawer_custom.dart';

class PasswordPage extends StatefulWidget {
  // const PasswordPage({super.key, required StatefulWidget desiredPage});
  TextEditingController fieldText = TextEditingController();
  static StatefulWidget page = ConfigPage();
  PasswordPage({super.key, required desiredPage}) {
    page = desiredPage;
  }

  @override
  State<PasswordPage> createState() => _PitPageState();
}

class _PitPageState extends State<PasswordPage> {
  final TextEditingController fieldText = TextEditingController();
  final GlobalKey<FormBuilderState> _key = GlobalKey<FormBuilderState>();
  // late final TabletIdentity _tabletIdentity =
  //     Provider.of<TabletIdentity>(context, listen: false);

  void clearText() {
    fieldText.clear();
  }

  @override
  Widget build(BuildContext context) {
    final controller = fieldText;
    return Scaffold(
        appBar: AppBar(centerTitle: true, title: const Text("Password")),
        drawer: NavigationDrawerCustom(),
        body: FormBuilder(
          key: _key,
          autovalidateMode: AutovalidateMode.disabled,
          child: Center(
            child: Column(
              children: [
                SizedBox(
                  width: 600,
                  height: 125,
                  child: TextFormField(
                    decoration: const InputDecoration(
                      labelText: 'Enter Password: ',
                    ),
                    inputFormatters: [FilteringTextInputFormatter.deny('')],
                    keyboardType: TextInputType.text,
                    controller: controller,
                    obscureText: true,
                  ),
                ),
                SizedBox(
                  width: 400,
                  height: 50,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blue,
                    ),
                    child: Text('Submit'),
                    onPressed: () {
                      if (controller.text == "justin") {
                        Navigator.of(context).pushReplacement(MaterialPageRoute(
                            builder: (ctx) => PasswordPage.page));
                      } else {
                        showDialog(
                          context: context,
                          builder: (BuildContext context) {
                            return AlertDialog(
                              title: const Text('Incorrect Password'),
                              content: const Text('Please try again.'),
                              actions: <Widget>[
                                TextButton(
                                  onPressed: () {
                                    clearText();
                                    Navigator.of(context).pop();
                                  },
                                  child: const Text('OK'),
                                ),
                              ],
                            );
                          },
                        );
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ));
  }
}
