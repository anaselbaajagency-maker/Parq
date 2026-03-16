import '../../../../core/network/api_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../models/listing_model.dart';
import 'package:dio/dio.dart';

class ListingRemoteDataSource {
  final ApiClient _apiClient;

  ListingRemoteDataSource(this._apiClient);

  Future<List<ListingModel>> getListings({
    String? type,
    String? categoryId,
    String? cityId,
    String? search,
    String? sort,
    int? limit,
  }) async {
    final Map<String, dynamic> params = {};
    if (type != null) params['type'] = type;
    if (categoryId != null) params['category_id'] = categoryId;
    if (cityId != null) params['city_id'] = cityId;
    if (search != null) params['search'] = search;
    if (sort != null) params['sort'] = sort;
    if (limit != null) params['limit'] = limit;

    final response =
        await _apiClient.get(ApiEndpoints.listings, queryParameters: params);

    final List<dynamic> data = response.data['data'] ?? [];
    return data.map((json) => ListingModel.fromJson(json)).toList();
  }

  Future<ListingModel> getListingDetails(dynamic id) async {
    final response = await _apiClient.get(ApiEndpoints.listingDetail(id));
    return ListingModel.fromJson(response.data);
  }

  Future<bool> toggleFavorite(dynamic id) async {
    final response = await _apiClient.post(ApiEndpoints.toggleFavorite(id));
    return response.data['is_favorite'] ?? false;
  }

  Future<void> pauseListing(dynamic id) async {
    await _apiClient.post(ApiEndpoints.pauseListing(id));
  }

  Future<ListingModel> createListing(
      Map<String, dynamic> data, List<String> imagePaths) async {
    // Requires FormData due to file uploads handling in Next.js (wallet-api approach)
    final formDataMap = <String, dynamic>{...data};

    // Add images to form data
    for (int i = 0; i < imagePaths.length; i++) {
      formDataMap['images[i]'] = await MultipartFile.fromFile(imagePaths[i]);
    }

    final formData = FormData.fromMap(formDataMap);

    final response =
        await _apiClient.post(ApiEndpoints.listings, data: formData);
    return ListingModel.fromJson(response.data);
  }
}
