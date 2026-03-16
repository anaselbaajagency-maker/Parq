import '../datasources/listing_remote_datasource.dart';
import '../../domain/repositories/listing_repository.dart';
import '../models/listing_model.dart';

class ListingRepositoryImpl implements ListingRepository {
  final ListingRemoteDataSource _remoteDataSource;

  ListingRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<ListingModel>> getListings({
    String? type,
    String? categoryId,
    String? cityId,
    String? search,
    String? sort,
    int? limit,
  }) {
    return _remoteDataSource.getListings(
      type: type,
      categoryId: categoryId,
      cityId: cityId,
      search: search,
      sort: sort,
      limit: limit,
    );
  }

  @override
  Future<ListingModel> getListingDetails(dynamic id) {
    return _remoteDataSource.getListingDetails(id);
  }

  @override
  Future<bool> toggleFavorite(dynamic id) {
    return _remoteDataSource.toggleFavorite(id);
  }

  @override
  Future<void> pauseListing(dynamic id) {
    return _remoteDataSource.pauseListing(id);
  }

  @override
  Future<ListingModel> createListing(
      Map<String, dynamic> data, List<String> imagePaths) {
    return _remoteDataSource.createListing(data, imagePaths);
  }
}
