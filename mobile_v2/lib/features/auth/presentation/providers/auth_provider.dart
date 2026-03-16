import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../data/models/user_model.dart';
// Note: Real implementation needs DI (Dependency Injection) or global provider setup for repository. We will define providers in core/providers.dart later.

// Define a simpler state matching Zustand's store
class AuthState {
  final UserModel? user;
  final bool isAuthenticated;
  final bool isLoading;
  final String? error;

  AuthState({
    this.user,
    this.isAuthenticated = false,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    UserModel? user,
    bool? isAuthenticated,
    bool? isLoading,
    String? error,
  }) {
    return AuthState(
      user: user ?? this.user,
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      error: error, // Can be null intentionally to clear errors
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(AuthState(isLoading: true)) {
    _init();
  }

  Future<void> _init() async {
    // Listen to repository stream
    _repository.authStateChanges.listen((user) {
      if (mounted) {
        state = state.copyWith(
          user: user,
          isAuthenticated: user != null,
          isLoading: false,
        );
      }
    });

    // Check initial status
    final isAuth = await _repository.checkAuthStatus();
    final user = await _repository.getCachedUser();

    if (mounted) {
      state = state.copyWith(
        user: user,
        isAuthenticated: isAuth,
        isLoading: false,
      );
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.login(email, password);
      // State is updated by stream listener automatically
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
    required String role,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.register(
        fullName: fullName,
        email: email,
        password: password,
        role: role,
      );
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<bool> googleLogin({
    required String email,
    required String googleId,
    required String fullName,
    required String avatar,
  }) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      await _repository.googleLogin(
          email: email, googleId: googleId, fullName: fullName, avatar: avatar);
      return true;
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
      return false;
    }
  }

  Future<void> logout() async {
    state = state.copyWith(isLoading: true);
    await _repository.logout();
    state =
        state.copyWith(isLoading: false, isAuthenticated: false, user: null);
  }
}
