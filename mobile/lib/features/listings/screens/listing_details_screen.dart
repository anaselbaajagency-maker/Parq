import 'package:flutter/material.dart';
import '../models/listing.dart';
import '../../../core/theme/parq_theme.dart';
import '../../../widgets/common/parq_components.dart';

class ListingDetailsScreen extends StatelessWidget {
  final Listing listing;
  const ListingDetailsScreen({super.key, required this.listing});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: CircleAvatar(
          backgroundColor: Colors.white.withOpacity(0.8),
          child: const BackButton(color: ParqColors.actionNavy),
        ),
        actions: [
          CircleAvatar(
            backgroundColor: Colors.white.withOpacity(0.8),
            child: IconButton(icon: const Icon(Icons.share_outlined, color: ParqColors.actionNavy), onPressed: () {}),
          ),
          const SizedBox(width: 8),
          CircleAvatar(
            backgroundColor: Colors.white.withOpacity(0.8),
            child: IconButton(icon: const Icon(Icons.favorite_border, color: ParqColors.actionNavy), onPressed: () {}),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Full-width Image Header
            Container(
              height: 350,
              width: double.infinity,
              decoration: BoxDecoration(
                image: DecorationImage(
                  image: NetworkImage(listing.images.isNotEmpty 
                    ? listing.images.first.url 
                    : 'https://via.placeholder.com/800x600'),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          listing.title,
                          style: const TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: ParqColors.textTitle, fontFamily: 'Cairo'),
                        ),
                      ),
                      Text(
                        '${listing.price.toInt()} SD',
                        style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: ParqColors.textTitle),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.location_on_outlined, color: ParqColors.textBody, size: 16),
                      const SizedBox(width: 4),
                      Text(listing.city?.name ?? 'Maroc', style: const TextStyle(color: ParqColors.textBody, fontSize: 14)),
                    ],
                  ),
                  const Divider(height: 48, color: ParqColors.border),
                  const Text(
                    'Information sur l\'annonce',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: ParqColors.textTitle, fontFamily: 'Cairo'),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    listing.description ?? 'Pas de description fournie.',
                    style: const TextStyle(fontSize: 16, color: ParqColors.textBody, height: 1.5),
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'Contact',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: ParqColors.textTitle, fontFamily: 'Cairo'),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const CircleAvatar(radius: 20, backgroundColor: ParqColors.surface, child: Icon(Icons.person, color: ParqColors.actionNavy)),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(listing.user?.fullName ?? 'Propriétaire', style: const TextStyle(fontWeight: FontWeight.bold, color: ParqColors.textTitle)),
                          const Text('Répond généralement en 1h', style: TextStyle(color: ParqColors.textBody, fontSize: 12)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 100), // Spacing for footer
                ],
              ),
            ),
          ],
        ),
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(top: BorderSide(color: ParqColors.border)),
        ),
        child: Row(
          children: [
            Expanded(
              child: ParqButton(
                text: 'Appeler',
                isPrimary: false,
                onPressed: () {},
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: ParqButton(
                text: 'WhatsApp',
                onPressed: () {},
              ),
            ),
          ],
        ),
      ),
    );
  }
}
