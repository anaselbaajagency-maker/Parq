import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_dimensions.dart';
import '../providers/messaging_provider.dart';

class InboxScreen extends ConsumerWidget {
  const InboxScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final conversationsAsync = ref.watch(conversationsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Messagerie'),
        elevation: 0,
      ),
      body: conversationsAsync.when(
        data: (conversations) {
          if (conversations.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.inbox, size: 64, color: AppColors.textMuted),
                  SizedBox(height: AppDimensions.spaceMd),
                  Text('Aucun message pour le moment'),
                ],
              ),
            );
          }

          return ListView.separated(
            itemCount: conversations.length,
            separatorBuilder: (context, index) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final conv = conversations[index];
              final user = conv.otherUser;
              final lastMessage = conv.lastMessage;
              final unread = conv.unreadCount > 0;

              return ListTile(
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: AppDimensions.spaceLg,
                  vertical: AppDimensions.spaceMd,
                ),
                leading: CircleAvatar(
                  radius: 24,
                  backgroundImage:
                      user.avatar != null ? NetworkImage(user.avatar!) : null,
                  backgroundColor: AppColors.brand,
                  child: user.avatar == null
                      ? const Icon(Icons.person, color: Colors.white)
                      : null,
                ),
                title: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      user.fullName,
                      style: Theme.of(context).textTheme.labelMedium?.copyWith(
                            fontWeight:
                                unread ? FontWeight.bold : FontWeight.normal,
                          ),
                    ),
                    Text(
                      lastMessage.createdAt ?? '',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color:
                                unread ? AppColors.heading : AppColors.textBody,
                            fontWeight:
                                unread ? FontWeight.bold : FontWeight.normal,
                          ),
                    ),
                  ],
                ),
                subtitle: Padding(
                  padding: const EdgeInsets.only(top: 4.0),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          lastMessage.content,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style:
                              Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: unread
                                        ? AppColors.heading
                                        : AppColors.textBody,
                                    fontWeight: unread
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                  ),
                        ),
                      ),
                      if (unread)
                        Container(
                          margin: const EdgeInsets.only(left: 8.0),
                          padding: const EdgeInsets.all(6.0),
                          decoration: const BoxDecoration(
                            color: AppColors.brand,
                            shape: BoxShape.circle,
                          ),
                          child: Text(
                            conv.unreadCount.toString(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
                onTap: () {
                  // Navigate to chat detail
                },
              );
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Erreur: $err')),
      ),
    );
  }
}
