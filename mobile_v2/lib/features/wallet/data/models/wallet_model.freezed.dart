// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'wallet_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

WalletBalanceModel _$WalletBalanceModelFromJson(Map<String, dynamic> json) {
  return _WalletBalanceModel.fromJson(json);
}

/// @nodoc
mixin _$WalletBalanceModel {
  num get balance => throw _privateConstructorUsedError;
  @JsonKey(name: 'daily_expense')
  num get dailyExpense => throw _privateConstructorUsedError;
  @JsonKey(name: 'days_remaining')
  int get daysRemaining => throw _privateConstructorUsedError;

  /// Serializes this WalletBalanceModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of WalletBalanceModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $WalletBalanceModelCopyWith<WalletBalanceModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $WalletBalanceModelCopyWith<$Res> {
  factory $WalletBalanceModelCopyWith(
          WalletBalanceModel value, $Res Function(WalletBalanceModel) then) =
      _$WalletBalanceModelCopyWithImpl<$Res, WalletBalanceModel>;
  @useResult
  $Res call(
      {num balance,
      @JsonKey(name: 'daily_expense') num dailyExpense,
      @JsonKey(name: 'days_remaining') int daysRemaining});
}

/// @nodoc
class _$WalletBalanceModelCopyWithImpl<$Res, $Val extends WalletBalanceModel>
    implements $WalletBalanceModelCopyWith<$Res> {
  _$WalletBalanceModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of WalletBalanceModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? balance = null,
    Object? dailyExpense = null,
    Object? daysRemaining = null,
  }) {
    return _then(_value.copyWith(
      balance: null == balance
          ? _value.balance
          : balance // ignore: cast_nullable_to_non_nullable
              as num,
      dailyExpense: null == dailyExpense
          ? _value.dailyExpense
          : dailyExpense // ignore: cast_nullable_to_non_nullable
              as num,
      daysRemaining: null == daysRemaining
          ? _value.daysRemaining
          : daysRemaining // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$WalletBalanceModelImplCopyWith<$Res>
    implements $WalletBalanceModelCopyWith<$Res> {
  factory _$$WalletBalanceModelImplCopyWith(_$WalletBalanceModelImpl value,
          $Res Function(_$WalletBalanceModelImpl) then) =
      __$$WalletBalanceModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {num balance,
      @JsonKey(name: 'daily_expense') num dailyExpense,
      @JsonKey(name: 'days_remaining') int daysRemaining});
}

/// @nodoc
class __$$WalletBalanceModelImplCopyWithImpl<$Res>
    extends _$WalletBalanceModelCopyWithImpl<$Res, _$WalletBalanceModelImpl>
    implements _$$WalletBalanceModelImplCopyWith<$Res> {
  __$$WalletBalanceModelImplCopyWithImpl(_$WalletBalanceModelImpl _value,
      $Res Function(_$WalletBalanceModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of WalletBalanceModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? balance = null,
    Object? dailyExpense = null,
    Object? daysRemaining = null,
  }) {
    return _then(_$WalletBalanceModelImpl(
      balance: null == balance
          ? _value.balance
          : balance // ignore: cast_nullable_to_non_nullable
              as num,
      dailyExpense: null == dailyExpense
          ? _value.dailyExpense
          : dailyExpense // ignore: cast_nullable_to_non_nullable
              as num,
      daysRemaining: null == daysRemaining
          ? _value.daysRemaining
          : daysRemaining // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$WalletBalanceModelImpl implements _WalletBalanceModel {
  const _$WalletBalanceModelImpl(
      {required this.balance,
      @JsonKey(name: 'daily_expense') required this.dailyExpense,
      @JsonKey(name: 'days_remaining') required this.daysRemaining});

  factory _$WalletBalanceModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$WalletBalanceModelImplFromJson(json);

  @override
  final num balance;
  @override
  @JsonKey(name: 'daily_expense')
  final num dailyExpense;
  @override
  @JsonKey(name: 'days_remaining')
  final int daysRemaining;

  @override
  String toString() {
    return 'WalletBalanceModel(balance: $balance, dailyExpense: $dailyExpense, daysRemaining: $daysRemaining)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$WalletBalanceModelImpl &&
            (identical(other.balance, balance) || other.balance == balance) &&
            (identical(other.dailyExpense, dailyExpense) ||
                other.dailyExpense == dailyExpense) &&
            (identical(other.daysRemaining, daysRemaining) ||
                other.daysRemaining == daysRemaining));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, balance, dailyExpense, daysRemaining);

  /// Create a copy of WalletBalanceModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$WalletBalanceModelImplCopyWith<_$WalletBalanceModelImpl> get copyWith =>
      __$$WalletBalanceModelImplCopyWithImpl<_$WalletBalanceModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$WalletBalanceModelImplToJson(
      this,
    );
  }
}

abstract class _WalletBalanceModel implements WalletBalanceModel {
  const factory _WalletBalanceModel(
          {required final num balance,
          @JsonKey(name: 'daily_expense') required final num dailyExpense,
          @JsonKey(name: 'days_remaining') required final int daysRemaining}) =
      _$WalletBalanceModelImpl;

  factory _WalletBalanceModel.fromJson(Map<String, dynamic> json) =
      _$WalletBalanceModelImpl.fromJson;

  @override
  num get balance;
  @override
  @JsonKey(name: 'daily_expense')
  num get dailyExpense;
  @override
  @JsonKey(name: 'days_remaining')
  int get daysRemaining;

  /// Create a copy of WalletBalanceModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$WalletBalanceModelImplCopyWith<_$WalletBalanceModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TransactionModel _$TransactionModelFromJson(Map<String, dynamic> json) {
  return _TransactionModel.fromJson(json);
}

/// @nodoc
mixin _$TransactionModel {
  dynamic get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'user_id')
  dynamic get userId => throw _privateConstructorUsedError;
  String get type =>
      throw _privateConstructorUsedError; // 'topup', 'payment', 'bonus'
  num get amount => throw _privateConstructorUsedError;
  String get status => throw _privateConstructorUsedError;
  String? get description => throw _privateConstructorUsedError;
  String? get reference => throw _privateConstructorUsedError;
  @JsonKey(name: 'payment_method')
  String? get paymentMethod => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  String? get createdAt => throw _privateConstructorUsedError;

  /// Serializes this TransactionModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of TransactionModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $TransactionModelCopyWith<TransactionModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TransactionModelCopyWith<$Res> {
  factory $TransactionModelCopyWith(
          TransactionModel value, $Res Function(TransactionModel) then) =
      _$TransactionModelCopyWithImpl<$Res, TransactionModel>;
  @useResult
  $Res call(
      {dynamic id,
      @JsonKey(name: 'user_id') dynamic userId,
      String type,
      num amount,
      String status,
      String? description,
      String? reference,
      @JsonKey(name: 'payment_method') String? paymentMethod,
      @JsonKey(name: 'created_at') String? createdAt});
}

/// @nodoc
class _$TransactionModelCopyWithImpl<$Res, $Val extends TransactionModel>
    implements $TransactionModelCopyWith<$Res> {
  _$TransactionModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of TransactionModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? userId = freezed,
    Object? type = null,
    Object? amount = null,
    Object? status = null,
    Object? description = freezed,
    Object? reference = freezed,
    Object? paymentMethod = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      userId: freezed == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as num,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      reference: freezed == reference
          ? _value.reference
          : reference // ignore: cast_nullable_to_non_nullable
              as String?,
      paymentMethod: freezed == paymentMethod
          ? _value.paymentMethod
          : paymentMethod // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$TransactionModelImplCopyWith<$Res>
    implements $TransactionModelCopyWith<$Res> {
  factory _$$TransactionModelImplCopyWith(_$TransactionModelImpl value,
          $Res Function(_$TransactionModelImpl) then) =
      __$$TransactionModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {dynamic id,
      @JsonKey(name: 'user_id') dynamic userId,
      String type,
      num amount,
      String status,
      String? description,
      String? reference,
      @JsonKey(name: 'payment_method') String? paymentMethod,
      @JsonKey(name: 'created_at') String? createdAt});
}

/// @nodoc
class __$$TransactionModelImplCopyWithImpl<$Res>
    extends _$TransactionModelCopyWithImpl<$Res, _$TransactionModelImpl>
    implements _$$TransactionModelImplCopyWith<$Res> {
  __$$TransactionModelImplCopyWithImpl(_$TransactionModelImpl _value,
      $Res Function(_$TransactionModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of TransactionModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? userId = freezed,
    Object? type = null,
    Object? amount = null,
    Object? status = null,
    Object? description = freezed,
    Object? reference = freezed,
    Object? paymentMethod = freezed,
    Object? createdAt = freezed,
  }) {
    return _then(_$TransactionModelImpl(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      userId: freezed == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as num,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String?,
      reference: freezed == reference
          ? _value.reference
          : reference // ignore: cast_nullable_to_non_nullable
              as String?,
      paymentMethod: freezed == paymentMethod
          ? _value.paymentMethod
          : paymentMethod // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$TransactionModelImpl implements _TransactionModel {
  const _$TransactionModelImpl(
      {required this.id,
      @JsonKey(name: 'user_id') required this.userId,
      required this.type,
      required this.amount,
      required this.status,
      this.description,
      this.reference,
      @JsonKey(name: 'payment_method') this.paymentMethod,
      @JsonKey(name: 'created_at') this.createdAt});

  factory _$TransactionModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$TransactionModelImplFromJson(json);

  @override
  final dynamic id;
  @override
  @JsonKey(name: 'user_id')
  final dynamic userId;
  @override
  final String type;
// 'topup', 'payment', 'bonus'
  @override
  final num amount;
  @override
  final String status;
  @override
  final String? description;
  @override
  final String? reference;
  @override
  @JsonKey(name: 'payment_method')
  final String? paymentMethod;
  @override
  @JsonKey(name: 'created_at')
  final String? createdAt;

  @override
  String toString() {
    return 'TransactionModel(id: $id, userId: $userId, type: $type, amount: $amount, status: $status, description: $description, reference: $reference, paymentMethod: $paymentMethod, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TransactionModelImpl &&
            const DeepCollectionEquality().equals(other.id, id) &&
            const DeepCollectionEquality().equals(other.userId, userId) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.reference, reference) ||
                other.reference == reference) &&
            (identical(other.paymentMethod, paymentMethod) ||
                other.paymentMethod == paymentMethod) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      const DeepCollectionEquality().hash(id),
      const DeepCollectionEquality().hash(userId),
      type,
      amount,
      status,
      description,
      reference,
      paymentMethod,
      createdAt);

  /// Create a copy of TransactionModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$TransactionModelImplCopyWith<_$TransactionModelImpl> get copyWith =>
      __$$TransactionModelImplCopyWithImpl<_$TransactionModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TransactionModelImplToJson(
      this,
    );
  }
}

abstract class _TransactionModel implements TransactionModel {
  const factory _TransactionModel(
          {required final dynamic id,
          @JsonKey(name: 'user_id') required final dynamic userId,
          required final String type,
          required final num amount,
          required final String status,
          final String? description,
          final String? reference,
          @JsonKey(name: 'payment_method') final String? paymentMethod,
          @JsonKey(name: 'created_at') final String? createdAt}) =
      _$TransactionModelImpl;

  factory _TransactionModel.fromJson(Map<String, dynamic> json) =
      _$TransactionModelImpl.fromJson;

  @override
  dynamic get id;
  @override
  @JsonKey(name: 'user_id')
  dynamic get userId;
  @override
  String get type; // 'topup', 'payment', 'bonus'
  @override
  num get amount;
  @override
  String get status;
  @override
  String? get description;
  @override
  String? get reference;
  @override
  @JsonKey(name: 'payment_method')
  String? get paymentMethod;
  @override
  @JsonKey(name: 'created_at')
  String? get createdAt;

  /// Create a copy of TransactionModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$TransactionModelImplCopyWith<_$TransactionModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
