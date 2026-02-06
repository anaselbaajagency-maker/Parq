"use client";

import { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import styles from './listing.module.css';
import { useRouter } from 'next/navigation';
// Note: We might need to import locale-aware router if available, 
// but for client components usually standard hooks or passed-in handlers are better.
// Actually receiving a localized path for messages is safer.

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
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);
    const router = useRouter();

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

        router.push(`${messagesPath}?${query}`);
    };

    return (
        <div className={styles.actionsStack}>
            <button
                className={styles.primaryBtn}
                onClick={handleShowPhone}
                disabled={!phone}
            >
                <Phone size={20} />
                {isPhoneVisible ? (phone || 'Non disponible') : 'Afficher le numéro'}
            </button>

            <button
                className={`${styles.secondaryBtn} ${styles.whatsappBtn}`}
                onClick={handleWhatsApp}
                disabled={!phone}
            >
                <MessageSquare size={20} />
                Contacter sur WhatsApp
            </button>

            <button
                className={styles.secondaryBtn}
                onClick={handleMessage}
            >
                Envoyer un Message
            </button>
        </div>
    );
}
