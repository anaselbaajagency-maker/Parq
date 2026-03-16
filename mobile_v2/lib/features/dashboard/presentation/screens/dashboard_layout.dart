import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../routes/app_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';

// Mirrors 'DashboardLayoutClient.tsx' behavior
class DashboardLayout extends StatefulWidget {
  final Widget child; // The sub-route screen

  const DashboardLayout({super.key, required this.child});

  @override
  State<DashboardLayout> createState() => _DashboardLayoutState();
}

class _DashboardLayoutState extends State<DashboardLayout> {
  int _currentIndex = 0;

  void _onNavigation(int index) {
    setState(() => _currentIndex = index);

    // Map index to routes roughly matching Next.js App Router subdirectories
    switch (index) {
      case 0:
        context.go(AppRouter.dashboard);
        break;
      case 1:
        // context.go(AppRouter.myListings);
        break;
      case 2:
        context.go(AppRouter.wallet);
        break;
      case 3:
        context.go(AppRouter.profile);
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.child,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: AppColors.border, width: 1)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onNavigation,
          type: BottomNavigationBarType.fixed, // Needed > 3 items
          selectedItemColor: AppColors.brand,
          unselectedItemColor: AppColors.textMuted,
          selectedLabelStyle: TextStyle(
              fontWeight: FontWeight.w600,
              fontSize: AppDimensions.spaceSm * 1.5),
          unselectedLabelStyle:
              TextStyle(fontSize: AppDimensions.spaceSm * 1.5),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.dashboard_outlined),
              activeIcon: Icon(Icons.dashboard),
              label: 'Tableau de bord',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.list_alt),
              activeIcon: Icon(Icons.list),
              label: 'Annonces',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.account_balance_wallet_outlined),
              activeIcon: Icon(Icons.account_balance_wallet),
              label: 'Portefeuille',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profil',
            ),
          ],
        ),
      ),
    );
  }
}
