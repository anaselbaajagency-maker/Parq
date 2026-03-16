import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_ar.dart';
import 'app_localizations_fr.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('ar'),
    Locale('fr')
  ];

  /// No description provided for @home.
  ///
  /// In fr, this message translates to:
  /// **'Accueil'**
  String get home;

  /// No description provided for @rent.
  ///
  /// In fr, this message translates to:
  /// **'Louer'**
  String get rent;

  /// No description provided for @buy.
  ///
  /// In fr, this message translates to:
  /// **'Acheter'**
  String get buy;

  /// No description provided for @listItem.
  ///
  /// In fr, this message translates to:
  /// **'Ajouter votre annonce'**
  String get listItem;

  /// No description provided for @login.
  ///
  /// In fr, this message translates to:
  /// **'Connexion'**
  String get login;

  /// No description provided for @signup.
  ///
  /// In fr, this message translates to:
  /// **'Inscription'**
  String get signup;

  /// No description provided for @dashboard.
  ///
  /// In fr, this message translates to:
  /// **'Tableau de bord'**
  String get dashboard;

  /// No description provided for @myListings.
  ///
  /// In fr, this message translates to:
  /// **'Mes annonces'**
  String get myListings;

  /// No description provided for @adminDashboard.
  ///
  /// In fr, this message translates to:
  /// **'Administrateur'**
  String get adminDashboard;

  /// No description provided for @logout.
  ///
  /// In fr, this message translates to:
  /// **'Déconnexion'**
  String get logout;

  /// No description provided for @helpCenter.
  ///
  /// In fr, this message translates to:
  /// **'Centre d\'aide'**
  String get helpCenter;

  /// No description provided for @heroTitle.
  ///
  /// In fr, this message translates to:
  /// **'La Prime d\''**
  String get heroTitle;

  /// No description provided for @heroTitleAccent.
  ///
  /// In fr, this message translates to:
  /// **'Excellence'**
  String get heroTitleAccent;

  /// No description provided for @heroSubtitle.
  ///
  /// In fr, this message translates to:
  /// **'Plateforme centralisée et sécurisée pour la gestion de votre flotte et la location.'**
  String get heroSubtitle;

  /// No description provided for @btnRent.
  ///
  /// In fr, this message translates to:
  /// **'Je veux louer'**
  String get btnRent;

  /// No description provided for @btnBuy.
  ///
  /// In fr, this message translates to:
  /// **'Je veux acheter'**
  String get btnBuy;

  /// No description provided for @searchPlaceholder.
  ///
  /// In fr, this message translates to:
  /// **'Que cherchez-vous ?'**
  String get searchPlaceholder;

  /// No description provided for @loginTitle.
  ///
  /// In fr, this message translates to:
  /// **'Bon retour'**
  String get loginTitle;

  /// No description provided for @loginSubtitle.
  ///
  /// In fr, this message translates to:
  /// **'Connectez-vous pour gérer vos annonces et réservations.'**
  String get loginSubtitle;

  /// No description provided for @emailLabel.
  ///
  /// In fr, this message translates to:
  /// **'E-mail'**
  String get emailLabel;

  /// No description provided for @passwordLabel.
  ///
  /// In fr, this message translates to:
  /// **'Mot de passe'**
  String get passwordLabel;

  /// No description provided for @forgotPassword.
  ///
  /// In fr, this message translates to:
  /// **'Mot de passe oublié ?'**
  String get forgotPassword;

  /// No description provided for @loginBtn.
  ///
  /// In fr, this message translates to:
  /// **'Se connecter'**
  String get loginBtn;

  /// No description provided for @loggingIn.
  ///
  /// In fr, this message translates to:
  /// **'Connexion en cours...'**
  String get loggingIn;

  /// No description provided for @continueGoogle.
  ///
  /// In fr, this message translates to:
  /// **'Continuer avec Google'**
  String get continueGoogle;

  /// No description provided for @noAccount.
  ///
  /// In fr, this message translates to:
  /// **'Vous n\'avez pas de compte ?'**
  String get noAccount;

  /// No description provided for @signupLink.
  ///
  /// In fr, this message translates to:
  /// **'Inscrivez-vous'**
  String get signupLink;

  /// No description provided for @walletTitle.
  ///
  /// In fr, this message translates to:
  /// **'Mon Portefeuille'**
  String get walletTitle;

  /// No description provided for @currentBalance.
  ///
  /// In fr, this message translates to:
  /// **'Solde Actuel'**
  String get currentBalance;

  /// No description provided for @dailyExpense.
  ///
  /// In fr, this message translates to:
  /// **'Dépense Quotidienne'**
  String get dailyExpense;

  /// No description provided for @topUp.
  ///
  /// In fr, this message translates to:
  /// **'Recharger le compte'**
  String get topUp;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['ar', 'fr'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'ar':
      return AppLocalizationsAr();
    case 'fr':
      return AppLocalizationsFr();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
