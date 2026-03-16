import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../../core/providers.dart';
import '../../../../routes/app_router.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    final success = await ref.read(authNotifierProvider.notifier).login(
          _emailController.text.trim(),
          _passwordController.text,
        );

    if (success && mounted) {
      context.go(AppRouter.dashboard);
    } else if (mounted) {
      final error = ref.read(authNotifierProvider).error;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
            content: Text(error ?? 'Erreur de connexion'),
            backgroundColor: AppColors.error),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Connexion'),
        leading: IconButton(
          icon: const Icon(Icons.close),
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
                'Bon retour',
                style: Theme.of(context).textTheme.displayMedium,
              ),
              const SizedBox(height: AppDimensions.spaceSm),
              Text(
                'Connectez-vous pour gérer vos annonces et réservations.',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                      color: AppColors.textBody,
                    ),
              ),
              const SizedBox(height: AppDimensions.space2Xl),
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
              Align(
                alignment: Alignment.centerRight,
                child: TextButton(
                  onPressed: () {},
                  child: const Text('Mot de passe oublié ?',
                      style: TextStyle(color: AppColors.textBody)),
                ),
              ),
              const SizedBox(height: AppDimensions.spaceLg),
              AppButton(
                text: 'Se connecter',
                isLoading: authState.isLoading,
                onPressed: _handleLogin,
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
                  const Text("Vous n'avez pas de compte ?"),
                  TextButton(
                    onPressed: () => context.go(AppRouter.register),
                    child: const Text('Inscrivez-vous',
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
