import '../../../../core/network/api_client.dart';
import '../../../../core/network/api_endpoints.dart';
import '../models/message_model.dart';

class MessagingRemoteDataSource {
  final ApiClient _apiClient;

  MessagingRemoteDataSource(this._apiClient);

  Future<List<ConversationModel>> getConversations() async {
    final response = await _apiClient.get(ApiEndpoints.messages);
    final List<dynamic> data = response.data['data'] ?? [];
    return data.map((json) => ConversationModel.fromJson(json)).toList();
  }

  Future<List<MessageModel>> getChatHistory(dynamic userId) async {
    final response = await _apiClient.get(ApiEndpoints.chatHistory(userId));
    final List<dynamic> data = response.data['data'] ?? [];
    return data.map((json) => MessageModel.fromJson(json)).toList();
  }

  Future<int> getUnreadCount() async {
    final response = await _apiClient.get(ApiEndpoints.unreadCount);
    return response.data['unread_count'] ?? 0;
  }

  Future<MessageModel> sendMessage(dynamic receiverId, String content,
      {dynamic listingId}) async {
    final data = <String, dynamic>{
      'receiver_id': receiverId,
      'content': content,
    };
    if (listingId != null) data['listing_id'] = listingId;

    final response = await _apiClient.post(ApiEndpoints.messages, data: data);
    return MessageModel.fromJson(response.data);
  }
}
