import 'package:flutter/material.dart';

class ParqColors {
  static const Color primary = Color(0xFFFFD700); // Gold
  static const Color actionNavy = Color(0xFF0F172A); // Navy
  static const Color background = Colors.white;
  static const Color surface = Color(0xFFF7F7F7);
  static const Color textBody = Color(0xFF717171);
  static const Color textTitle = Color(0xFF222222);
  static const Color border = Color(0xFFE2E8F0);
}

class ParqTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: ParqColors.background,
      colorScheme: ColorScheme.fromSeed(
        seedColor: ParqColors.actionNavy,
        primary: ParqColors.actionNavy,
        secondary: ParqColors.primary,
        surface: ParqColors.background,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: ParqColors.background,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: ParqColors.textTitle,
          fontSize: 20,
          fontWeight: FontWeight.w800,
          fontFamily: 'Cairo', // Falling back to system if not found
        ),
        iconTheme: IconThemeData(color: ParqColors.actionNavy),
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          color: ParqColors.textTitle,
          fontSize: 32,
          fontWeight: FontWeight.w800,
          fontFamily: 'Cairo',
        ),
        headlineMedium: TextStyle(
          color: ParqColors.textTitle,
          fontSize: 24,
          fontWeight: FontWeight.w700,
          fontFamily: 'Cairo',
        ),
        bodyLarge: TextStyle(
          color: ParqColors.textBody,
          fontSize: 16,
          fontWeight: FontWeight.w400,
          fontFamily: 'Almarai',
        ),
        bodyMedium: TextStyle(
          color: ParqColors.textBody,
          fontSize: 14,
          fontWeight: FontWeight.w400,
          fontFamily: 'Almarai',
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: ParqColors.actionNavy,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            fontFamily: 'Cairo',
          ),
        ),
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: ParqColors.background,
        selectedItemColor: ParqColors.actionNavy,
        unselectedItemColor: ParqColors.textBody,
        elevation: 8,
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
