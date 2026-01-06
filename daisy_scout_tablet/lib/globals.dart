// Match Schedule for active event (if available)
List<dynamic> matchScheduleJson = [];

Map<String, dynamic> casinoCache = {};

// part of casino page to prevent entries during match
bool matchStarted = false;

// was for QR page to disable editing of data due to bug that corrupts the data.
const editingEnabled = false;
