import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class EnlargedQRCode extends StatelessWidget {
  final QrImageView q;
  const EnlargedQRCode(this.q, {super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GestureDetector(
        child: Center(
            child: Hero(
                tag: 'imageHero',
                child: SizedBox.expand(
                    child: Container(
                        padding: const EdgeInsets.all(20.0),
                        color: Color.fromARGB(255, 255, 255, 255),
                        child: FittedBox(
                            fit: BoxFit.contain,
                            alignment: Alignment.center,
                            child: SizedBox(
                              width: 600,
                              height: 600,
                              child: q,
                            )))))),
        onTap: () {
          Navigator.pop(context);
        },
      ),
    );
  }
}
