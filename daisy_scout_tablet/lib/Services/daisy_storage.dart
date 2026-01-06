import 'dart:io';
import 'package:cross_local_storage/cross_local_storage.dart';
import 'package:daisy_scout_tablet/Enums/data_folder.dart';
import 'package:daisy_scout_tablet/Enums/data_folder_extension.dart';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';

final class DaisyStorage {
  static Future<void> saveConfig(String key, String data) async {
    LocalStorageInterface prefs = await LocalStorage.getInstance();
    await prefs.setString(key, data);

    /*
    if (kIsWeb) {
      html.window.localStorage[key] = data;
    } else {
      var dir = await getExternalStorageDirectory();

      // prepend the key with the path if it is not null
      //var fileloc = ((path != null) ? "$path/" : "") + key;

      File f = File('${dir?.path}/$key');
      f.writeAsString(data);
    }
    */
  }

  static Future<String?> getConfig(String key) async {
    LocalStorageInterface prefs = await LocalStorage.getInstance();
    return prefs.getString(key);
    /*
    if (kIsWeb) {
      return html.window.localStorage[key];
    } else {
      Directory? dir = await getExternalStorageDirectory();

      // prepend the key with the path if it is not null
      //var fileloc = ((path != null) ? "$path/" : "") + key;

      File f = File('${dir?.path}/$key');
      if (await f.exists()) {
        return await f.readAsString();
      }

      return null;
    }
    */
  }

  static Future<void> ensureDataStorageLocationExists() async {
    if (kIsWeb) {
    } else {
      var dir = await getExternalStorageDirectory();
      var qrDir = Directory('${dir?.path}/${DataFolder.pit.folderName}');
      if (!await qrDir.exists()) {
        await qrDir.create();
      }

      qrDir = Directory('${dir?.path}/${DataFolder.match.folderName}');
      if (!await qrDir.exists()) {
        await qrDir.create();
      }

      qrDir = Directory('${dir?.path}/${DataFolder.leader.folderName}');
      if (!await qrDir.exists()) {
        await qrDir.create();
      }
    }
  }

  static Future<void> saveData(String key, String path, String data) async {
    if (kIsWeb) {
      //TODO: push direct to database via API call...
    } else {
      var dir = await getExternalStorageDirectory();

      File f = File('${dir?.path}/$path/$key');
      f.writeAsString(data);
    }
  }

  static Future<String?> getData(String key, String path) async {
    if (kIsWeb) {
      //TODO: pull direct from database via API call...
    } else {
      Directory? dir = await getExternalStorageDirectory();

      File f = File('${dir?.path}/$path/$key');
      if (await f.exists()) {
        return await f.readAsString();
      }
    }
    return null;
  }

  static Future<List<String>> getDataFiles(
      String path, String compSeason, String activeComp) async {
    List<String> files = [];
    if (kIsWeb) {
    } else {
      Directory? dir = await getExternalStorageDirectory();
      if (dir != null) {
        Directory dir2 = Directory('${dir.path}/$path');
        final List<FileSystemEntity> entities = await dir2.list().toList();
        var sorted = entities.whereType<File>().toList();
        // sort listing by full path (effectively the name) since .list() doesn't guarantee order
        sorted.sort((a, b) => a.path.compareTo(b.path));
        for (var f in sorted) {
          var fileName = f.path.replaceFirst("${dir2.path}/", "");
          // Only add files, not directories
          if (fileName.startsWith('$compSeason$activeComp')) {
            // Only add files from the current comp
            files.add(fileName);
          }
        }
      }
    }
    return files;
  }
}
