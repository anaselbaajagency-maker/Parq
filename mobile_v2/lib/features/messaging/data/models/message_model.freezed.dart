// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'message_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

MessageModel _$MessageModelFromJson(Map<String, dynamic> json) {
  return _MessageModel.fromJson(json);
}

/// @nodoc
mixin _$MessageModel {
  dynamic get id => throw _privateConstructorUsedError;
  @JsonKey(name: 'sender_id')
  dynamic get senderId => throw _privateConstructorUsedError;
  @JsonKey(name: 'receiver_id')
  dynamic get receiverId => throw _privateConstructorUsedError;
  @JsonKey(name: 'listing_id')
  dynamic get listingId => throw _privateConstructorUsedError;
  String get content => throw _privateConstructorUsedError;
  @JsonKey(name: 'read_at')
  String? get readAt => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  String? get createdAt => throw _privateConstructorUsedError;
  UserModel? get sender => throw _privateConstructorUsedError;
  UserModel? get receiver => throw _privateConstructorUsedError;

  /// Serializes this MessageModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $MessageModelCopyWith<MessageModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $MessageModelCopyWith<$Res> {
  factory $MessageModelCopyWith(
          MessageModel value, $Res Function(MessageModel) then) =
      _$MessageModelCopyWithImpl<$Res, MessageModel>;
  @useResult
  $Res call(
      {dynamic id,
      @JsonKey(name: 'sender_id') dynamic senderId,
      @JsonKey(name: 'receiver_id') dynamic receiverId,
      @JsonKey(name: 'listing_id') dynamic listingId,
      String content,
      @JsonKey(name: 'read_at') String? readAt,
      @JsonKey(name: 'created_at') String? createdAt,
      UserModel? sender,
      UserModel? receiver});

  $UserModelCopyWith<$Res>? get sender;
  $UserModelCopyWith<$Res>? get receiver;
}

