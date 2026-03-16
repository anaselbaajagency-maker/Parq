import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tableau de bord'),
        actions: [
          IconButton(
            icon: const Badge(
              label: Text('3'),
              child: Icon(Icons.notifications_none),
            ),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.spaceLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Aperçu', style: Theme.of(context).textTheme.displaySmall),
            const SizedBox(height: AppDimensions.spaceLg),

            // Stats Grid replacing Next.js custom Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: AppDimensions.spaceMd,
              mainAxisSpacing: AppDimensions.spaceMd,
              childAspectRatio: 1.5,
              children: [
                _buildStatCard(context, 'Annonces actives', '12', Icons.list),
                _buildStatCard(
                    context, 'Vues totales', '845', Icons.visibility_outlined),
                _buildStatCard(
                    context, 'Messages', '5', Icons.chat_bubble_outline),
                _buildStatCard(context, 'Solde', '1 250 د.م.',
                    Icons.account_balance_wallet_outlined,
                    isBrand: true),
              ],
            ),

            const SizedBox(height: AppDimensions.space2Xl),
            Text('Activité récente',
                style: Theme.of(context).textTheme.displaySmall),
            const SizedBox(height: AppDimensions.spaceMd),

            // Empty placeholder for table mappings
            Container(
              padding: const EdgeInsets.all(AppDimensions.spaceLg),
              decoration: BoxDecoration(
                color: AppColors.surfaceClair,
                borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                border: Border.all(color: AppColors.border),
              ),
              child: const Center(
                child: Text('Aucune activité récente',
                    style: TextStyle(color: AppColors.textMuted)),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildStatCard(
      BuildContext context, String title, String value, IconData icon,
      {bool isBrand = false}) {
    return Container(
      padding: const EdgeInsets.all(AppDimensions.spaceMd),
      decoration: BoxDecoration(
        color:
            isBrand ? AppColors.brand.withOpacity(0.1) : AppColors.background,
        borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
        border: Border.all(color: isBrand ? AppColors.brand : AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon,
                  size: 20,
                  color: isBrand ? AppColors.brand : AppColors.textBody),
              const SizedBox(width: 8),
              Expanded(
                  child: Text(title,
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color:
                              isBrand ? AppColors.brand : AppColors.textBody),
                      overflow: TextOverflow.ellipsis)),
            ],
          ),
          const SizedBox(height: 8),
          Text(value,
              style: Theme.of(context).textTheme.displaySmall?.copyWith(
                  fontSize: 22,
                  color: isBrand ? AppColors.brand : AppColors.heading)),
        ],
      ),
    );
  }
}
