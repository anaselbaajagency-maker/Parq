"use client";

import { useState, useEffect } from 'react';
import { CheckCircle2, CreditCard, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { api } from '@/lib/api';
import styles from '../../app/[locale]/tableau-de-bord/wallet/wallet.module.css';

export type PaymentMethodId = string;

interface ApiPaymentMethod {
    code: string;
    name: string;
    name_ar?: string;
    description: string;
    icon: string;
    requires_proof: boolean;
    is_online: boolean;
    config?: Record<string, any>;
}

interface PaymentMethodSelectorProps {
    selectedId: PaymentMethodId | null;
    onSelect: (method: ApiPaymentMethod) => void;
}

export default function PaymentMethodSelector({ selectedId, onSelect }: PaymentMethodSelectorProps) {
    const t = useTranslations('Wallet');
    const locale = useLocale();
    const [methods, setMethods] = useState<ApiPaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        try {
            const data = await api.wallet.getPaymentMethods();
            setMethods(data);
        } catch (e) {
            console.error('Failed to load payment methods', e);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName] || CreditCard;
        return <IconComponent size={24} />;
    };

    const getLocalizedName = (method: ApiPaymentMethod) => {
        if (locale === 'ar' && method.name_ar) return method.name_ar;
        return method.name;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            </div>
        );
    }

    if (methods.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '24px', color: '#94a3b8' }}>
                Aucune méthode de paiement disponible
            </div>
        );
    }

    return (
        <div className={styles.methodSelectorGrid}>
            {methods.map((m) => (
                <button
                    key={m.code}
                    onClick={() => onSelect(m)}
                    className={`${styles.paymentMethodCard} ${selectedId === m.code ? styles.selected : ''}`}
                >
                    <div className={styles.paymentIconWrapper}>
                        {getIcon(m.icon)}
                    </div>
                    <div className={styles.paymentInfo}>
                        <span className={styles.paymentName}>{getLocalizedName(m)}</span>
                        <span className={styles.paymentDesc}>{m.description}</span>
                    </div>
                    <CheckCircle2 size={24} className={styles.checkIcon} />
                </button>
            ))}
        </div>
    );
}
