import 'package:shared_preferences/shared_preferences.dart';

class LocalStorage {
  static const _themeKey = 'parq_theme_mode';
  static const _localeKey = 'parq_locale';
  static const _firstLaunchKey = 'parq_first_launch';

  final SharedPreferences _prefs;

  LocalStorage(this._prefs);

  Future<void> saveThemeMode(String mode) async {
    await _prefs.setString(_themeKey, mode);
  }

  String? getThemeMode() {
    return _prefs.getString(_themeKey);
  }

  Future<void> saveLocale(String locale) async {
    await _prefs.setString(_localeKey, locale);
  }

  String? getLocale() {
    return _prefs.getString(_localeKey);
  }

  Future<void> setHasLaunched() async {
    await _prefs.setBool(_firstLaunchKey, false);
  }

  bool getIsFirstLaunch() {
    return _prefs.getBool(_firstLaunchKey) ?? true;
  }
}
