import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers.dart';
import '../../data/datasources/wallet_remote_datasource.dart';
import '../../data/repositories/wallet_repository_impl.dart';
import '../../domain/repositories/wallet_repository.dart';
import '../../data/models/wallet_model.dart';

final walletRemoteDataSourceProvider = Provider<WalletRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return WalletRemoteDataSource(apiClient);
});

final walletRepositoryProvider = Provider<WalletRepository>((ref) {
  final remoteDataSource = ref.watch(walletRemoteDataSourceProvider);
  return WalletRepositoryImpl(remoteDataSource);
});

// Balance provider holding current limits
final walletBalanceProvider = FutureProvider<WalletBalanceModel>((ref) {
  final repository = ref.watch(walletRepositoryProvider);
  return repository.getBalance();
});

// Transactions list provider
final walletTransactionsProvider =
    FutureProvider.family<List<TransactionModel>, Map<String, int?>>(
        (ref, params) {
  final repository = ref.watch(walletRepositoryProvider);
  return repository.getTransactions(
      page: params['page'], limit: params['limit']);
});
