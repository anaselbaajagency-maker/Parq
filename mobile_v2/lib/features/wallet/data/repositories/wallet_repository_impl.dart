import '../datasources/wallet_remote_datasource.dart';
import '../../domain/repositories/wallet_repository.dart';
import '../models/wallet_model.dart';

class WalletRepositoryImpl implements WalletRepository {
  final WalletRemoteDataSource _remoteDataSource;

  WalletRepositoryImpl(this._remoteDataSource);

  @override
  Future<WalletBalanceModel> getBalance() {
    return _remoteDataSource.getBalance();
  }

  @override
  Future<List<TransactionModel>> getTransactions({int? page, int? limit}) {
    return _remoteDataSource.getTransactions(page: page, limit: limit);
  }

  @override
  Future<Map<String, dynamic>> initiateTopup(num amount, String paymentMethod) {
    return _remoteDataSource.initiateTopup(amount, paymentMethod);
  }

  @override
  Future<void> uploadProof(dynamic requestId, String proofPath) {
    return _remoteDataSource.uploadProof(requestId, proofPath);
  }

  @override
  Future<void> redeemCoupon(String code) {
    return _remoteDataSource.redeemCoupon(code);
  }
}