/// @nodoc
class _$MessageModelCopyWithImpl<$Res, $Val extends MessageModel>
    implements $MessageModelCopyWith<$Res> {
  _$MessageModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? senderId = freezed,
    Object? receiverId = freezed,
    Object? listingId = freezed,
    Object? content = null,
    Object? readAt = freezed,
    Object? createdAt = freezed,
    Object? sender = freezed,
    Object? receiver = freezed,
  }) {
    return _then(_value.copyWith(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      senderId: freezed == senderId
          ? _value.senderId
          : senderId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      receiverId: freezed == receiverId
          ? _value.receiverId
          : receiverId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      listingId: freezed == listingId
          ? _value.listingId
          : listingId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      readAt: freezed == readAt
          ? _value.readAt
          : readAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
      sender: freezed == sender
          ? _value.sender
          : sender // ignore: cast_nullable_to_non_nullable
              as UserModel?,
      receiver: freezed == receiver
          ? _value.receiver
          : receiver // ignore: cast_nullable_to_non_nullable
              as UserModel?,
    ) as $Val);
  }

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $UserModelCopyWith<$Res>? get sender {
    if (_value.sender == null) {
      return null;
    }

    return $UserModelCopyWith<$Res>(_value.sender!, (value) {
      return _then(_value.copyWith(sender: value) as $Val);
    });
  }

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $UserModelCopyWith<$Res>? get receiver {
    if (_value.receiver == null) {
      return null;
    }

    return $UserModelCopyWith<$Res>(_value.receiver!, (value) {
      return _then(_value.copyWith(receiver: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$MessageModelImplCopyWith<$Res>
    implements $MessageModelCopyWith<$Res> {
  factory _$$MessageModelImplCopyWith(
          _$MessageModelImpl value, $Res Function(_$MessageModelImpl) then) =
      __$$MessageModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {dynamic id,
      @JsonKey(name: 'sender_id') dynamic senderId,
      @JsonKey(name: 'receiver_id') dynamic receiverId,
      @JsonKey(name: 'listing_id') dynamic listingId,
      String content,
      @JsonKey(name: 'read_at') String? readAt,
      @JsonKey(name: 'created_at') String? createdAt,
      UserModel? sender,
      UserModel? receiver});

  @override
  $UserModelCopyWith<$Res>? get sender;
  @override
  $UserModelCopyWith<$Res>? get receiver;
}

/// @nodoc
class __$$MessageModelImplCopyWithImpl<$Res>
    extends _$MessageModelCopyWithImpl<$Res, _$MessageModelImpl>
    implements _$$MessageModelImplCopyWith<$Res> {
  __$$MessageModelImplCopyWithImpl(
      _$MessageModelImpl _value, $Res Function(_$MessageModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? senderId = freezed,
    Object? receiverId = freezed,
    Object? listingId = freezed,
    Object? content = null,
    Object? readAt = freezed,
    Object? createdAt = freezed,
    Object? sender = freezed,
    Object? receiver = freezed,
  }) {
    return _then(_$MessageModelImpl(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      senderId: freezed == senderId
          ? _value.senderId
          : senderId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      receiverId: freezed == receiverId
          ? _value.receiverId
          : receiverId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      listingId: freezed == listingId
          ? _value.listingId
          : listingId // ignore: cast_nullable_to_non_nullable
              as dynamic,
      content: null == content
          ? _value.content
          : content // ignore: cast_nullable_to_non_nullable
              as String,
      readAt: freezed == readAt
          ? _value.readAt
          : readAt // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
      sender: freezed == sender
          ? _value.sender
          : sender // ignore: cast_nullable_to_non_nullable
              as UserModel?,
      receiver: freezed == receiver
          ? _value.receiver
          : receiver // ignore: cast_nullable_to_non_nullable
              as UserModel?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$MessageModelImpl implements _MessageModel {
  const _$MessageModelImpl(
      {required this.id,
      @JsonKey(name: 'sender_id') required this.senderId,
      @JsonKey(name: 'receiver_id') required this.receiverId,
      @JsonKey(name: 'listing_id') this.listingId,
      required this.content,
      @JsonKey(name: 'read_at') this.readAt,
      @JsonKey(name: 'created_at') this.createdAt,
      this.sender,
      this.receiver});

  factory _$MessageModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$MessageModelImplFromJson(json);

  @override
  final dynamic id;
  @override
  @JsonKey(name: 'sender_id')
  final dynamic senderId;
  @override
  @JsonKey(name: 'receiver_id')
  final dynamic receiverId;
  @override
  @JsonKey(name: 'listing_id')
  final dynamic listingId;
  @override
  final String content;
  @override
  @JsonKey(name: 'read_at')
  final String? readAt;
  @override
  @JsonKey(name: 'created_at')
  final String? createdAt;
  @override
  final UserModel? sender;
  @override
  final UserModel? receiver;

  @override
  String toString() {
    return 'MessageModel(id: $id, senderId: $senderId, receiverId: $receiverId, listingId: $listingId, content: $content, readAt: $readAt, createdAt: $createdAt, sender: $sender, receiver: $receiver)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$MessageModelImpl &&
            const DeepCollectionEquality().equals(other.id, id) &&
            const DeepCollectionEquality().equals(other.senderId, senderId) &&
            const DeepCollectionEquality()
                .equals(other.receiverId, receiverId) &&
            const DeepCollectionEquality().equals(other.listingId, listingId) &&
            (identical(other.content, content) || other.content == content) &&
            (identical(other.readAt, readAt) || other.readAt == readAt) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.sender, sender) || other.sender == sender) &&
            (identical(other.receiver, receiver) ||
                other.receiver == receiver));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      const DeepCollectionEquality().hash(id),
      const DeepCollectionEquality().hash(senderId),
      const DeepCollectionEquality().hash(receiverId),
      const DeepCollectionEquality().hash(listingId),
      content,
      readAt,
      createdAt,
      sender,
      receiver);

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$MessageModelImplCopyWith<_$MessageModelImpl> get copyWith =>
      __$$MessageModelImplCopyWithImpl<_$MessageModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$MessageModelImplToJson(
      this,
    );
  }
}

abstract class _MessageModel implements MessageModel {
  const factory _MessageModel(
      {required final dynamic id,
      @JsonKey(name: 'sender_id') required final dynamic senderId,
      @JsonKey(name: 'receiver_id') required final dynamic receiverId,
      @JsonKey(name: 'listing_id') final dynamic listingId,
      required final String content,
      @JsonKey(name: 'read_at') final String? readAt,
      @JsonKey(name: 'created_at') final String? createdAt,
      final UserModel? sender,
      final UserModel? receiver}) = _$MessageModelImpl;

  factory _MessageModel.fromJson(Map<String, dynamic> json) =
      _$MessageModelImpl.fromJson;

  @override
  dynamic get id;
  @override
  @JsonKey(name: 'sender_id')
  dynamic get senderId;
  @override
  @JsonKey(name: 'receiver_id')
  dynamic get receiverId;
  @override
  @JsonKey(name: 'listing_id')
  dynamic get listingId;
  @override
  String get content;
  @override
  @JsonKey(name: 'read_at')
  String? get readAt;
  @override
  @JsonKey(name: 'created_at')
  String? get createdAt;
  @override
  UserModel? get sender;
  @override
  UserModel? get receiver;

  /// Create a copy of MessageModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$MessageModelImplCopyWith<_$MessageModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ConversationModel _$ConversationModelFromJson(Map<String, dynamic> json) {
  return _ConversationModel.fromJson(json);
}

/// @nodoc
mixin _$ConversationModel {
  UserModel get otherUser => throw _privateConstructorUsedError;
  MessageModel get lastMessage => throw _privateConstructorUsedError;
  int get unreadCount => throw _privateConstructorUsedError;

  /// Serializes this ConversationModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ConversationModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ConversationModelCopyWith<ConversationModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ConversationModelCopyWith<$Res> {
  factory $ConversationModelCopyWith(
          ConversationModel value, $Res Function(ConversationModel) then) =
      _$ConversationModelCopyWithImpl<$Res, ConversationModel>;
  @useResult
  $Res call({UserModel otherUser, MessageModel lastMessage, int unreadCount});

  $UserModelCopyWith<$Res> get otherUser;
  $MessageModelCopyWith<$Res> get lastMessage;
}

/// @nodoc
class _$ConversationModelCopyWithImpl<$Res, $Val extends ConversationModel>
    implements $ConversationModelCopyWith<$Res> {
  _$ConversationModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ConversationModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? otherUser = null,
    Object? lastMessage = null,
    Object? unreadCount = null,
  }) {
    return _then(_value.copyWith(
      otherUser: null == otherUser
          ? _value.otherUser
          : otherUser // ignore: cast_nullable_to_non_nullable
              as UserModel,
      lastMessage: null == lastMessage
          ? _value.lastMessage
          : lastMessage // ignore: cast_nullable_to_non_nullable
              as MessageModel,
      unreadCount: null == unreadCount
          ? _value.unreadCount
          : unreadCount // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }

  /// Create a copy of ConversationModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $UserModelCopyWith<$Res> get otherUser {
    return $UserModelCopyWith<$Res>(_value.otherUser, (value) {
      return _then(_value.copyWith(otherUser: value) as $Val);
    });
  }

  /// Create a copy of ConversationModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $MessageModelCopyWith<$Res> get lastMessage {
    return $MessageModelCopyWith<$Res>(_value.lastMessage, (value) {
      return _then(_value.copyWith(lastMessage: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ConversationModelImplCopyWith<$Res>
    implements $ConversationModelCopyWith<$Res> {
  factory _$$ConversationModelImplCopyWith(_$ConversationModelImpl value,
          $Res Function(_$ConversationModelImpl) then) =
      __$$ConversationModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({UserModel otherUser, MessageModel lastMessage, int unreadCount});

  @override
  $UserModelCopyWith<$Res> get otherUser;
  @override
  $MessageModelCopyWith<$Res> get lastMessage;
}

/// @nodoc
class __$$ConversationModelImplCopyWithImpl<$Res>
    extends _$ConversationModelCopyWithImpl<$Res, _$ConversationModelImpl>
    implements _$$ConversationModelImplCopyWith<$Res> {
  __$$ConversationModelImplCopyWithImpl(_$ConversationModelImpl _value,
      $Res Function(_$ConversationModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ConversationModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? otherUser = null,
    Object? lastMessage = null,
    Object? unreadCount = null,
  }) {
    return _then(_$ConversationModelImpl(
      otherUser: null == otherUser
          ? _value.otherUser
          : otherUser // ignore: cast_nullable_to_non_nullable
              as UserModel,
      lastMessage: null == lastMessage
          ? _value.lastMessage
          : lastMessage // ignore: cast_nullable_to_non_nullable
              as MessageModel,
      unreadCount: null == unreadCount
          ? _value.unreadCount
          : unreadCount // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ConversationModelImpl implements _ConversationModel {
  const _$ConversationModelImpl(
      {required this.otherUser,
      required this.lastMessage,
      required this.unreadCount});

  factory _$ConversationModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ConversationModelImplFromJson(json);

  @override
  final UserModel otherUser;
  @override
  final MessageModel lastMessage;
  @override
  final int unreadCount;

  @override
  String toString() {
    return 'ConversationModel(otherUser: $otherUser, lastMessage: $lastMessage, unreadCount: $unreadCount)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ConversationModelImpl &&
            (identical(other.otherUser, otherUser) ||
                other.otherUser == otherUser) &&
            (identical(other.lastMessage, lastMessage) ||
                other.lastMessage == lastMessage) &&
            (identical(other.unreadCount, unreadCount) ||
                other.unreadCount == unreadCount));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode =>
      Object.hash(runtimeType, otherUser, lastMessage, unreadCount);

  /// Create a copy of ConversationModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ConversationModelImplCopyWith<_$ConversationModelImpl> get copyWith =>
      __$$ConversationModelImplCopyWithImpl<_$ConversationModelImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ConversationModelImplToJson(
      this,
    );
  }
}

abstract class _ConversationModel implements ConversationModel {
  const factory _ConversationModel(
      {required final UserModel otherUser,
      required final MessageModel lastMessage,
      required final int unreadCount}) = _$ConversationModelImpl;

  factory _ConversationModel.fromJson(Map<String, dynamic> json) =
      _$ConversationModelImpl.fromJson;

  @override
  UserModel get otherUser;
  @override
  MessageModel get lastMessage;
  @override
  int get unreadCount;

  /// Create a copy of ConversationModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ConversationModelImplCopyWith<_$ConversationModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
