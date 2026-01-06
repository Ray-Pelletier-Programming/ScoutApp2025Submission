import 'dart:convert'; // For jsonEncode
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/data_folder_extension.dart';
import 'package:daisy_scout_tablet/Services/daisy_storage.dart';
import 'package:daisy_scout_tablet/Utilities/data_file.dart';
import 'package:daisy_scout_tablet/Utilities/tablet_identity.dart';

class ScoutDataService {
  List<String>? _files;
  late TabletIdentity _tabletIdentity;
  late DataFolder _folder;

  ScoutDataService(TabletIdentity tabletIdentity, DataFolder folder) {
    _tabletIdentity = tabletIdentity;
    _folder = folder;
  }

  Future<int> getFileCount() async {
    await _getFiles();
    return _files!.length;
  }

  Future<List<String>> _getFiles() async {
    _files ??= await DaisyStorage.getDataFiles(_folder.folderName,
        _tabletIdentity.compSeason.toString(), _tabletIdentity.activeComp);
    return _files!;
  }

  Future<void> saveScoutData(Map<String, dynamic> scoutingData) async {
    int count = await getFileCount();
    String filename = DataFile(_tabletIdentity, _tabletIdentity.activeComp,
            _folder.fileType, count)
        .fileName;
    await DaisyStorage.saveData(
        filename, _folder.folderName, jsonEncode(scoutingData));
    _files!.add(filename);
  }

  Future<Map<String, dynamic>> getScoutData(String fileName) async {
    String? data = await DaisyStorage.getData(fileName, _folder.folderName);
    return jsonDecode(data ?? "");
  }

  String getFileName(int index) {
    return _files![index];
  }
}
