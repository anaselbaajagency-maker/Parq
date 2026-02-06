import 'package:dio/dio.dart';
import '../storage/secure_storage.dart';

class ApiClient {
  final Dio dio;
  final SecureStorage storage;

  ApiClient({required this.dio, required this.storage}) {
    dio.options.baseUrl = 'http://localhost:8000/api'; // Replace with actual backend URL
    dio.options.connectTimeout = const Duration(seconds: 10);
    dio.options.receiveTimeout = const Duration(seconds: 10);

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await storage.getToken();
          if (token != null) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          options.headers['Accept'] = 'application/json';
          return handler.next(options);
        },
        onError: (DioException e, handler) {
          if (e.response?.statusCode == 401) {
            // Handle unauthorized (e.g., token expired)
            storage.deleteToken();
          }
          return handler.next(e);
        },
      ),
    );
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) async {
    return dio.get(path, queryParameters: queryParameters);
  }

  Future<Response> post(String path, {dynamic data}) async {
    return dio.post(path, data: data);
  }

  Future<Response> delete(String path) async {
    return dio.delete(path);
  }
}
