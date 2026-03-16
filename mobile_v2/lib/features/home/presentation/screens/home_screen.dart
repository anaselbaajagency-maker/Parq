import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../listings/presentation/providers/listing_provider.dart';
import '../../../listings/presentation/widgets/listing_card.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Equivalent of the Next.js `HomeClient.tsx`
    final featuredListingsAsync = ref.watch(featuredListingsProvider);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Simulated Hero Section
          SliverAppBar(
            pinned: true,
            expandedHeight: 340.0,
            backgroundColor: AppColors.heading, // Dark hero mapping
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF222222), Color(0xFF111111)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(AppDimensions.spaceLg, 100,
                    AppDimensions.spaceLg, AppDimensions.spaceLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Text(
                      'Plateforme marocaine de',
                      style: Theme.of(context)
                          .textTheme
                          .bodyLarge
                          ?.copyWith(color: AppColors.background),
                    ),
                    RichText(
                      text: TextSpan(
                        text: "L'Équipement Lourd ",
                        style: Theme.of(context)
                            .textTheme
                            .displayLarge
                            ?.copyWith(color: AppColors.background),
                        children: [
                          TextSpan(
                            text: 'et Transport',
                            style: Theme.of(context)
                                .textTheme
                                .displayLarge
                                ?.copyWith(color: AppColors.brand),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: AppDimensions.spaceLg),
                    Row(
                      children: [
                        Expanded(
                          child: AppButton(
                            text: 'Je veux louer',
                            onPressed: () {},
                          ),
                        ),
                        const SizedBox(width: AppDimensions.spaceMd),
                        Expanded(
                          child: AppButton(
                            text: 'Je veux acheter',
                            isOutlined: true,
                            onPressed: () {},
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Search Bar Overlap
          SliverToBoxAdapter(
            child: Transform.translate(
              offset: const Offset(0, -20),
              child: Container(
                margin: const EdgeInsets.symmetric(
                    horizontal: AppDimensions.spaceLg),
                padding: const EdgeInsets.all(AppDimensions.spaceSm),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        blurRadius: 20,
                        offset: const Offset(0, 5))
                  ],
                ),
                child: Row(
                  children: [
                    const Expanded(
                      child: Padding(
                        padding: EdgeInsets.only(left: AppDimensions.spaceMd),
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Que cherchez-vous ?',
                            border: InputBorder.none,
                            enabledBorder: InputBorder.none,
                            focusedBorder: InputBorder.none,
                            isDense: true,
                          ),
                        ),
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        color: AppColors.brand,
                        borderRadius:
                            BorderRadius.circular(AppDimensions.radiusMd),
                      ),
                      child: IconButton(
                        icon:
                            const Icon(Icons.search, color: AppColors.heading),
                        onPressed: () {},
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Categories horizontal list placeholder
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.spaceLg,
                  vertical: AppDimensions.spaceMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Parcourir par catégorie',
                      style: Theme.of(context).textTheme.displaySmall),
                  const SizedBox(height: AppDimensions.spaceMd),
                  SizedBox(
                    height: 100,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: 5,
                      itemBuilder: (context, index) {
                        return Container(
                          width: 80,
                          margin: const EdgeInsets.only(
                              right: AppDimensions.spaceMd),
                          decoration: BoxDecoration(
                            color: AppColors.surfaceClair,
                            borderRadius:
                                BorderRadius.circular(AppDimensions.radiusMd),
                            border: Border.all(color: AppColors.border),
                          ),
                          child: const Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Icon(Icons.directions_car,
                                  color: AppColors.textBody),
                              SizedBox(height: 8),
                              Text('Catégorie', style: TextStyle(fontSize: 12)),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Featured Listings
          SliverPadding(
            padding: const EdgeInsets.all(AppDimensions.spaceLg),
            sliver: SliverToBoxAdapter(
              child: Text('Annonces à la une',
                  style: Theme.of(context).textTheme.displaySmall),
            ),
          ),

          featuredListingsAsync.when(
            data: (listings) {
              if (listings.isEmpty) {
                return const SliverToBoxAdapter(
                  child: Center(child: Text("Aucune annonce pour le moment.")),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppDimensions.spaceLg),
                sliver: SliverGrid(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    mainAxisSpacing: AppDimensions.spaceMd,
                    crossAxisSpacing: AppDimensions.spaceMd,
                    childAspectRatio:
                        0.75, // Matches the 4/3 image + content mapping
                  ),
                  delegate: SliverChildBuilderDelegate(
                    (context, index) => ListingCard(listing: listings[index]),
                    childCount: listings.length,
                  ),
                ),
              );
            },
            loading: () => const SliverToBoxAdapter(
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, stack) => SliverToBoxAdapter(
              child: Center(child: Text('Erreur: err')),
            ),
          ),

          const SliverToBoxAdapter(
              child: SizedBox(
                  height: AppDimensions.spaceXl * 3)), // Bottom padding
        ],
      ),
    );
  }
}
