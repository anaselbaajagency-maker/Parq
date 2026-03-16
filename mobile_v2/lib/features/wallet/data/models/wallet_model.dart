import 'package:freezed_annotation/freezed_annotation.dart';

part 'wallet_model.freezed.dart';
part 'wallet_model.g.dart';

@freezed
class WalletBalanceModel with _$WalletBalanceModel {
  const factory WalletBalanceModel({
    required num balance,
    @JsonKey(name: 'daily_expense') required num dailyExpense,
    @JsonKey(name: 'days_remaining') required int daysRemaining,
  }) = _WalletBalanceModel;

  factory WalletBalanceModel.fromJson(Map<String, dynamic> json) =>
      _$WalletBalanceModelFromJson(json);
}

@freezed
class TransactionModel with _$TransactionModel {
  const factory TransactionModel({
    required dynamic id,
    @JsonKey(name: 'user_id') required dynamic userId,
    required String type, // 'topup', 'payment', 'bonus'
    required num amount,
    required String status,
    String? description,
    String? reference,
    @JsonKey(name: 'payment_method') String? paymentMethod,
    @JsonKey(name: 'created_at') String? createdAt,
  }) = _TransactionModel;

  factory TransactionModel.fromJson(Map<String, dynamic> json) =>
      _$TransactionModelFromJson(json);
}
