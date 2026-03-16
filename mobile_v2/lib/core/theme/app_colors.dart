import 'package:flutter/material.dart';

class AppColors {
  // Brand Yellow - CTAs only
  static const Color brand = Color(0xFFFFB800);
  static const Color brandHover = Color(0xFFE5A600);

  // Background and Surfaces
  static const Color background = Color(0xFFFFFFFF);
  static const Color backgroundDark =
      Color(0xFF121212); // Extrapolated from typical dark mode
  static const Color surfaceClair = Color(0xFFF9F9F9);

  // Text
  static const Color heading = Color(0xFF222222);
  static const Color headingDark = Color(0xFFF0F0F0);
  static const Color textBody = Color(0xFF717171);
  static const Color textMuted = Color(0xFFB0B0B0);

  // Separators & Borders
  static const Color separator = Color(0xFFF7F7F7);
  static const Color border = Color(0xFFDDDDDD);

  // Semantic Colors
  static const Color error = Color(0xFFDC3545); // Standard semantic
  static const Color success = Color(0xFF28A745);
  static const Color warning = Color(0xFFFFC107);
  static const Color info = Color(0xFF17A2B8);
}
