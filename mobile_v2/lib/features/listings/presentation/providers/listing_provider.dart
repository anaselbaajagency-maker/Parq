import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers.dart';
import '../../data/datasources/listing_remote_datasource.dart';
import '../../data/repositories/listing_repository_impl.dart';
import '../../domain/repositories/listing_repository.dart';
import '../../data/models/listing_model.dart';

final listingRemoteDataSourceProvider =
    Provider<ListingRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return ListingRemoteDataSource(apiClient);
});

final listingRepositoryProvider = Provider<ListingRepository>((ref) {
  final remoteDataSource = ref.watch(listingRemoteDataSourceProvider);
  return ListingRepositoryImpl(remoteDataSource);
});

// A standard future provider to fetch listings (e.g. for homepage or search)
final listingsProvider =
    FutureProvider.family<List<ListingModel>, Map<String, dynamic>>(
        (ref, params) {
  final repository = ref.watch(listingRepositoryProvider);
  return repository.getListings(
    type: params['type'],
    categoryId: params['categoryId'],
    cityId: params['cityId'],
    search: params['search'],
    sort: params['sort'],
    limit: params['limit'],
  );
});

final featuredListingsProvider = FutureProvider<List<ListingModel>>((ref) {
  final repository = ref.watch(listingRepositoryProvider);
  return repository.getListings(sort: 'featured', limit: 4);
});

final listingDetailsProvider =
    FutureProvider.family<ListingModel, dynamic>((ref, id) {
  final repository = ref.watch(listingRepositoryProvider);
  return repository.getListingDetails(id);
});
