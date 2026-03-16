import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTypography {
  // Using Cairo as default from globals.css
  static TextTheme textTheme = GoogleFonts.cairoTextTheme().copyWith(
    displayLarge: GoogleFonts.cairo(
      fontSize: 32, // 2rem
      fontWeight: FontWeight.w700,
      color: AppColors.heading,
      height: 1.3,
    ),
    displayMedium: GoogleFonts.cairo(
      fontSize: 24, // 1.5rem
      fontWeight: FontWeight.w700,
      color: AppColors.heading,
      height: 1.3,
    ),
    displaySmall: GoogleFonts.cairo(
      fontSize: 20, // 1.25rem
      fontWeight: FontWeight.w700,
      color: AppColors.heading,
      height: 1.3,
    ),
    bodyLarge: GoogleFonts.cairo(
      fontSize: 16, // 1rem
      fontWeight: FontWeight.w400,
      color: AppColors.textBody,
      height: 1.6,
    ),
    bodyMedium: GoogleFonts.cairo(
      fontSize: 14, // 0.875rem
      fontWeight: FontWeight.w400,
      color: AppColors.textBody,
      height: 1.6,
    ),
    bodySmall: GoogleFonts.cairo(
      fontSize: 12, // 0.75em
      fontWeight: FontWeight.w400,
      color: AppColors.textMuted,
      height: 1.6,
    ),
    labelLarge: GoogleFonts.cairo(
      fontSize: 16,
      fontWeight: FontWeight.w600, // For buttons
      color: AppColors.heading,
      height: 1.6,
    ),
    labelMedium: GoogleFonts.cairo(
      fontSize: 14,
      fontWeight: FontWeight.w500, // Secondary buttons
      color: AppColors.heading,
      height: 1.6,
    ),
  );
}
