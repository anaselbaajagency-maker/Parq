// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$UserModelImpl _$$UserModelImplFromJson(Map<String, dynamic> json) =>
    _$UserModelImpl(
      id: json['id'],
      fullName: json['full_name'] as String,
      email: json['email'] as String?,
      role: json['role'] as String?,
      phone: json['phone'] as String?,
      avatar: json['avatar'] as String?,
      createdAt: json['created_at'] as String?,
    );

Map<String, dynamic> _$$UserModelImplToJson(_$UserModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'full_name': instance.fullName,
      'email': instance.email,
      'role': instance.role,
      'phone': instance.phone,
      'avatar': instance.avatar,
      'created_at': instance.createdAt,
    };
