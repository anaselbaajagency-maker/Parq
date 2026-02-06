import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'features/listings/screens/home_screen.dart';
import 'features/auth/screens/login_screen.dart';
import 'features/wallet/screens/wallet_screen.dart';
import 'core/providers/providers.dart';
import 'core/theme/parq_theme.dart';


void main() {
  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Basic routing logic
    return MaterialApp(
      title: 'PARQ Mobile',
      theme: ParqTheme.lightTheme,
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends ConsumerWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authService = ref.watch(authServiceProvider);
    
    return FutureBuilder<bool>(
      future: authService.isLoggedIn(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }
        
        final isLoggedIn = snapshot.data ?? false;
        if (isLoggedIn) {
          return const HomeScreen(); // Or a MainTabController
        } else {
          return const LoginScreen();
        }
      },
    );
  }
}
