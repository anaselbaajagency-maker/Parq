import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/widgets/app_button.dart';
import '../providers/listing_provider.dart';

class ListingDetailScreen extends ConsumerWidget {
  final String listingId;

  const ListingDetailScreen({super.key, required this.listingId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final listingAsync = ref.watch(listingDetailsProvider(listingId));

    return Scaffold(
      appBar: AppBar(
        title: const Text("Détails de l'annonce"),
        elevation: 0,
      ),
      body: listingAsync.when(
        data: (listing) {
          final imageUrl = listing.images.isNotEmpty
              ? listing.images.first
              : 'https://via.placeholder.com/400x300';

          final price =
              listing.type == 'rent' ? listing.pricePerDay : listing.priceSale;
          final unit = listing.type == 'rent' ? '/jour' : '';

          return SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                AspectRatio(
                  aspectRatio: 4 / 3,
                  child: Image.network(
                    imageUrl,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        Container(color: AppColors.separator),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(AppDimensions.spaceLg),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.brand.withValues(alpha: 0.1),
                              borderRadius:
                                  BorderRadius.circular(AppDimensions.radiusSm),
                            ),
                            child: Text(
                              listing.category?.name ?? 'Équipement',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(
                                    color: AppColors.brand,
                                    fontWeight: FontWeight.w600,
                                  ),
                            ),
                          ),
                          Text(
                            listing.city?.name ?? 'Maroc',
                            style: Theme.of(context).textTheme.bodySmall,
                          ),
                        ],
                      ),
                      const SizedBox(height: AppDimensions.spaceMd),
                      Text(
                        listing.title,
                        style: Theme.of(context).textTheme.displaySmall,
                      ),
                      const SizedBox(height: AppDimensions.spaceMd),
                      RichText(
                        text: TextSpan(
                          text: '$price د.م. ',
                          style: Theme.of(context)
                              .textTheme
                              .displayMedium
                              ?.copyWith(
                                color: AppColors.brand,
                              ),
                          children: [
                            TextSpan(
                              text: unit,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: AppDimensions.spaceXl),
                      Text(
                        'Description',
                        style: Theme.of(context).textTheme.labelLarge,
                      ),
                      const SizedBox(height: AppDimensions.spaceSm),
                      Text(
                        listing.description,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                              height: 1.5,
                              color: AppColors.textBody,
                            ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Erreur: $err')),
      ),
      bottomNavigationBar: listingAsync.hasValue
          ? SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(AppDimensions.spaceLg),
                child: AppButton(
                  text: 'Contacter le loueur',
                  onPressed: () {
                    // go to messaging
                  },
                ),
              ),
            )
          : null,
    );
  }
}
