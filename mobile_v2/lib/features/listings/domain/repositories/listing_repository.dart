import '../../data/models/listing_model.dart';

abstract class ListingRepository {
  Future<List<ListingModel>> getListings({
    String? type,
    String? categoryId,
    String? cityId,
    String? search,
    String? sort,
    int? limit,
  });

  Future<ListingModel> getListingDetails(dynamic id);
  Future<bool> toggleFavorite(dynamic id);
  Future<void> pauseListing(dynamic id);
  Future<ListingModel> createListing(
      Map<String, dynamic> data, List<String> imagePaths);
}
