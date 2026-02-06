import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/providers.dart';
import '../../../core/theme/parq_theme.dart';
import '../../../widgets/common/parq_components.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _phoneController = TextEditingController();
  bool _isLoading = false;

  void _handleLogin() async {
    if (_phoneController.text.length < 10) return;
    
    setState(() => _isLoading = true);
    final authService = ref.read(authServiceProvider);
    final success = await authService.sendOtp(_phoneController.text);
    setState(() => _isLoading = false);

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Code de vérification envoyé !')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Erreur lors de l\'envoi du code')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 32.0, vertical: 48.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Connexion',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                  color: ParqColors.textTitle,
                  fontFamily: 'Cairo',
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Entrez votre numéro de téléphone pour continuer.',
                style: TextStyle(color: ParqColors.textBody, fontSize: 16),
              ),
              const SizedBox(height: 48),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: ParqColors.border),
                ),
                child: TextField(
                  controller: _phoneController,
                  keyboardType: TextInputType.phone,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                  decoration: const InputDecoration(
                    labelText: 'Numéro de téléphone',
                    labelStyle: TextStyle(fontWeight: FontWeight.normal, fontSize: 14),
                    prefixText: '+212  ',
                    border: InputBorder.none,
                    floatingLabelBehavior: FloatingLabelBehavior.always,
                  ),
                ),
              ),
              const SizedBox(height: 32),
              ParqButton(
                text: 'Continuer',
                isLoading: _isLoading,
                onPressed: _handleLogin,
              ),
              const Spacer(),
              const Center(
                child: Text(
                  'En continuant, vous acceptez nos Conditions d\'utilisation.',
                  style: TextStyle(color: ParqColors.textBody, fontSize: 12),
                  textAlign: TextAlign.center,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
