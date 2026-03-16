class ApiEndpoints {
  // Use 10.0.2.2 for Android emulator, localhost for iOS simulator, or IP for physical
  static const String baseUrl = 'http://10.0.2.2:8000/api/v1';

  // Auth
  static const String login = '/login';
  static const String register = '/register';
  static const String googleLogin = '/auth/google-login';
  static const String logout = '/logout';
  static const String sendOtp =
      '/auth/otp/send'; // As identified in older Flutter layout
  static const String verifyOtp = '/auth/otp/verify';
  static const String profile = '/user'; // Uses sanctum Token

  // Listings
  static const String listings = '/listings';
  static const String listingsFeatured = '/listings?sort=featured&limit=4';
  static String toggleFavorite(dynamic id) => '/listings/$id/favorite';
  static String pauseListing(dynamic id) => '/listings/$id/pause';
  static String listingDetail(dynamic id) => '/listings/$id';

  // Categories & Cities (Common)
  static const String categories = '/categories';
  static const String homepageCategories = '/categories/homepage';
  static const String cities = '/cities';

  // Wallet
  static const String walletBalance = '/wallet/balance';
  static const String walletTransactions = '/wallet/transactions';
  static const String walletTopup = '/wallet/topup';
  static const String walletPaymentMethods = '/wallet/payment-methods';
  static const String walletRedeemCoupon = '/wallet/redeem-coupon';
  static String uploadProof(dynamic requestId) =>
      '/wallet/topup/$requestId/proof';

  // Messaging
  static const String messages = '/messages';
  static const String unreadCount = '/messages/unread-count';
  static String chatHistory(dynamic userId) => '/messages/$userId';
}
