import '../../../../core/network/api_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../models/auth_response_model.dart';
import '../models/user_model.dart';

class AuthRemoteDataSource {
  final ApiClient _apiClient;

  AuthRemoteDataSource(this._apiClient);

  Future<AuthResponseModel> login(String email, String password) async {
    final response = await _apiClient.post(
      ApiEndpoints.login,
      data: {
        'email': email,
        'password': password,
        'client_type': 'mobile',
      },
    );
    return AuthResponseModel.fromJson(response.data);
  }

  Future<AuthResponseModel> register(Map<String, dynamic> data) async {
    data['client_type'] = 'mobile';
    final response = await _apiClient.post(ApiEndpoints.register, data: data);
    return AuthResponseModel.fromJson(response.data);
  }

  Future<AuthResponseModel> googleLogin(
      String email, String googleId, String fullName, String avatar) async {
    final response = await _apiClient.post(
      ApiEndpoints.googleLogin,
      data: {
        'email': email,
        'google_id': googleId,
        'full_name': fullName,
        'avatar': avatar,
      },
    );
    return AuthResponseModel.fromJson(response.data);
  }

  Future<void> logout() async {
    await _apiClient.post(ApiEndpoints.logout);
  }

  Future<UserModel> getProfile() async {
    final response = await _apiClient.get(ApiEndpoints.profile);
    return UserModel.fromJson(response.data);
  }
}
