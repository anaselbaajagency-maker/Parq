import 'package:flutter/material.dart';
import '../../core/theme/parq_theme.dart';

class ParqButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;
  final bool isPrimary;
  final bool isLoading;
  final IconData? icon;

  const ParqButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.isPrimary = true,
    this.isLoading = false,
    this.icon,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: isPrimary ? ParqColors.actionNavy : Colors.white,
          foregroundColor: isPrimary ? Colors.white : ParqColors.actionNavy,
          side: isPrimary ? null : const BorderSide(color: ParqColors.border),
          padding: const EdgeInsets.symmetric(vertical: 18),
        ),
        child: isLoading
            ? const SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (icon != null) ...[
                    Icon(icon, size: 20),
                    const SizedBox(width: 8),
                  ],
                  Text(text, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                ],
              ),
      ),
    );
  }
}

class ParqCitySelector extends StatelessWidget {
  final String selectedCity;
  const ParqCitySelector({super.key, this.selectedCity = 'Toute le Maroc'});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: ParqColors.surface,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.location_on_outlined, size: 14, color: ParqColors.actionNavy),
          const SizedBox(width: 4),
          Text(
            selectedCity,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: ParqColors.actionNavy),
          ),
          const Icon(Icons.keyboard_arrow_down, size: 14, color: ParqColors.actionNavy),
        ],
      ),
    );
  }
}

class TrustSignal extends StatelessWidget {
  final String label;
  final IconData icon;

  const TrustSignal({super.key, required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: Colors.green),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(fontSize: 12, color: ParqColors.textBody, fontWeight: FontWeight.w500),
        ),
      ],
    );
  }
}

class CategoryIconPill extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;

  const CategoryIconPill({
    super.key,
    required this.label,
    required this.icon,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: ParqColors.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: ParqColors.border.withOpacity(0.5)),
            ),
            child: Icon(icon, color: ParqColors.actionNavy, size: 30),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: ParqColors.textTitle,
              fontFamily: 'Cairo',
            ),
          ),
        ],
      ),
    );
  }
}
