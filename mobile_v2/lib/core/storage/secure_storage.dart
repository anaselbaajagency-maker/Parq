import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorage {
  static const _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  static const _tokenKey = 'parq_auth_token';
  static const _roleKey = 'parq_user_role';

  Future<void> saveToken(String token) async {
    await _storage.write(key: _tokenKey, value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: _tokenKey);
  }

  Future<void> deleteToken() async {
    await _storage.delete(key: _tokenKey);
  }

  Future<void> saveUserRole(String role) async {
    await _storage.write(key: _roleKey, value: role);
  }

  Future<String?> getUserRole() async {
    return await _storage.read(key: _roleKey);
  }

  Future<void> deleteAll() async {
    await _storage.deleteAll();
  }
}
