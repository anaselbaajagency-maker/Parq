import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/widgets/app_button.dart';
import '../../presentation/providers/wallet_provider.dart';

class WalletScreen extends ConsumerWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final balanceAsync = ref.watch(walletBalanceProvider);
    // Passing no params defaults to page 1 limit 10 based on Next logic
    final transactionsAsync = ref.watch(walletTransactionsProvider({}));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Mon Portefeuille'),
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.spaceLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Balance Card
            balanceAsync.when(
              data: (balance) => Container(
                padding: const EdgeInsets.all(AppDimensions.spaceXl),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [AppColors.heading, Color(0xFF333333)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusLg),
                  boxShadow: [
                    BoxShadow(
                      color: AppColors.heading.withOpacity(0.2),
                      blurRadius: 15,
                      offset: const Offset(0, 5),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Solde actuel',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            color: Colors.white70,
                          ),
                    ),
                    const SizedBox(height: AppDimensions.spaceSm),
                    Text(
                      '${balance.balance} د.م.',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(
                            color: Colors.white,
                            fontSize: 36,
                          ),
                    ),
                    const SizedBox(height: AppDimensions.spaceLg),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildMiniStat('Dépense jour',
                            '${balance.dailyExpense} د.م.', context),
                        _buildMiniStat('Jours restants',
                            '${balance.daysRemaining}', context),
                      ],
                    ),
                    const SizedBox(height: AppDimensions.spaceLg),
                    SizedBox(
                      width: double.infinity,
                      child: AppButton(
                        text: 'Recharger le compte',
                        onPressed: () {
                          // Open topup bottom sheet
                        },
                      ),
                    )
                  ],
                ),
              ),
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) =>
                  Center(child: Text('Erreur chargement solde: err')),
            ),

            const SizedBox(height: AppDimensions.space2Xl),
            Text(
              'Historique des transactions',
              style: Theme.of(context).textTheme.displaySmall,
            ),
            const SizedBox(height: AppDimensions.spaceLg),

            // Transactions List
            transactionsAsync.when(
              data: (transactions) {
                if (transactions.isEmpty) {
                  return Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(AppDimensions.spaceXl),
                    decoration: BoxDecoration(
                      color: AppColors.surfaceClair,
                      borderRadius:
                          BorderRadius.circular(AppDimensions.radiusLg),
                      border: Border.all(color: AppColors.border),
                    ),
                    child: const Column(
                      children: [
                        Icon(Icons.history_toggle_off,
                            size: 48, color: AppColors.textMuted),
                        SizedBox(height: AppDimensions.spaceMd),
                        Text('Aucune transaction trouvée',
                            style: TextStyle(color: AppColors.textBody)),
                      ],
                    ),
                  );
                }

                return ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: transactions.length,
                  separatorBuilder: (context, index) => const Divider(),
                  itemBuilder: (context, index) {
                    final tx = transactions[index];
                    final isPositive = tx.type == 'topup' || tx.type == 'bonus';

                    return ListTile(
                      contentPadding: EdgeInsets.zero,
                      leading: CircleAvatar(
                        backgroundColor: isPositive
                            ? AppColors.success.withOpacity(0.1)
                            : AppColors.error.withOpacity(0.1),
                        child: Icon(
                          isPositive
                              ? Icons.arrow_downward
                              : Icons.arrow_upward,
                          color:
                              isPositive ? AppColors.success : AppColors.error,
                        ),
                      ),
                      title: Text(tx.description ?? 'Transaction',
                          style: const TextStyle(fontWeight: FontWeight.w600)),
                      subtitle: Text(tx.createdAt ?? '',
                          style: const TextStyle(fontSize: 12)),
                      trailing: Text(
                        '${isPositive ? "+" : "-"}${tx.amount} د.م.',
                        style: TextStyle(
                          color: isPositive
                              ? AppColors.success
                              : AppColors.heading,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(child: Text('Erreur: err')),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMiniStat(String label, String value, BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: Theme.of(context)
              .textTheme
              .bodySmall
              ?.copyWith(color: Colors.white70),
        ),
        Text(
          value,
          style: Theme.of(context)
              .textTheme
              .labelMedium
              ?.copyWith(color: Colors.white),
        ),
      ],
    );
  }
}
