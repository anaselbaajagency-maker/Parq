// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'listing_model.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

CityModel _$CityModelFromJson(Map<String, dynamic> json) {
  return _CityModel.fromJson(json);
}

/// @nodoc
mixin _$CityModel {
  dynamic get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  @JsonKey(name: 'name_ar')
  String? get nameAr => throw _privateConstructorUsedError;

  /// Serializes this CityModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CityModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CityModelCopyWith<CityModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CityModelCopyWith<$Res> {
  factory $CityModelCopyWith(CityModel value, $Res Function(CityModel) then) =
      _$CityModelCopyWithImpl<$Res, CityModel>;
  @useResult
  $Res call(
      {dynamic id, String name, @JsonKey(name: 'name_ar') String? nameAr});
}

/// @nodoc
class _$CityModelCopyWithImpl<$Res, $Val extends CityModel>
    implements $CityModelCopyWith<$Res> {
  _$CityModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CityModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? name = null,
    Object? nameAr = freezed,
  }) {
    return _then(_value.copyWith(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      nameAr: freezed == nameAr
          ? _value.nameAr
          : nameAr // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CityModelImplCopyWith<$Res>
    implements $CityModelCopyWith<$Res> {
  factory _$$CityModelImplCopyWith(
          _$CityModelImpl value, $Res Function(_$CityModelImpl) then) =
      __$$CityModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {dynamic id, String name, @JsonKey(name: 'name_ar') String? nameAr});
}

/// @nodoc
class __$$CityModelImplCopyWithImpl<$Res>
    extends _$CityModelCopyWithImpl<$Res, _$CityModelImpl>
    implements _$$CityModelImplCopyWith<$Res> {
  __$$CityModelImplCopyWithImpl(
      _$CityModelImpl _value, $Res Function(_$CityModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CityModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? name = null,
    Object? nameAr = freezed,
  }) {
    return _then(_$CityModelImpl(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      nameAr: freezed == nameAr
          ? _value.nameAr
          : nameAr // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CityModelImpl implements _CityModel {
  const _$CityModelImpl(
      {required this.id,
      required this.name,
      @JsonKey(name: 'name_ar') this.nameAr});

  factory _$CityModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CityModelImplFromJson(json);

  @override
  final dynamic id;
  @override
  final String name;
  @override
  @JsonKey(name: 'name_ar')
  final String? nameAr;

  @override
  String toString() {
    return 'CityModel(id: $id, name: $name, nameAr: $nameAr)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CityModelImpl &&
            const DeepCollectionEquality().equals(other.id, id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.nameAr, nameAr) || other.nameAr == nameAr));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType, const DeepCollectionEquality().hash(id), name, nameAr);

  /// Create a copy of CityModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CityModelImplCopyWith<_$CityModelImpl> get copyWith =>
      __$$CityModelImplCopyWithImpl<_$CityModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CityModelImplToJson(
      this,
    );
  }
}

abstract class _CityModel implements CityModel {
  const factory _CityModel(
      {required final dynamic id,
      required final String name,
      @JsonKey(name: 'name_ar') final String? nameAr}) = _$CityModelImpl;

  factory _CityModel.fromJson(Map<String, dynamic> json) =
      _$CityModelImpl.fromJson;

  @override
  dynamic get id;
  @override
  String get name;
  @override
  @JsonKey(name: 'name_ar')
  String? get nameAr;

  /// Create a copy of CityModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CityModelImplCopyWith<_$CityModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

CategoryModel _$CategoryModelFromJson(Map<String, dynamic> json) {
  return _CategoryModel.fromJson(json);
}

/// @nodoc
mixin _$CategoryModel {
  dynamic get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  @JsonKey(name: 'name_ar')
  String? get nameAr => throw _privateConstructorUsedError;
  dynamic get icon => throw _privateConstructorUsedError;
  dynamic get description => throw _privateConstructorUsedError;
  dynamic get slug => throw _privateConstructorUsedError;

  /// Serializes this CategoryModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of CategoryModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $CategoryModelCopyWith<CategoryModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $CategoryModelCopyWith<$Res> {
  factory $CategoryModelCopyWith(
          CategoryModel value, $Res Function(CategoryModel) then) =
      _$CategoryModelCopyWithImpl<$Res, CategoryModel>;
  @useResult
  $Res call(
      {dynamic id,
      String name,
      @JsonKey(name: 'name_ar') String? nameAr,
      dynamic icon,
      dynamic description,
      dynamic slug});
}

/// @nodoc
class _$CategoryModelCopyWithImpl<$Res, $Val extends CategoryModel>
    implements $CategoryModelCopyWith<$Res> {
  _$CategoryModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of CategoryModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? name = null,
    Object? nameAr = freezed,
    Object? icon = freezed,
    Object? description = freezed,
    Object? slug = freezed,
  }) {
    return _then(_value.copyWith(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      nameAr: freezed == nameAr
          ? _value.nameAr
          : nameAr // ignore: cast_nullable_to_non_nullable
              as String?,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as dynamic,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as dynamic,
      slug: freezed == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as dynamic,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$CategoryModelImplCopyWith<$Res>
    implements $CategoryModelCopyWith<$Res> {
  factory _$$CategoryModelImplCopyWith(
          _$CategoryModelImpl value, $Res Function(_$CategoryModelImpl) then) =
      __$$CategoryModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {dynamic id,
      String name,
      @JsonKey(name: 'name_ar') String? nameAr,
      dynamic icon,
      dynamic description,
      dynamic slug});
}

/// @nodoc
class __$$CategoryModelImplCopyWithImpl<$Res>
    extends _$CategoryModelCopyWithImpl<$Res, _$CategoryModelImpl>
    implements _$$CategoryModelImplCopyWith<$Res> {
  __$$CategoryModelImplCopyWithImpl(
      _$CategoryModelImpl _value, $Res Function(_$CategoryModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of CategoryModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? name = null,
    Object? nameAr = freezed,
    Object? icon = freezed,
    Object? description = freezed,
    Object? slug = freezed,
  }) {
    return _then(_$CategoryModelImpl(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      nameAr: freezed == nameAr
          ? _value.nameAr
          : nameAr // ignore: cast_nullable_to_non_nullable
              as String?,
      icon: freezed == icon
          ? _value.icon
          : icon // ignore: cast_nullable_to_non_nullable
              as dynamic,
      description: freezed == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as dynamic,
      slug: freezed == slug
          ? _value.slug
          : slug // ignore: cast_nullable_to_non_nullable
              as dynamic,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$CategoryModelImpl implements _CategoryModel {
  const _$CategoryModelImpl(
      {required this.id,
      required this.name,
      @JsonKey(name: 'name_ar') this.nameAr,
      this.icon,
      this.description,
      this.slug});

  factory _$CategoryModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$CategoryModelImplFromJson(json);

  @override
  final dynamic id;
  @override
  final String name;
  @override
  @JsonKey(name: 'name_ar')
  final String? nameAr;
  @override
  final dynamic icon;
  @override
  final dynamic description;
  @override
  final dynamic slug;

  @override
  String toString() {
    return 'CategoryModel(id: $id, name: $name, nameAr: $nameAr, icon: $icon, description: $description, slug: $slug)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$CategoryModelImpl &&
            const DeepCollectionEquality().equals(other.id, id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.nameAr, nameAr) || other.nameAr == nameAr) &&
            const DeepCollectionEquality().equals(other.icon, icon) &&
            const DeepCollectionEquality()
                .equals(other.description, description) &&
            const DeepCollectionEquality().equals(other.slug, slug));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      const DeepCollectionEquality().hash(id),
      name,
      nameAr,
      const DeepCollectionEquality().hash(icon),
      const DeepCollectionEquality().hash(description),
      const DeepCollectionEquality().hash(slug));

  /// Create a copy of CategoryModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$CategoryModelImplCopyWith<_$CategoryModelImpl> get copyWith =>
      __$$CategoryModelImplCopyWithImpl<_$CategoryModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$CategoryModelImplToJson(
      this,
    );
  }
}

abstract class _CategoryModel implements CategoryModel {
  const factory _CategoryModel(
      {required final dynamic id,
      required final String name,
      @JsonKey(name: 'name_ar') final String? nameAr,
      final dynamic icon,
      final dynamic description,
      final dynamic slug}) = _$CategoryModelImpl;

  factory _CategoryModel.fromJson(Map<String, dynamic> json) =
      _$CategoryModelImpl.fromJson;

  @override
  dynamic get id;
  @override
  String get name;
  @override
  @JsonKey(name: 'name_ar')
  String? get nameAr;
  @override
  dynamic get icon;
  @override
  dynamic get description;
  @override
  dynamic get slug;

  /// Create a copy of CategoryModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$CategoryModelImplCopyWith<_$CategoryModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ListingModel _$ListingModelFromJson(Map<String, dynamic> json) {
  return _ListingModel.fromJson(json);
}

/// @nodoc
mixin _$ListingModel {
  dynamic get id => throw _privateConstructorUsedError;
  String get title => throw _privateConstructorUsedError;
  @JsonKey(name: 'title_ar')
  String? get titleAr => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  @JsonKey(name: 'description_ar')
  String? get descriptionAr => throw _privateConstructorUsedError;
  String get type => throw _privateConstructorUsedError; // 'rent' or 'buy'
  @JsonKey(name: 'price_per_day')
  num? get pricePerDay =>
      throw _privateConstructorUsedError; // Changed type to num
  @JsonKey(name: 'price_sale')
  num? get priceSale =>
      throw _privateConstructorUsedError; // Changed type to num
  @JsonKey(name: 'price_unit')
  String? get priceUnit => throw _privateConstructorUsedError;
  List<String> get images => throw _privateConstructorUsedError;
  String get status =>
      throw _privateConstructorUsedError; // Technical Specs matching typescript Listing interface
  String? get brand => throw _privateConstructorUsedError;
  String? get model => throw _privateConstructorUsedError;
  dynamic get year =>
      throw _privateConstructorUsedError; // int / string possibility
  String? get condition => throw _privateConstructorUsedError;
  dynamic get power => throw _privateConstructorUsedError; // String / int
  String? get fuel => throw _privateConstructorUsedError;
  String? get gearbox => throw _privateConstructorUsedError;
  dynamic get seats => throw _privateConstructorUsedError;
  dynamic get tonnage => throw _privateConstructorUsedError;
  @JsonKey(name: 'with_driver')
  bool? get withDriver => throw _privateConstructorUsedError; // Relations
  CityModel? get city => throw _privateConstructorUsedError;
  CategoryModel? get category => throw _privateConstructorUsedError;
  UserModel? get user => throw _privateConstructorUsedError; // Metrics
  int get views => throw _privateConstructorUsedError;
  int get favorites => throw _privateConstructorUsedError;
  @JsonKey(name: 'created_at')
  String? get createdAt => throw _privateConstructorUsedError;

  /// Serializes this ListingModel to a JSON map.
  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  $ListingModelCopyWith<ListingModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ListingModelCopyWith<$Res> {
  factory $ListingModelCopyWith(
          ListingModel value, $Res Function(ListingModel) then) =
      _$ListingModelCopyWithImpl<$Res, ListingModel>;
  @useResult
  $Res call(
      {dynamic id,
      String title,
      @JsonKey(name: 'title_ar') String? titleAr,
      String description,
      @JsonKey(name: 'description_ar') String? descriptionAr,
      String type,
      @JsonKey(name: 'price_per_day') num? pricePerDay,
      @JsonKey(name: 'price_sale') num? priceSale,
      @JsonKey(name: 'price_unit') String? priceUnit,
      List<String> images,
      String status,
      String? brand,
      String? model,
      dynamic year,
      String? condition,
      dynamic power,
      String? fuel,
      String? gearbox,
      dynamic seats,
      dynamic tonnage,
      @JsonKey(name: 'with_driver') bool? withDriver,
      CityModel? city,
      CategoryModel? category,
      UserModel? user,
      int views,
      int favorites,
      @JsonKey(name: 'created_at') String? createdAt});

  $CityModelCopyWith<$Res>? get city;
  $CategoryModelCopyWith<$Res>? get category;
  $UserModelCopyWith<$Res>? get user;
}

/// @nodoc
class _$ListingModelCopyWithImpl<$Res, $Val extends ListingModel>
    implements $ListingModelCopyWith<$Res> {
  _$ListingModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? title = null,
    Object? titleAr = freezed,
    Object? description = null,
    Object? descriptionAr = freezed,
    Object? type = null,
    Object? pricePerDay = freezed,
    Object? priceSale = freezed,
    Object? priceUnit = freezed,
    Object? images = null,
    Object? status = null,
    Object? brand = freezed,
    Object? model = freezed,
    Object? year = freezed,
    Object? condition = freezed,
    Object? power = freezed,
    Object? fuel = freezed,
    Object? gearbox = freezed,
    Object? seats = freezed,
    Object? tonnage = freezed,
    Object? withDriver = freezed,
    Object? city = freezed,
    Object? category = freezed,
    Object? user = freezed,
    Object? views = null,
    Object? favorites = null,
    Object? createdAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      titleAr: freezed == titleAr
          ? _value.titleAr
          : titleAr // ignore: cast_nullable_to_non_nullable
              as String?,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      descriptionAr: freezed == descriptionAr
          ? _value.descriptionAr
          : descriptionAr // ignore: cast_nullable_to_non_nullable
              as String?,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      pricePerDay: freezed == pricePerDay
          ? _value.pricePerDay
          : pricePerDay // ignore: cast_nullable_to_non_nullable
              as num?,
      priceSale: freezed == priceSale
          ? _value.priceSale
          : priceSale // ignore: cast_nullable_to_non_nullable
              as num?,
      priceUnit: freezed == priceUnit
          ? _value.priceUnit
          : priceUnit // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value.images
          : images // ignore: cast_nullable_to_non_nullable
              as List<String>,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      brand: freezed == brand
          ? _value.brand
          : brand // ignore: cast_nullable_to_non_nullable
              as String?,
      model: freezed == model
          ? _value.model
          : model // ignore: cast_nullable_to_non_nullable
              as String?,
      year: freezed == year
          ? _value.year
          : year // ignore: cast_nullable_to_non_nullable
              as dynamic,
      condition: freezed == condition
          ? _value.condition
          : condition // ignore: cast_nullable_to_non_nullable
              as String?,
      power: freezed == power
          ? _value.power
          : power // ignore: cast_nullable_to_non_nullable
              as dynamic,
      fuel: freezed == fuel
          ? _value.fuel
          : fuel // ignore: cast_nullable_to_non_nullable
              as String?,
      gearbox: freezed == gearbox
          ? _value.gearbox
          : gearbox // ignore: cast_nullable_to_non_nullable
              as String?,
      seats: freezed == seats
          ? _value.seats
          : seats // ignore: cast_nullable_to_non_nullable
              as dynamic,
      tonnage: freezed == tonnage
          ? _value.tonnage
          : tonnage // ignore: cast_nullable_to_non_nullable
              as dynamic,
      withDriver: freezed == withDriver
          ? _value.withDriver
          : withDriver // ignore: cast_nullable_to_non_nullable
              as bool?,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as CityModel?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as CategoryModel?,
      user: freezed == user
          ? _value.user
          : user // ignore: cast_nullable_to_non_nullable
              as UserModel?,
      views: null == views
          ? _value.views
          : views // ignore: cast_nullable_to_non_nullable
              as int,
      favorites: null == favorites
          ? _value.favorites
          : favorites // ignore: cast_nullable_to_non_nullable
              as int,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $CityModelCopyWith<$Res>? get city {
    if (_value.city == null) {
      return null;
    }

    return $CityModelCopyWith<$Res>(_value.city!, (value) {
      return _then(_value.copyWith(city: value) as $Val);
    });
  }

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $CategoryModelCopyWith<$Res>? get category {
    if (_value.category == null) {
      return null;
    }

    return $CategoryModelCopyWith<$Res>(_value.category!, (value) {
      return _then(_value.copyWith(category: value) as $Val);
    });
  }

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @pragma('vm:prefer-inline')
  $UserModelCopyWith<$Res>? get user {
    if (_value.user == null) {
      return null;
    }

    return $UserModelCopyWith<$Res>(_value.user!, (value) {
      return _then(_value.copyWith(user: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$ListingModelImplCopyWith<$Res>
    implements $ListingModelCopyWith<$Res> {
  factory _$$ListingModelImplCopyWith(
          _$ListingModelImpl value, $Res Function(_$ListingModelImpl) then) =
      __$$ListingModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {dynamic id,
      String title,
      @JsonKey(name: 'title_ar') String? titleAr,
      String description,
      @JsonKey(name: 'description_ar') String? descriptionAr,
      String type,
      @JsonKey(name: 'price_per_day') num? pricePerDay,
      @JsonKey(name: 'price_sale') num? priceSale,
      @JsonKey(name: 'price_unit') String? priceUnit,
      List<String> images,
      String status,
      String? brand,
      String? model,
      dynamic year,
      String? condition,
      dynamic power,
      String? fuel,
      String? gearbox,
      dynamic seats,
      dynamic tonnage,
      @JsonKey(name: 'with_driver') bool? withDriver,
      CityModel? city,
      CategoryModel? category,
      UserModel? user,
      int views,
      int favorites,
      @JsonKey(name: 'created_at') String? createdAt});

  @override
  $CityModelCopyWith<$Res>? get city;
  @override
  $CategoryModelCopyWith<$Res>? get category;
  @override
  $UserModelCopyWith<$Res>? get user;
}

/// @nodoc
class __$$ListingModelImplCopyWithImpl<$Res>
    extends _$ListingModelCopyWithImpl<$Res, _$ListingModelImpl>
    implements _$$ListingModelImplCopyWith<$Res> {
  __$$ListingModelImplCopyWithImpl(
      _$ListingModelImpl _value, $Res Function(_$ListingModelImpl) _then)
      : super(_value, _then);

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = freezed,
    Object? title = null,
    Object? titleAr = freezed,
    Object? description = null,
    Object? descriptionAr = freezed,
    Object? type = null,
    Object? pricePerDay = freezed,
    Object? priceSale = freezed,
    Object? priceUnit = freezed,
    Object? images = null,
    Object? status = null,
    Object? brand = freezed,
    Object? model = freezed,
    Object? year = freezed,
    Object? condition = freezed,
    Object? power = freezed,
    Object? fuel = freezed,
    Object? gearbox = freezed,
    Object? seats = freezed,
    Object? tonnage = freezed,
    Object? withDriver = freezed,
    Object? city = freezed,
    Object? category = freezed,
    Object? user = freezed,
    Object? views = null,
    Object? favorites = null,
    Object? createdAt = freezed,
  }) {
    return _then(_$ListingModelImpl(
      id: freezed == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as dynamic,
      title: null == title
          ? _value.title
          : title // ignore: cast_nullable_to_non_nullable
              as String,
      titleAr: freezed == titleAr
          ? _value.titleAr
          : titleAr // ignore: cast_nullable_to_non_nullable
              as String?,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      descriptionAr: freezed == descriptionAr
          ? _value.descriptionAr
          : descriptionAr // ignore: cast_nullable_to_non_nullable
              as String?,
      type: null == type
          ? _value.type
          : type // ignore: cast_nullable_to_non_nullable
              as String,
      pricePerDay: freezed == pricePerDay
          ? _value.pricePerDay
          : pricePerDay // ignore: cast_nullable_to_non_nullable
              as num?,
      priceSale: freezed == priceSale
          ? _value.priceSale
          : priceSale // ignore: cast_nullable_to_non_nullable
              as num?,
      priceUnit: freezed == priceUnit
          ? _value.priceUnit
          : priceUnit // ignore: cast_nullable_to_non_nullable
              as String?,
      images: null == images
          ? _value._images
          : images // ignore: cast_nullable_to_non_nullable
              as List<String>,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as String,
      brand: freezed == brand
          ? _value.brand
          : brand // ignore: cast_nullable_to_non_nullable
              as String?,
      model: freezed == model
          ? _value.model
          : model // ignore: cast_nullable_to_non_nullable
              as String?,
      year: freezed == year
          ? _value.year
          : year // ignore: cast_nullable_to_non_nullable
              as dynamic,
      condition: freezed == condition
          ? _value.condition
          : condition // ignore: cast_nullable_to_non_nullable
              as String?,
      power: freezed == power
          ? _value.power
          : power // ignore: cast_nullable_to_non_nullable
              as dynamic,
      fuel: freezed == fuel
          ? _value.fuel
          : fuel // ignore: cast_nullable_to_non_nullable
              as String?,
      gearbox: freezed == gearbox
          ? _value.gearbox
          : gearbox // ignore: cast_nullable_to_non_nullable
              as String?,
      seats: freezed == seats
          ? _value.seats
          : seats // ignore: cast_nullable_to_non_nullable
              as dynamic,
      tonnage: freezed == tonnage
          ? _value.tonnage
          : tonnage // ignore: cast_nullable_to_non_nullable
              as dynamic,
      withDriver: freezed == withDriver
          ? _value.withDriver
          : withDriver // ignore: cast_nullable_to_non_nullable
              as bool?,
      city: freezed == city
          ? _value.city
          : city // ignore: cast_nullable_to_non_nullable
              as CityModel?,
      category: freezed == category
          ? _value.category
          : category // ignore: cast_nullable_to_non_nullable
              as CategoryModel?,
      user: freezed == user
          ? _value.user
          : user // ignore: cast_nullable_to_non_nullable
              as UserModel?,
      views: null == views
          ? _value.views
          : views // ignore: cast_nullable_to_non_nullable
              as int,
      favorites: null == favorites
          ? _value.favorites
          : favorites // ignore: cast_nullable_to_non_nullable
              as int,
      createdAt: freezed == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ListingModelImpl implements _ListingModel {
  const _$ListingModelImpl(
      {required this.id,
      required this.title,
      @JsonKey(name: 'title_ar') this.titleAr,
      required this.description,
      @JsonKey(name: 'description_ar') this.descriptionAr,
      required this.type,
      @JsonKey(name: 'price_per_day') this.pricePerDay,
      @JsonKey(name: 'price_sale') this.priceSale,
      @JsonKey(name: 'price_unit') this.priceUnit,
      required final List<String> images,
      required this.status,
      this.brand,
      this.model,
      this.year,
      this.condition,
      this.power,
      this.fuel,
      this.gearbox,
      this.seats,
      this.tonnage,
      @JsonKey(name: 'with_driver') this.withDriver,
      this.city,
      this.category,
      this.user,
      this.views = 0,
      this.favorites = 0,
      @JsonKey(name: 'created_at') this.createdAt})
      : _images = images;

  factory _$ListingModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$ListingModelImplFromJson(json);

  @override
  final dynamic id;
  @override
  final String title;
  @override
  @JsonKey(name: 'title_ar')
  final String? titleAr;
  @override
  final String description;
  @override
  @JsonKey(name: 'description_ar')
  final String? descriptionAr;
  @override
  final String type;
// 'rent' or 'buy'
  @override
  @JsonKey(name: 'price_per_day')
  final num? pricePerDay;
// Changed type to num
  @override
  @JsonKey(name: 'price_sale')
  final num? priceSale;
// Changed type to num
  @override
  @JsonKey(name: 'price_unit')
  final String? priceUnit;
  final List<String> _images;
  @override
  List<String> get images {
    if (_images is EqualUnmodifiableListView) return _images;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_images);
  }

  @override
  final String status;
// Technical Specs matching typescript Listing interface
  @override
  final String? brand;
  @override
  final String? model;
  @override
  final dynamic year;
// int / string possibility
  @override
  final String? condition;
  @override
  final dynamic power;
// String / int
  @override
  final String? fuel;
  @override
  final String? gearbox;
  @override
  final dynamic seats;
  @override
  final dynamic tonnage;
  @override
  @JsonKey(name: 'with_driver')
  final bool? withDriver;
// Relations
  @override
  final CityModel? city;
  @override
  final CategoryModel? category;
  @override
  final UserModel? user;
// Metrics
  @override
  @JsonKey()
  final int views;
  @override
  @JsonKey()
  final int favorites;
  @override
  @JsonKey(name: 'created_at')
  final String? createdAt;

  @override
  String toString() {
    return 'ListingModel(id: $id, title: $title, titleAr: $titleAr, description: $description, descriptionAr: $descriptionAr, type: $type, pricePerDay: $pricePerDay, priceSale: $priceSale, priceUnit: $priceUnit, images: $images, status: $status, brand: $brand, model: $model, year: $year, condition: $condition, power: $power, fuel: $fuel, gearbox: $gearbox, seats: $seats, tonnage: $tonnage, withDriver: $withDriver, city: $city, category: $category, user: $user, views: $views, favorites: $favorites, createdAt: $createdAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ListingModelImpl &&
            const DeepCollectionEquality().equals(other.id, id) &&
            (identical(other.title, title) || other.title == title) &&
            (identical(other.titleAr, titleAr) || other.titleAr == titleAr) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.descriptionAr, descriptionAr) ||
                other.descriptionAr == descriptionAr) &&
            (identical(other.type, type) || other.type == type) &&
            (identical(other.pricePerDay, pricePerDay) ||
                other.pricePerDay == pricePerDay) &&
            (identical(other.priceSale, priceSale) ||
                other.priceSale == priceSale) &&
            (identical(other.priceUnit, priceUnit) ||
                other.priceUnit == priceUnit) &&
            const DeepCollectionEquality().equals(other._images, _images) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.brand, brand) || other.brand == brand) &&
            (identical(other.model, model) || other.model == model) &&
            const DeepCollectionEquality().equals(other.year, year) &&
            (identical(other.condition, condition) ||
                other.condition == condition) &&
            const DeepCollectionEquality().equals(other.power, power) &&
            (identical(other.fuel, fuel) || other.fuel == fuel) &&
            (identical(other.gearbox, gearbox) || other.gearbox == gearbox) &&
            const DeepCollectionEquality().equals(other.seats, seats) &&
            const DeepCollectionEquality().equals(other.tonnage, tonnage) &&
            (identical(other.withDriver, withDriver) ||
                other.withDriver == withDriver) &&
            (identical(other.city, city) || other.city == city) &&
            (identical(other.category, category) ||
                other.category == category) &&
            (identical(other.user, user) || other.user == user) &&
            (identical(other.views, views) || other.views == views) &&
            (identical(other.favorites, favorites) ||
                other.favorites == favorites) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt));
  }

  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  int get hashCode => Object.hashAll([
        runtimeType,
        const DeepCollectionEquality().hash(id),
        title,
        titleAr,
        description,
        descriptionAr,
        type,
        pricePerDay,
        priceSale,
        priceUnit,
        const DeepCollectionEquality().hash(_images),
        status,
        brand,
        model,
        const DeepCollectionEquality().hash(year),
        condition,
        const DeepCollectionEquality().hash(power),
        fuel,
        gearbox,
        const DeepCollectionEquality().hash(seats),
        const DeepCollectionEquality().hash(tonnage),
        withDriver,
        city,
        category,
        user,
        views,
        favorites,
        createdAt
      ]);

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @JsonKey(includeFromJson: false, includeToJson: false)
  @override
  @pragma('vm:prefer-inline')
  _$$ListingModelImplCopyWith<_$ListingModelImpl> get copyWith =>
      __$$ListingModelImplCopyWithImpl<_$ListingModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ListingModelImplToJson(
      this,
    );
  }
}

abstract class _ListingModel implements ListingModel {
  const factory _ListingModel(
          {required final dynamic id,
          required final String title,
          @JsonKey(name: 'title_ar') final String? titleAr,
          required final String description,
          @JsonKey(name: 'description_ar') final String? descriptionAr,
          required final String type,
          @JsonKey(name: 'price_per_day') final num? pricePerDay,
          @JsonKey(name: 'price_sale') final num? priceSale,
          @JsonKey(name: 'price_unit') final String? priceUnit,
          required final List<String> images,
          required final String status,
          final String? brand,
          final String? model,
          final dynamic year,
          final String? condition,
          final dynamic power,
          final String? fuel,
          final String? gearbox,
          final dynamic seats,
          final dynamic tonnage,
          @JsonKey(name: 'with_driver') final bool? withDriver,
          final CityModel? city,
          final CategoryModel? category,
          final UserModel? user,
          final int views,
          final int favorites,
          @JsonKey(name: 'created_at') final String? createdAt}) =
      _$ListingModelImpl;

  factory _ListingModel.fromJson(Map<String, dynamic> json) =
      _$ListingModelImpl.fromJson;

  @override
  dynamic get id;
  @override
  String get title;
  @override
  @JsonKey(name: 'title_ar')
  String? get titleAr;
  @override
  String get description;
  @override
  @JsonKey(name: 'description_ar')
  String? get descriptionAr;
  @override
  String get type; // 'rent' or 'buy'
  @override
  @JsonKey(name: 'price_per_day')
  num? get pricePerDay; // Changed type to num
  @override
  @JsonKey(name: 'price_sale')
  num? get priceSale; // Changed type to num
  @override
  @JsonKey(name: 'price_unit')
  String? get priceUnit;
  @override
  List<String> get images;
  @override
  String get status; // Technical Specs matching typescript Listing interface
  @override
  String? get brand;
  @override
  String? get model;
  @override
  dynamic get year; // int / string possibility
  @override
  String? get condition;
  @override
  dynamic get power; // String / int
  @override
  String? get fuel;
  @override
  String? get gearbox;
  @override
  dynamic get seats;
  @override
  dynamic get tonnage;
  @override
  @JsonKey(name: 'with_driver')
  bool? get withDriver; // Relations
  @override
  CityModel? get city;
  @override
  CategoryModel? get category;
  @override
  UserModel? get user; // Metrics
  @override
  int get views;
  @override
  int get favorites;
  @override
  @JsonKey(name: 'created_at')
  String? get createdAt;

  /// Create a copy of ListingModel
  /// with the given fields replaced by the non-null parameter values.
  @override
  @JsonKey(includeFromJson: false, includeToJson: false)
  _$$ListingModelImplCopyWith<_$ListingModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
