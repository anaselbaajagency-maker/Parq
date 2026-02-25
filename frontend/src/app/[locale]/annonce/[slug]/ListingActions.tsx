"use client";

import { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import styles from './listing.module.css';
import { useRouter } from '../../../../navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';

interface ListingActionsProps {
    phone: string | null;
    whatsapp: string | null;
    sellerId: number;
    listingId: number;
    messagesPath: string;
    recipientName?: string;
    listingTitle?: string;
}

export default function ListingActions({ phone, whatsapp, sellerId, listingId, messagesPath, recipientName, listingTitle }: ListingActionsProps) {
    const t = useTranslations('Listing');
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const currentLocale = useLocale();

    const handleWhatsApp = () => {
        const targetPhone = whatsapp || phone;
        if (!targetPhone) return;
        const cleanPhone = targetPhone.replace(/[^\d+]/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    const handleShowPhone = () => {
        setIsPhoneVisible(true);
    };

    const handleMessage = () => {
        const query = new URLSearchParams({
            recipientId: sellerId.toString(),
            listingId: listingId.toString(),
            recipientName: recipientName || 'Seller',
            listingTitle: listingTitle || 'Listing'
        }).toString();

        // Robust path cleaning to avoid double locale prefixing
        const cleanMessagesPath = messagesPath.replace(/^\/(fr|ar)(\/|$)/, '/');
        const connector = cleanMessagesPath.includes('?') ? '&' : '?';
        const targetPath = `${cleanMessagesPath}${connector}${query}`;

        // Get current locale from URL path or fallback to currentLocale hook
        const localeFromPath = window.location.pathname.split('/')[1];
        const locale = (localeFromPath === 'fr' || localeFromPath === 'ar') ? localeFromPath : currentLocale;

        if (!isAuthenticated) {
            // Use window.location.href to bypass router magic and ensure clean URL
            const loginPath = `/${locale}/connexion`;
            window.location.href = `${loginPath}?redirect=${encodeURIComponent(targetPath)}`;
            return;
        }

        // Redirect directly for authenticated users to ensure consistency
        window.location.href = `/${locale}${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;
    };

    return (
        <div className={styles.actionsStack}>
            <button
                className={styles.primaryBtn}
                onClick={handleShowPhone}
                disabled={!phone}
            >
                <Phone size={20} />
                {isPhoneVisible ? (phone || t('not_available')) : t('show_phone')}
            </button>

            <button
                className={`${styles.secondaryBtn} ${styles.whatsappBtn}`}
                onClick={handleWhatsApp}
                disabled={!phone}
            >
                <MessageSquare size={20} />
                {t('contact_whatsapp')}
            </button>

            <button
                className={styles.secondaryBtn}
                onClick={handleMessage}
            >
                <MessageSquare size={20} />
                {t('send_message')}
            </button>
        </div>
    );
}
