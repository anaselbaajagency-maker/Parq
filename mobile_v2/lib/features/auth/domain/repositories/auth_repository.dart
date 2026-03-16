import '../../data/models/user_model.dart';

abstract class AuthRepository {
  Future<UserModel> login(String email, String password);
  Future<UserModel> register({
    required String fullName,
    required String email,
    required String password,
    required String role,
  });
  Future<UserModel> googleLogin({
    required String email,
    required String googleId,
    required String fullName,
    required String avatar,
  });
  Future<void> logout();
  Future<bool> checkAuthStatus();
  Future<UserModel?> getCachedUser();
  Stream<UserModel?> get authStateChanges;
}
