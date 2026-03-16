import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/storage/secure_storage.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_remote_datasource.dart';
import '../models/user_model.dart';
import '../models/auth_response_model.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource _remoteDataSource;
  final SecureStorage _secureStorage;
  final SharedPreferences _prefs;

  // Stream controller to mimic Zustand reactivity for user state
  final _authStateController = StreamController<UserModel?>.broadcast();
  UserModel? _cachedUser;

  static const String _userCacheKey = 'parq_cached_user';

  AuthRepositoryImpl(this._remoteDataSource, this._secureStorage, this._prefs) {
    _loadInitialAuth();
  }

  Future<void> _loadInitialAuth() async {
    final cachedData = _prefs.getString(_userCacheKey);
    final token = await _secureStorage.getToken();

    if (cachedData != null && token != null) {
      _cachedUser = UserModel.fromJson(jsonDecode(cachedData));
      _authStateController.add(_cachedUser);
      // Optional: Verify token with server silently here if needed
    } else {
      _authStateController.add(null);
    }
  }

  Future<void> _persistAuth(AuthResponseModel response) async {
    await _secureStorage.saveToken(response.token);
    await _secureStorage.saveUserRole(response.user.role ?? 'CLIENT');
    await _prefs.setString(_userCacheKey, jsonEncode(response.user.toJson()));
    _cachedUser = response.user;
    _authStateController.add(_cachedUser);
  }

  @override
  Stream<UserModel?> get authStateChanges => _authStateController.stream;

  @override
  Future<UserModel?> getCachedUser() async => _cachedUser;

  @override
  Future<bool> checkAuthStatus() async {
    return (await _secureStorage.getToken()) != null;
  }

  @override
  Future<UserModel> login(String email, String password) async {
    final response = await _remoteDataSource.login(email, password);
    await _persistAuth(response);
    return response.user;
  }

  @override
  Future<UserModel> register({
    required String fullName,
    required String email,
    required String password,
    required String role,
  }) async {
    final response = await _remoteDataSource.register({
      'full_name': fullName,
      'email': email,
      'password': password,
      'role': role,
    });
    await _persistAuth(response);
    return response.user;
  }

  @override
  Future<UserModel> googleLogin({
    required String email,
    required String googleId,
    required String fullName,
    required String avatar,
  }) async {
    final response =
        await _remoteDataSource.googleLogin(email, googleId, fullName, avatar);
    await _persistAuth(response);
    return response.user;
  }

  @override
  Future<void> logout() async {
    try {
      if (await checkAuthStatus()) {
        await _remoteDataSource.logout();
      }
    } catch (_) {
      // Proceed with local logout even if server fails
    } finally {
      await _secureStorage.deleteToken();
      await _secureStorage.saveUserRole('');
      await _prefs.remove(_userCacheKey);
      _cachedUser = null;
      _authStateController.add(null);
    }
  }
}
