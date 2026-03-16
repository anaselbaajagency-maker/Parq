import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required dynamic id,
    @JsonKey(name: 'full_name') required String fullName,
    String? email,
    String? role,
    String? phone,
    String? avatar,
    @JsonKey(name: 'created_at') String? createdAt,
  }) = _UserModel;

  factory UserModel.fromJson(Map<String, dynamic> json) =>
      _$UserModelFromJson(json);
}
