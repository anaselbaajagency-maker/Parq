"use client";

import { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import styles from './listing.module.css';
import { useRouter } from '../../../../navigation';
import { useAuthStore } from '@/lib/auth-store';
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

        if (!isAuthenticated) {
            router.replace((`/login?redirect=${encodeURIComponent(targetPath)}`) as any);
            return;
        }

        router.replace(targetPath as any);
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
