import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/wallet_models.dart';
import '../services/wallet_service.dart';
import '../../../core/providers/providers.dart';
import '../../../core/theme/parq_theme.dart';
import '../../../widgets/common/parq_components.dart';

class WalletScreen extends ConsumerWidget {
  const WalletScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final walletService = ref.watch(walletServiceProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Portefeuille'),
        backgroundColor: ParqColors.actionNavy,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(32),
            decoration: const BoxDecoration(
              color: ParqColors.actionNavy,
              borderRadius: BorderRadius.vertical(bottom: Radius.circular(32)),
            ),
            child: Column(
              children: [
                const Text(
                  'Solde disponible',
                  style: TextStyle(color: Colors.white70, fontSize: 14),
                ),
                const SizedBox(height: 12),
                FutureBuilder<Wallet>(
                  future: walletService.getBalance(),
                  builder: (context, snapshot) {
                    final balance = snapshot.data?.balance ?? 0;
                    return Text(
                      '${balance.toInt()} SD',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 48,
                        fontWeight: FontWeight.w800,
                        fontFamily: 'Cairo',
                      ),
                    );
                  },
                ),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    _ActionIcon(icon: Icons.add_rounded, label: 'Recharger'),
                    const SizedBox(width: 48),
                    _ActionIcon(icon: Icons.history_rounded, label: 'Historique'),
                  ],
                ),
              ],
            ),
          ),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Dernières transactions',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: ParqColors.textTitle),
                  ),
                  const SizedBox(height: 16),
                  FutureBuilder<List<Transaction>>(
                    future: walletService.getTransactions(),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(child: CircularProgressIndicator());
                      }
                      final txs = snapshot.data ?? [];
                      if (txs.isEmpty) {
                        return const Center(child: Text('Aucune transaction récente'));
                      }
                      return ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: txs.length,
                        separatorBuilder: (_, __) => const Divider(color: ParqColors.border, height: 32),
                        itemBuilder: (context, index) {
                          final tx = txs[index];
                          final isCredit = tx.amount > 0;
                          return Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: isCredit ? Colors.green.withOpacity(0.1) : Colors.red.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Icon(
                                  isCredit ? Icons.arrow_downward_rounded : Icons.arrow_upward_rounded,
                                  color: isCredit ? Colors.green : Colors.red,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      tx.typeLabel ?? tx.type,
                                      style: const TextStyle(fontWeight: FontWeight.bold, color: ParqColors.textTitle),
                                    ),
                                    Text(
                                      tx.createdAt.toIso8601String().substring(0, 10),
                                      style: const TextStyle(color: ParqColors.textBody, fontSize: 13),
                                    ),
                                  ],
                                ),
                              ),
                              Text(
                                '${isCredit ? "+" : ""}${tx.amount} SD',
                                style: TextStyle(
                                  fontWeight: FontWeight.w800,
                                  color: isCredit ? Colors.green : ParqColors.textTitle,
                                ),
                              ),
                            ],
                          );
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ActionIcon extends StatelessWidget {
  final IconData icon;
  final String label;

  const _ActionIcon({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white24),
          ),
          child: Icon(icon, color: Colors.white),
        ),
        const SizedBox(height: 8),
        Text(label, style: const TextStyle(color: Colors.white70, fontSize: 12)),
      ],
    );
  }
}
