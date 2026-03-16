'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Loader2, Package, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { apiNotifications, AppNotification, parseImageUrl } from '@/lib/api';
import styles from './notifications.module.css';
import { useAuthStore } from '@/lib/auth-store';

export default function NotificationsDropdown() {
    const t = useTranslations('Dashboard');
    const { isAuthenticated } = useAuthStore();

    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchNotifs = async () => {
            try {
                const res = await apiNotifications.get(false);
                if (res && res.data) {
                    setNotifications(res.data);
                    setUnreadCount(res.unread_count || 0);
                }
            } catch (error) {
                console.error('Failed to load notifications', error);
            }
        };

        fetchNotifs();

        // Optional: Poll every 1 minute
        const interval = setInterval(fetchNotifs, 60000);
        return () => clearInterval(interval);
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        try {
            await apiNotifications.markAsRead(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        if (notifications.length === 0) return;

        setLoading(true);
        try {
            await apiNotifications.markAllAsRead();
            setNotifications([]);
            setUnreadCount(0);
            setIsOpen(false);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (seconds < 60) return "À l'instant";

        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `Il y a ${minutes} min`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `Il y a ${hours} h`;

        const days = Math.floor(hours / 24);
        if (days === 1) return 'Hier';
        if (days < 7) return `Il y a ${days} jours`;

        return date.toLocaleDateString();
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button className={styles.bellButton} onClick={toggleDropdown} aria-label="Notifications">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <h3>Notifications</h3>
                        {notifications.length > 0 && (
                            <button
                                className={styles.markAllBtn}
                                onClick={handleMarkAllAsRead}
                                disabled={loading}
                            >
                                {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                                <span>Tout marquer lu</span>
                            </button>
                        )}
                    </div>

                    <div className={styles.list}>
                        {notifications.length === 0 ? (
                            <div className={styles.empty}>
                                <div className={styles.emptyIcon}>
                                    <Bell size={24} />
                                </div>
                                <p>Aucune nouvelle notification</p>
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`${styles.item} ${notif.read_at ? '' : styles.unread}`}
                                    onClick={() => handleMarkAsRead(notif.id)}
                                >
                                    <div className={styles.itemIcon}>
                                        <Package size={18} />
                                    </div>
                                    <div className={styles.itemContent}>
                                        <p className={styles.itemTitle}>{notif.data?.listing_title || 'Annonce'}</p>
                                        <p className={styles.itemMessage}>{notif.data?.message || 'Changement de statut'}</p>
                                        <p className={styles.itemTime}>{formatTimeAgo(notif.created_at)}</p>
                                    </div>
                                    <button
                                        className={styles.readDotBtn}
                                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                                        title="Marquer comme lu"
                                    >
                                        <div className={styles.readDot}></div>
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
