// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'listing_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$CityModelImpl _$$CityModelImplFromJson(Map<String, dynamic> json) =>
    _$CityModelImpl(
      id: json['id'],
      name: json['name'] as String,
      nameAr: json['name_ar'] as String?,
    );

Map<String, dynamic> _$$CityModelImplToJson(_$CityModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'name_ar': instance.nameAr,
    };

_$CategoryModelImpl _$$CategoryModelImplFromJson(Map<String, dynamic> json) =>
    _$CategoryModelImpl(
      id: json['id'],
      name: json['name'] as String,
      nameAr: json['name_ar'] as String?,
      icon: json['icon'],
      description: json['description'],
      slug: json['slug'],
    );

Map<String, dynamic> _$$CategoryModelImplToJson(_$CategoryModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'name_ar': instance.nameAr,
      'icon': instance.icon,
      'description': instance.description,
      'slug': instance.slug,
    };

_$ListingModelImpl _$$ListingModelImplFromJson(Map<String, dynamic> json) =>
    _$ListingModelImpl(
      id: json['id'],
      title: json['title'] as String,
      titleAr: json['title_ar'] as String?,
      description: json['description'] as String,
      descriptionAr: json['description_ar'] as String?,
      type: json['type'] as String,
      pricePerDay: json['price_per_day'] as num?,
      priceSale: json['price_sale'] as num?,
      priceUnit: json['price_unit'] as String?,
      images:
          (json['images'] as List<dynamic>).map((e) => e as String).toList(),
      status: json['status'] as String,
      brand: json['brand'] as String?,
      model: json['model'] as String?,
      year: json['year'],
      condition: json['condition'] as String?,
      power: json['power'],
      fuel: json['fuel'] as String?,
      gearbox: json['gearbox'] as String?,
      seats: json['seats'],
      tonnage: json['tonnage'],
      withDriver: json['with_driver'] as bool?,
      city: json['city'] == null
          ? null
          : CityModel.fromJson(json['city'] as Map<String, dynamic>),
      category: json['category'] == null
          ? null
          : CategoryModel.fromJson(json['category'] as Map<String, dynamic>),
      user: json['user'] == null
          ? null
          : UserModel.fromJson(json['user'] as Map<String, dynamic>),
      views: (json['views'] as num?)?.toInt() ?? 0,
      favorites: (json['favorites'] as num?)?.toInt() ?? 0,
      createdAt: json['created_at'] as String?,
    );

Map<String, dynamic> _$$ListingModelImplToJson(_$ListingModelImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'title': instance.title,
      'title_ar': instance.titleAr,
      'description': instance.description,
      'description_ar': instance.descriptionAr,
      'type': instance.type,
      'price_per_day': instance.pricePerDay,
      'price_sale': instance.priceSale,
      'price_unit': instance.priceUnit,
      'images': instance.images,
      'status': instance.status,
      'brand': instance.brand,
      'model': instance.model,
      'year': instance.year,
      'condition': instance.condition,
      'power': instance.power,
      'fuel': instance.fuel,
      'gearbox': instance.gearbox,
      'seats': instance.seats,
      'tonnage': instance.tonnage,
      'with_driver': instance.withDriver,
      'city': instance.city,
      'category': instance.category,
      'user': instance.user,
      'views': instance.views,
      'favorites': instance.favorites,
      'created_at': instance.createdAt,
    };
