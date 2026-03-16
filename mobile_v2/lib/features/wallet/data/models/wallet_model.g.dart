// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'wallet_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$WalletBalanceModelImpl _$$WalletBalanceModelImplFromJson(
        Map<String, dynamic> json) =>
    _$WalletBalanceModelImpl(
      balance: json['balance'] as num,
      dailyExpense: json['daily_expense'] as num,
      daysRemaining: (json['days_remaining'] as num).toInt(),
    );

Map<String, dynamic> _$$WalletBalanceModelImplToJson(
        _$WalletBalanceModelImpl instance) =>
    <String, dynamic>{
      'balance': instance.balance,
      'daily_expense': instance.dailyExpense,
      'days_remaining': instance.daysRemaining,
    };

_$TransactionModelImpl _$$TransactionModelImplFromJson(
        Map<String, dynamic> json) =>
    _$TransactionModelImpl(
      id: json['id'],
      userId: json['user_id'],
      type: json['type'] as String,
      amount: json['amount'] as num,
      status: json['status'] as String,
      description: json['description'] as String?,
      reference: json['reference'] as String?,
      paymentMethod: json['payment_method'] as String?,
      createdAt: json['created_at'] as String?,
    );

Map<String, dynamic> _$$TransactionModelImplToJson(
        _$TransactionModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'user_id': instance.userId,
      'type': instance.type,
      'amount': instance.amount,
      'status': instance.status,
      'description': instance.description,
      'reference': instance.reference,
      'payment_method': instance.paymentMethod,
      'created_at': instance.createdAt,
    };
