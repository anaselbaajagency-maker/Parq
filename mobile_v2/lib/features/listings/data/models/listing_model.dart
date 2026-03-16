import 'package:freezed_annotation/freezed_annotation.dart';
import '../../../../features/auth/data/models/user_model.dart';
part 'listing_model.freezed.dart';
part 'listing_model.g.dart';

@freezed
class CityModel with _$CityModel {
  const factory CityModel({
    required dynamic id,
    required String name,
    @JsonKey(name: 'name_ar') String? nameAr,
  }) = _CityModel;

  factory CityModel.fromJson(Map<String, dynamic> json) =>
      _$CityModelFromJson(json);
}

@freezed
class CategoryModel with _$CategoryModel {
  const factory CategoryModel({
    required dynamic id,
    required String name,
    @JsonKey(name: 'name_ar') String? nameAr,
    dynamic icon,
    dynamic description,
    dynamic slug,
  }) = _CategoryModel;

  factory CategoryModel.fromJson(Map<String, dynamic> json) =>
      _$CategoryModelFromJson(json);
}

@freezed
class ListingModel with _$ListingModel {
  const factory ListingModel({
    required dynamic id,
    required String title,
    @JsonKey(name: 'title_ar') String? titleAr,
    required String description,
    @JsonKey(name: 'description_ar') String? descriptionAr,
    required String type, // 'rent' or 'buy'
    @JsonKey(name: 'price_per_day') num? pricePerDay, // Changed type to num
    @JsonKey(name: 'price_sale') num? priceSale, // Changed type to num
    @JsonKey(name: 'price_unit') String? priceUnit,
    required List<String> images,
    required String status,

    // Technical Specs matching typescript Listing interface
    String? brand,
    String? model,
    dynamic year, // int / string possibility
    String? condition,
    dynamic power, // String / int
    String? fuel,
    String? gearbox,
    dynamic seats,
    dynamic tonnage,
    @JsonKey(name: 'with_driver') bool? withDriver,

    // Relations
    CityModel? city,
    CategoryModel? category,
    UserModel? user,

    // Metrics
    @Default(0) int views,
    @Default(0) int favorites,
    @JsonKey(name: 'created_at') String? createdAt,
  }) = _ListingModel;

  factory ListingModel.fromJson(Map<String, dynamic> json) =>
      _$ListingModelFromJson(json);
}
