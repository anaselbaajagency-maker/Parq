import 'package:dio/dio.dart';
import '../../../core/api/api_client.dart';
import '../../../core/storage/secure_storage.dart';

class AuthService {
  final ApiClient apiClient;
  final SecureStorage storage;

  AuthService({required this.apiClient, required this.storage});

  Future<bool> sendOtp(String phone) async {
    try {
      final response = await apiClient.post('/auth/otp/send', data: {'phone': phone});
      return response.data['success'] == true;
    } catch (e) {
      return false;
    }
  }

  Future<Map<String, dynamic>?> verifyOtp(String phone, String code) async {
    try {
      final response = await apiClient.post('/auth/otp/verify', data: {
        'phone': phone,
        'code': code,
      });

      if (response.data['success'] == true) {
        final token = response.data['token'];
        await storage.saveToken(token);
        return response.data['user'];
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  Future<void> logout() async {
    try {
      await apiClient.post('/logout');
    } finally {
      await storage.deleteToken();
    }
  }

  Future<bool> isLoggedIn() async {
    final token = await storage.getToken();
    return token != null;
  }
}
