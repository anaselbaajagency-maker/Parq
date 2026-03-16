import 'package:dio/dio.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;
  final dynamic data;

  ApiException({required this.message, this.statusCode, this.data});

  factory ApiException.fromDioError(DioException dioError) {
    String message = "Une erreur s'est produite";
    int? code = dioError.response?.statusCode;
    dynamic responseData = dioError.response?.data;

    if (dioError.type == DioExceptionType.connectionTimeout ||
        dioError.type == DioExceptionType.receiveTimeout ||
        dioError.type == DioExceptionType.sendTimeout) {
      message = "Délai d'attente dépassé";
    } else if (dioError.type == DioExceptionType.connectionError) {
      message = "Erreur de connexion internet";
    } else if (dioError.response != null) {
      // Backend Laravel Error Mapping
      if (responseData is Map<String, dynamic> &&
          responseData.containsKey('message')) {
        message = responseData['message'];
      } else {
        switch (code) {
          case 400:
            message = "Requête invalide";
            break;
          case 401:
            message = "Session expirée, veuillez vous reconnecter";
            break;
          case 403:
            message = "Accès non autorisé";
            break;
          case 404:
            message = "Ressource introuvable";
            break;
          case 422:
            message = "Données invalides";
            if (responseData is Map && responseData['errors'] != null) {
              final Map<String, dynamic> errors = responseData['errors'];
              if (errors.isNotEmpty) {
                message = errors.values.first[0]; // First validation error
              }
            }
            break;
          case 500:
          default:
            message = "Erreur serveur interne";
            break;
        }
      }
    }

    return ApiException(
      message: message,
      statusCode: code,
      data: responseData,
    );
  }

  @override
  String toString() => message;
}
