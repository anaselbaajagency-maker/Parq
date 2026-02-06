import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../api/api_client.dart';
import '../storage/secure_storage.dart';
import '../../features/auth/services/auth_service.dart';
import '../../features/listings/services/listing_service.dart';
import '../../features/wallet/services/wallet_service.dart';

// Core Providers
final secureStorageProvider = Provider((ref) => SecureStorage());

final dioProvider = Provider((ref) => Dio());

final apiClientProvider = Provider((ref) {
  final dio = ref.watch(dioProvider);
  final storage = ref.watch(secureStorageProvider);
  return ApiClient(dio: dio, storage: storage);
});

// Service Providers
final authServiceProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  final storage = ref.watch(secureStorageProvider);
  return AuthService(apiClient: apiClient, storage: storage);
});

final listingServiceProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ListingService(apiClient: apiClient);
});

final walletServiceProvider = Provider((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return WalletService(apiClient: apiClient);
});
