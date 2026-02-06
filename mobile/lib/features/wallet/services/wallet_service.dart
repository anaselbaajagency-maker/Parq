import '../models/wallet_models.dart';
import '../../../core/api/api_client.dart';
import 'dart:io';
import 'package:dio/dio.dart';

class WalletService {
  final ApiClient apiClient;

  WalletService({required this.apiClient});

  Future<Wallet> getBalance() async {
    final response = await apiClient.get('/wallet/balance');
    return Wallet.fromJson(response.data['data']);
  }

  Future<List<Transaction>> getTransactions({int limit = 20, int offset = 0}) async {
    final response = await apiClient.get('/wallet/transactions', queryParameters: {
      'limit': limit,
      'offset': offset,
    });
    final List data = response.data['data'];
    return data.map((json) => Transaction.fromJson(json)).toList();
  }

  Future<Map<String, dynamic>> initiateTopup(int amount, String method, File? proofImage) async {
    FormData formData = FormData.fromMap({
      'amount': amount,
      'method': method,
      if (proofImage != null)
        'proof_image': await MultipartFile.fromFile(proofImage.path),
    });

    final response = await apiClient.post('/wallet/topup', data: formData);
    return response.data;
  }
}
