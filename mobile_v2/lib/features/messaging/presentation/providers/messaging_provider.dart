import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/providers.dart';
import '../../data/datasources/messaging_remote_datasource.dart';
import '../../domain/repositories/messaging_repository.dart';
import '../../data/models/message_model.dart';

final messagingRemoteDataSourceProvider =
    Provider<MessagingRemoteDataSource>((ref) {
  final apiClient = ref.watch(apiClientProvider);
  return MessagingRemoteDataSource(apiClient);
});

final messagingRepositoryProvider = Provider<MessagingRepository>((ref) {
  final remoteDataSource = ref.watch(messagingRemoteDataSourceProvider);
  return MessagingRepositoryImpl(remoteDataSource);
});

final conversationsProvider = FutureProvider<List<ConversationModel>>((ref) {
  final repository = ref.watch(messagingRepositoryProvider);
  return repository.getConversations();
});

final chatHistoryProvider =
    FutureProvider.family<List<MessageModel>, dynamic>((ref, userId) {
  final repository = ref.watch(messagingRepositoryProvider);
  return repository.getChatHistory(userId);
});

final unreadMessagesCountProvider = FutureProvider<int>((ref) {
  final repository = ref.watch(messagingRepositoryProvider);
  return repository.getUnreadCount();
});
