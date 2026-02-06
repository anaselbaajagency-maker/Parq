import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/providers.dart';
import '../../../core/theme/parq_theme.dart';
import '../../../widgets/common/parq_components.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: const Text('PARQ', style: TextStyle(color: ParqColors.actionNavy, letterSpacing: 1.2)),
        centerTitle: false,
        actions: const [
          Padding(
            padding: EdgeInsets.only(right: 16.0),
            child: ParqCitySelector(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 32),
            const Text(
              'Que cherchez-vous ?',
              style: TextStyle(
                fontSize: 32,
                fontWeight: FontWeight.w800,
                color: ParqColors.textTitle,
                fontFamily: 'Cairo',
                height: 1.2,
              ),
            ),
            const SizedBox(height: 32),
            
            // Primary CTAs
            ParqButton(
              text: 'Rechercher un service',
              icon: Icons.search_rounded,
              onPressed: () {},
            ),
            const SizedBox(height: 12),
            ParqButton(
              text: 'Publier une annonce',
              isPrimary: false,
              icon: Icons.add_circle_outline,
              onPressed: () async {
                final authService = ref.read(authServiceProvider);
                if (!await authService.isLoggedIn()) {
                  // Redirect logic would go here
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Veuillez vous connecter pour publier')),
                  );
                }
              },
            ),
            
            const SizedBox(height: 48),
            
            // Horizontal Categories
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                CategoryIconPill(label: 'Engins', icon: Icons.construction_rounded, onTap: () {}),
                CategoryIconPill(label: 'Transport', icon: Icons.local_shipping_rounded, onTap: () {}),
                CategoryIconPill(label: 'Chauffeurs', icon: Icons.person_search_rounded, onTap: () {}),
                CategoryIconPill(label: 'Auto', icon: Icons.directions_car_filled_rounded, onTap: () {}),
              ],
            ),
            
            const SizedBox(height: 48),
            
            // Quick Filter Section
            const Text(
              'Filtre Rapide',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: ParqColors.textTitle, fontFamily: 'Cairo'),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: ParqColors.border),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 20, offset: const Offset(0, 8)),
                ],
              ),
              child: Column(
                children: [
                   _FilterDropdown(label: 'Ville', value: 'Casablanca', icon: Icons.location_city),
                   const Divider(height: 32, color: ParqColors.border),
                   _FilterDropdown(label: 'Catégorie', value: 'Engins de terrassement', icon: Icons.category_outlined),
                   const SizedBox(height: 24),
                   ParqButton(
                     text: 'Voir les résultats', 
                     onPressed: () {},
                   ),
                ],
              ),
            ),
            
            const SizedBox(height: 40),
            
            // Trust Signals
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                TrustSignal(label: '+500 engins disponibles', icon: Icons.check_circle),
                SizedBox(width: 24),
                TrustSignal(label: 'Partout au Maroc', icon: Icons.public),
              ],
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }
}

class _FilterDropdown extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;

  const _FilterDropdown({required this.label, required this.value, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, color: ParqColors.actionNavy, size: 20),
        const SizedBox(width: 16),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: const TextStyle(fontSize: 12, color: ParqColors.textBody)),
            Text(value, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: ParqColors.textTitle)),
          ],
        ),
        const Spacer(),
        const Icon(Icons.keyboard_arrow_right, color: ParqColors.border),
      ],
    );
  }
}
