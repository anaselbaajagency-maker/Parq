import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'routes/app_router.dart';
import 'core/theme/app_theme.dart';
import 'core/l10n/generated/app_localizations.dart';

// Provides the current locale setup.
final localeProvider = StateProvider<Locale>((ref) {
  // Ideally, load from SharedPreferences (LocalStorage) on init
  return const Locale('fr');
});

class ParqApp extends ConsumerWidget {
  const ParqApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = AppRouter.createRouter(ref);
    final currentLocale = ref.watch(localeProvider);

    return MaterialApp.router(
      title: 'PARQ V2',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      // darkTheme: AppTheme.darkTheme,
      // themeMode: ThemeMode.system, // To support dynamic themes if added later
      locale: currentLocale,
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: const [
        Locale('fr'), // French
        Locale('ar'), // Arabic
      ],
      routerConfig: router,
    );
  }
}
