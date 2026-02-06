import '../models/listing.dart';
import '../../../core/api/api_client.dart';

class ListingService {
  final ApiClient apiClient;

  ListingService({required this.apiClient});

  Future<List<Listing>> getListings({
    int? categoryId,
    int? cityId,
    double? minPrice,
    double? maxPrice,
    int page = 1,
  }) async {
    final Map<String, dynamic> queryParameters = {
      'page': page,
      if (categoryId != null) 'category_id': categoryId,
      if (cityId != null) 'city_id': cityId,
      if (minPrice != null) 'price_min': minPrice,
      if (maxPrice != null) 'price_max': maxPrice,
    };

    final response = await apiClient.get('/listings', queryParameters: queryParameters);
    final List data = response.data['data'];
    return data.map((json) => Listing.fromJson(json)).toList();
  }

  Future<Listing> getListingDetails(int id) async {
    final response = await apiClient.get('/listings/$id');
    return Listing.fromJson(response.data);
  }

  Future<List<Listing>> getMyListings() async {
    final response = await apiClient.get('/dashboard/listings'); // Assuming this endpoint exists or will be added
    final List data = response.data;
    return data.map((json) => Listing.fromJson(json)).toList();
  }

  Future<bool> toggleListingStatus(int id) async {
    final response = await apiClient.post('/listings/$id/pause');
    return response.statusCode == 200;
  }
}
