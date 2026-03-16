import '../../../../core/network/api_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../models/wallet_model.dart';
import 'package:dio/dio.dart';

class WalletRemoteDataSource {
  final ApiClient _apiClient;

  WalletRemoteDataSource(this._apiClient);

  Future<WalletBalanceModel> getBalance() async {
    final response = await _apiClient.get(ApiEndpoints.walletBalance);
    return WalletBalanceModel.fromJson(response.data);
  }

  Future<List<TransactionModel>> getTransactions(
      {int? page, int? limit}) async {
    final params = <String, dynamic>{};
    if (page != null) params['page'] = page;
    if (limit != null) params['limit'] = limit;

    final response = await _apiClient.get(ApiEndpoints.walletTransactions,
        queryParameters: params);
    final List<dynamic> data = response.data['data'] ?? [];
    return data.map((json) => TransactionModel.fromJson(json)).toList();
  }

  Future<Map<String, dynamic>> initiateTopup(
      num amount, String paymentMethod) async {
    final response = await _apiClient.post(
      ApiEndpoints.walletTopup,
      data: {
        'amount': amount,
        'payment_method': paymentMethod,
      },
    );
    return response.data; // Contains redirect URL or reference details
  }

  Future<void> uploadProof(dynamic requestId, String proofPath) async {
    final formData = FormData.fromMap({
      'proof': await MultipartFile.fromFile(proofPath),
    });
    // Assuming backend takes PUT or POST for proof, generic api handles it
    await _apiClient.post(ApiEndpoints.uploadProof(requestId), data: formData);
  }

  Future<void> redeemCoupon(String code) async {
    await _apiClient.post(
      ApiEndpoints.walletRedeemCoupon,
      data: {'code': code},
    );
  }
}
