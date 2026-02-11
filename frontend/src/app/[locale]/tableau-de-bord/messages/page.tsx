'use client';

import { useAuthStore } from '@/lib/auth-store';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Send, MoreHorizontal, Circle, Check, CheckCheck } from 'lucide-react';
import styles from './messages.module.css';
import { apiMessages, Conversation, Message } from '@/lib/api';

export default function MessagesPage() {
    const { user } = useAuthStore();
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    // Handle incoming chat request from Listing Page
    const searchParams = useSearchParams();
    const recipientId = searchParams.get('recipientId');
    const recipientName = searchParams.get('recipientName');
    const listingTitle = searchParams.get('listingTitle');

    // Use useRef to track initialization across re-renders without triggering new ones
    // and to persist through Strict Mode double-invocations where possible
    const hasInitialized = useRef(false);

    const fetchConversations = async () => {
        try {
            const data = await apiMessages.getConversations();
            setConversations(data);
            if (!selectedChat && data.length > 0 && !recipientId) {
                // Determine selected chat logic (e.g. first one)
                // setSelectedChat(data[0].user.id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) return;
        fetchConversations();
    }, [user, recipientId]);

    // Fetch messages for selected chat
    useEffect(() => {
        if (selectedChat) {
            apiMessages.getMessages(selectedChat).then(setMessages);
            // Refresh conversations to update unread counts or last message
            fetchConversations();
        }
    }, [selectedChat]);


    // Handle incoming new chat request
    useEffect(() => {
        if (recipientId && recipientName && !hasInitialized.current) {
            hasInitialized.current = true;
            const existing = conversations.find(c => c.user.id == Number(recipientId));
            if (existing) {
                setSelectedChat(existing.user.id);
            } else {
                // Temporary conversation state or just set selectedChat and let UI handle "New"
                setSelectedChat(Number(recipientId));
            }
            if (listingTitle) {
                setMessage(`Bonjour, je suis intéressé par votre annonce "${listingTitle}". Est-elle toujours disponible ?`);
            }
        }
    }, [recipientId, recipientName, listingTitle, conversations]);

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedChat) return;

        try {
            const tempId = Date.now();
            // Optimistic update
            const optimisticMsg: Message = {
                id: tempId,
                sender_id: Number(user!.id),
                receiver_id: selectedChat,
                content: message,
                created_at: new Date().toISOString(),
                sender: user
            };
            setMessages(prev => [...prev, optimisticMsg]);
            setMessage('');

            const sentMsg = await apiMessages.sendMessage(selectedChat, message);
            // Replace optimistic with real
            setMessages(prev => prev.map(m => m.id === tempId ? sentMsg : m));
            fetchConversations(); // Update list
        } catch (e) {
            console.error(e);
            alert('Failed to send message');
        }
    };

    const selectedChatUser = conversations.find(c => c.user.id === selectedChat)?.user || (recipientId ? { id: Number(recipientId), name: recipientName, avatar: null } : null); // Fallback for new chat


    if (!user) return null;

    return (
        <div className={styles.container}>
            <div className={styles.messagesWrapper}>
                {/* Conversations List */}
                <div className={styles.conversationsList}>
                    <div className={styles.listHeader}>
                        <h2 className={styles.listTitle}>Messages</h2>
                    </div>

                    <div className={styles.searchWrapper}>
                        <Search size={16} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.chatsList}>
                        <div className={styles.chatsList}>
                            {conversations.map(conv => (
                                <div
                                    key={conv.user.id}
                                    onClick={() => setSelectedChat(conv.user.id)}
                                    className={`${styles.chatItem} ${selectedChat === conv.user.id ? styles.chatItemActive : ''}`}
                                >
                                    <div className={styles.chatAvatar}>
                                        {conv.user.name?.substring(0, 2).toUpperCase() || 'U'}
                                        {/* {conv.user.online && <span className={styles.onlineIndicator} />} */}
                                    </div>
                                    <div className={styles.chatInfo}>
                                        <div className={styles.chatTop}>
                                            <span className={styles.chatName}>{conv.user.name}</span>
                                            <span className={styles.chatTime}>{new Date(conv.last_message?.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className={styles.chatBottom}>
                                            <p className={`${styles.chatPreview} ${conv.unread_count > 0 ? styles.unread : ''}`}>
                                                {conv.last_message?.content}
                                            </p>
                                            {conv.unread_count > 0 && (
                                                <span className={styles.unreadBadge}>{conv.unread_count}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className={styles.chatArea}>
                    {/* Chat Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.chatHeaderInfo}>
                            <div className={styles.headerAvatar}>
                                {selectedChatUser?.name?.substring(0, 2).toUpperCase() || 'U'}
                            </div>
                            <div>
                                <h3 className={styles.headerName}>{selectedChatUser?.name}</h3>
                                {/* <span className={styles.headerStatus}>
                                    {selectedChatData?.online ? 'Online' : 'Offline'}
                                </span> */}
                            </div>
                        </div>
                        <button className={styles.moreBtn}>
                            <MoreHorizontal size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className={styles.messagesArea}>
                        <div className={styles.dateLabel}>Today</div>

                        {messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`${styles.messageRow} ${msg.sender_id === Number(user?.id) ? styles.messageRowMe : ''}`}
                            >
                                <div className={`${styles.messageBubble} ${msg.sender_id === Number(user?.id) ? styles.messageBubbleMe : ''}`}>
                                    <p>{msg.content}</p>
                                </div>
                                <span className={styles.messageTime}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {msg.sender_id === Number(user?.id) && (
                                        msg.read_at ? <CheckCheck size={14} /> : <Check size={14} />
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Message Input */}
                    <div className={styles.inputArea}>
                        <div className={styles.inputWrapper}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className={styles.messageInput}
                            />
                            <button
                                className={`${styles.sendBtn} ${message.trim() ? styles.sendBtnActive : ''}`}
                                disabled={!message.trim()}
                                onClick={handleSendMessage}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
