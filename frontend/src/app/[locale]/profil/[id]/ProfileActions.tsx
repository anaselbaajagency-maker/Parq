"use client";

import { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import styles from './profile.module.css';

interface ProfileActionsProps {
    phone: string | null;
}

export default function ProfileActions({ phone }: ProfileActionsProps) {
    const [isPhoneVisible, setIsPhoneVisible] = useState(false);

    const handleWhatsApp = () => {
        if (!phone) return;
        // Clean phone number for WhatsApp URL (remove spaces, etc.)
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
    };

    const handleShowPhone = () => {
        setIsPhoneVisible(true);
    };

    return (
        <div className={styles.userActions}>
            <button
                className={styles.primaryBtn}
                onClick={handleShowPhone}
                disabled={!phone}
            >
                <Phone size={18} />
                {isPhoneVisible ? (phone || 'Non disponible') : 'Afficher le numéro'}
            </button>
            <button
                className={`${styles.secondaryBtn} ${styles.whatsappBtn}`}
                onClick={handleWhatsApp}
                disabled={!phone}
            >
                <MessageSquare size={18} />
                WhatsApp
            </button>
        </div>
    );
}
