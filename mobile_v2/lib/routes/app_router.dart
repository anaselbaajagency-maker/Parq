import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/screens/login_screen.dart';
import '../features/auth/presentation/screens/register_screen.dart';
import '../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../features/dashboard/presentation/screens/dashboard_layout.dart';
import '../features/dashboard/presentation/screens/profile_screen.dart';
import '../features/home/presentation/screens/home_screen.dart';
import '../features/wallet/presentation/screens/wallet_screen.dart';
import '../features/listings/presentation/screens/listing_detail_screen.dart';
import '../features/messaging/presentation/screens/inbox_screen.dart';
import '../core/providers.dart';

class AppRouter {
  static const String home = '/';
  static const String login = '/login';
  static const String register = '/register';
  static const String dashboard = '/dashboard';
  static const String profile = '/profile';
  static const String wallet = '/wallet';
  static const String inbox = '/inbox';
  static const String listingDetail = '/listing/:id';

  static GoRouter createRouter(WidgetRef ref) {
    return GoRouter(
      initialLocation: home,
      redirect: (context, state) {
        final authState = ref.read(authNotifierProvider);
        final isAuth = authState.isAuthenticated;
        final isAuthRoute =
            state.uri.path == login || state.uri.path == register;

        if (!isAuth && !isAuthRoute && state.uri.path != home) {
          return login;
        }

        if (isAuth && isAuthRoute) {
          return dashboard;
        }

        return null;
      },
      routes: [
        GoRoute(
          path: home,
          builder: (context, state) => const HomeScreen(),
        ),
        GoRoute(
          path: login,
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: register,
          builder: (context, state) => const RegisterScreen(),
        ),
        GoRoute(
          path: listingDetail,
          builder: (context, state) {
            final id = state.pathParameters['id']!;
            return ListingDetailScreen(listingId: id);
          },
        ),
        // Nested routes logically sharing the dashboard bottom navigation
        ShellRoute(
          builder: (context, state, child) => DashboardLayout(child: child),
          routes: [
            GoRoute(
              path: dashboard,
              builder: (context, state) => const DashboardScreen(),
            ),
            GoRoute(
              path: wallet,
              builder: (context, state) => const WalletScreen(),
            ),
            GoRoute(
              path: profile,
              builder: (context, state) => const ProfileScreen(),
            ),
            GoRoute(
              path: inbox,
              builder: (context, state) => const InboxScreen(),
            ),
          ],
        ),
      ],
    );
  }
}
