// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'message_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$MessageModelImpl _$$MessageModelImplFromJson(Map<String, dynamic> json) =>
    _$MessageModelImpl(
      id: json['id'],
      senderId: json['sender_id'],
      receiverId: json['receiver_id'],
      listingId: json['listing_id'],
      content: json['content'] as String,
      readAt: json['read_at'] as String?,
      createdAt: json['created_at'] as String?,
      sender: json['sender'] == null
          ? null
          : UserModel.fromJson(json['sender'] as Map<String, dynamic>),
      receiver: json['receiver'] == null
          ? null
          : UserModel.fromJson(json['receiver'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$MessageModelImplToJson(_$MessageModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'sender_id': instance.senderId,
      'receiver_id': instance.receiverId,
      'listing_id': instance.listingId,
      'content': instance.content,
      'read_at': instance.readAt,
      'created_at': instance.createdAt,
      'sender': instance.sender,
      'receiver': instance.receiver,
    };

_$ConversationModelImpl _$$ConversationModelImplFromJson(
        Map<String, dynamic> json) =>
    _$ConversationModelImpl(
      otherUser: UserModel.fromJson(json['otherUser'] as Map<String, dynamic>),
      lastMessage:
          MessageModel.fromJson(json['lastMessage'] as Map<String, dynamic>),
      unreadCount: (json['unreadCount'] as num).toInt(),
    );

Map<String, dynamic> _$$ConversationModelImplToJson(
        _$ConversationModelImpl instance) =>
    <String, dynamic>{
      'otherUser': instance.otherUser,
      'lastMessage': instance.lastMessage,
      'unreadCount': instance.unreadCount,
    };
