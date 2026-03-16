import '../../data/models/message_model.dart';
import '../../data/datasources/messaging_remote_datasource.dart';

abstract class MessagingRepository {
  Future<List<ConversationModel>> getConversations();
  Future<List<MessageModel>> getChatHistory(dynamic userId);
  Future<int> getUnreadCount();
  Future<MessageModel> sendMessage(dynamic receiverId, String content,
      {dynamic listingId});
}

class MessagingRepositoryImpl implements MessagingRepository {
  final MessagingRemoteDataSource _remoteDataSource;

  MessagingRepositoryImpl(this._remoteDataSource);

  @override
  Future<List<ConversationModel>> getConversations() =>
      _remoteDataSource.getConversations();

  @override
  Future<List<MessageModel>> getChatHistory(dynamic userId) =>
      _remoteDataSource.getChatHistory(userId);

  @override
  Future<int> getUnreadCount() => _remoteDataSource.getUnreadCount();

  @override
  Future<MessageModel> sendMessage(dynamic receiverId, String content,
      {dynamic listingId}) {
    return _remoteDataSource.sendMessage(receiverId, content,
        listingId: listingId);
  }
}
