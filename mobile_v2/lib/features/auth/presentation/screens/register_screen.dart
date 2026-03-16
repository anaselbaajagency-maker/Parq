import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../../core/providers.dart';
import '../../../../routes/app_router.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _fullNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  String _selectedRole = 'CLIENT';

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleRegister() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authNotifierProvider.notifier).register(
          fullName: _fullNameController.text.trim(),
          email: _emailController.text.trim(),
          password: _passwordController.text,
          role: _selectedRole,
        );

    if (success && mounted) {
      context.go(AppRouter.dashboard);
    } else if (mounted) {
      final error = ref.read(authNotifierProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(error ?? "Erreur d'inscription"),
            backgroundColor: AppColors.error),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Créer un compte'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppDimensions.spaceLg),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Rejoignez-nous',
                style: Theme.of(context).textTheme.displayMedium,
              ),
              const SizedBox(height: AppDimensions.spaceSm),
              Text(
                "Rejoignez notre communauté de location et d'achat.",
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: AppColors.textBody,
                    ),
              ),
              const SizedBox(height: AppDimensions.space2Xl),

              AppTextField(
                label: 'Nom complet',
                controller: _fullNameController,
                keyboardType: TextInputType.name,
              ),
              const SizedBox(height: AppDimensions.spaceLg),

              AppTextField(
                label: 'E-mail',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: AppDimensions.spaceLg),

              AppTextField(
                label: 'Mot de passe',
                controller: _passwordController,
                obscureText: true,
              ),
              const SizedBox(height: AppDimensions.spaceLg),

              // Role Selection
              Text(
                'Je suis un :',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      fontWeight: FontWeight.w600,
                    ),
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppDimensions.spaceMd),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.border),
                  borderRadius: BorderRadius.circular(AppDimensions.radiusMd),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedRole,
                    isExpanded: true,
                    items: const [
                      DropdownMenuItem(
                          value: 'CLIENT',
                          child: Text('Client (Locataire/Acheteur)')),
                      DropdownMenuItem(
                          value: 'PROVIDER',
                          child: Text('Fournisseur (Propriétaire)')),
                      DropdownMenuItem(
                          value: 'DRIVER',
                          child: Text('Chauffeur Professionnel')),
                    ],
                    onChanged: (value) {
                      if (value != null) {
                        setState(() => _selectedRole = value);
                      }
                    },
                  ),
                ),
              ),

              const SizedBox(height: AppDimensions.spaceXl),

              AppButton(
                text: "S'inscrire",
                isLoading: authState.isLoading,
                onPressed: _handleRegister,
              ),

              const SizedBox(height: AppDimensions.spaceXl),
              const Row(
                children: [
                  Expanded(child: Divider()),
                  Padding(
                    padding:
                        EdgeInsets.symmetric(horizontal: AppDimensions.spaceMd),
                    child: Text('ou continuer avec'),
                  ),
                  Expanded(child: Divider()),
                ],
              ),
              const SizedBox(height: AppDimensions.spaceXl),

              AppButton(
                text: 'Continuer avec Google',
                isOutlined: true,
                onPressed: () {
                  // Connect to google sign in flow later
                },
                icon: const Icon(Icons.g_mobiledata, size: 28),
              ),

              const SizedBox(height: AppDimensions.space2Xl),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Vous avez déjà un compte ?'),
                  TextButton(
                    onPressed: () => context.go(AppRouter.login),
                    child: const Text('Connexion',
                        style: TextStyle(
                            fontWeight: FontWeight.bold,
                            color: AppColors.brand)),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
