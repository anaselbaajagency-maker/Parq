import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'api_endpoints.dart';
import '../storage/secure_storage.dart';
import 'api_exceptions.dart';

class ApiClient {
  final Dio _dio;
  final SecureStorage _storage;

  ApiClient({required SecureStorage storage})
      : _storage = storage,
        _dio = Dio(BaseOptions(
          baseUrl: ApiEndpoints.baseUrl,
          connectTimeout: const Duration(seconds: 15),
          receiveTimeout: const Duration(seconds: 15),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        )) {
    _setupInterceptors();
  }

  Dio get dio => _dio;

  void _setupInterceptors() {
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.getToken();
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }

        // Match Next.js X-Request-ID behavior
        options.headers['X-Request-ID'] =
            DateTime.now().millisecondsSinceEpoch.toString();

        if (kDebugMode) {
          debugPrint('[${options.method}] ${options.uri}');
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        return handler.next(response);
      },
      onError: (DioException e, handler) {
        if (kDebugMode) {
          debugPrint(
              '[API Error] ${e.requestOptions.uri} : ${e.response?.statusCode} - ${e.message}');
        }

        // Convert to custom exceptions
        final apiException = ApiException.fromDioError(e);
        return handler.next(DioException(
          requestOptions: e.requestOptions,
          response: e.response,
          type: e.type,
          error: apiException,
        ));
      },
    ));
  }

  Future<Response> get(String path,
      {Map<String, dynamic>? queryParameters}) async {
    return await _dio.get(path, queryParameters: queryParameters);
  }

  Future<Response> post(String path,
      {dynamic data, Map<String, dynamic>? queryParameters}) async {
    return await _dio.post(path, data: data, queryParameters: queryParameters);
  }

  Future<Response> put(String path, {dynamic data}) async {
    return await _dio.put(path, data: data);
  }

  Future<Response> delete(String path, {dynamic data}) async {
    return await _dio.delete(path, data: data);
  }
}
