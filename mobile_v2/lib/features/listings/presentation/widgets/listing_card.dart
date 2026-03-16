import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/theme/glassmorphism.dart';
import '../../data/models/listing_model.dart';
// Note: requires cached_network_image in real env or generic NetworkImage

class ListingCard extends StatelessWidget {
  final ListingModel listing;
  final VoidCallback? onTap;

  const ListingCard({
    super.key,
    required this.listing,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Determine title to show based on locale (simplified here)
    final title = listing.title;
    final price =
        listing.type == 'rent' ? listing.pricePerDay : listing.priceSale;
    final unit = listing.type == 'rent' ? '/jour' : '';
    final imageUrl = listing.images.isNotEmpty
        ? listing.images.first
        : 'https://via.placeholder.com/400x300';

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppColors.background,
          borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image area with glass badges
            Stack(
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
                Positioned(
                  top: AppDimensions.spaceSm,
                  left: AppDimensions.spaceSm,
                  child: GlassContainer(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    borderRadius: BorderRadius.circular(AppDimensions.radiusSm),
                    child: Text(
                      listing.category?.name ?? 'Équipement',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                          ),
                    ),
                  ),
                ),
                Positioned(
                  top: AppDimensions.spaceSm,
                  right: AppDimensions.spaceSm,
                  child: GlassContainer(
                    padding: const EdgeInsets.all(6),
                    borderRadius:
                        BorderRadius.circular(AppDimensions.radiusFull),
                    child: const Icon(Icons.favorite_border,
                        color: Colors.white, size: 20),
                  ),
                ),
              ],
            ),

            // Content
            Padding(
              padding: const EdgeInsets.all(AppDimensions.spaceMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        listing.city?.name ?? 'Maroc',
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                      Row(
                        children: [
                          const Icon(Icons.star,
                              size: 14, color: AppColors.brand),
                          const SizedBox(width: 4),
                          Text('4.9',
                              style: Theme.of(context)
                                  .textTheme
                                  .bodySmall
                                  ?.copyWith(fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: AppDimensions.spaceXs),
                  Text(
                    title,
                    style: Theme.of(context).textTheme.labelMedium,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppDimensions.spaceXs),
                  RichText(
                    text: TextSpan(
                      text: '$price د.م. ',
                      style: Theme.of(context).textTheme.labelMedium?.copyWith(
                            color: AppColors.brand,
                          ),
                      children: [
                        TextSpan(
                          text: unit,
                          style: Theme.of(context).textTheme.bodySmall,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
