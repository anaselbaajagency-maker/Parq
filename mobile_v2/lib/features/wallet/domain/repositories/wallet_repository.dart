import '../../data/models/wallet_model.dart';

abstract class WalletRepository {
  Future<WalletBalanceModel> getBalance();
  Future<List<TransactionModel>> getTransactions({int? page, int? limit});
  Future<Map<String, dynamic>> initiateTopup(num amount, String paymentMethod);
  Future<void> uploadProof(dynamic requestId, String proofPath);
  Future<void> redeemCoupon(String code);
}
