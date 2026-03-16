import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../features/auth/data/models/user_model.dart';

part 'message_model.freezed.dart';
part 'message_model.g.dart';

@freezed
class MessageModel with _$MessageModel {
  const factory MessageModel({
    required dynamic id,
    @JsonKey(name: 'sender_id') required dynamic senderId,
    @JsonKey(name: 'receiver_id') required dynamic receiverId,
    @JsonKey(name: 'listing_id') dynamic listingId,
    required String content,
    @JsonKey(name: 'read_at') String? readAt,
    @JsonKey(name: 'created_at') String? createdAt,
    UserModel? sender,
    UserModel? receiver,
  }) = _MessageModel;

  factory MessageModel.fromJson(Map<String, dynamic> json) =>
      _$MessageModelFromJson(json);
}

@freezed
class ConversationModel with _$ConversationModel {
  const factory ConversationModel({
    required UserModel otherUser,
    required MessageModel lastMessage,
    required int unreadCount,
  }) = _ConversationModel;

  factory ConversationModel.fromJson(Map<String, dynamic> json) =>
      _$ConversationModelFromJson(json);
}
