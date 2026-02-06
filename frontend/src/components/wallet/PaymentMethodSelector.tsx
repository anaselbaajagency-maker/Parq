"use client";

import { CreditCard, Landmark, Wallet, Banknote, CheckCircle2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import styles from '../../app/[locale]/tableau-de-bord/wallet/wallet.module.css';

export type PaymentMethodId = 'cmi' | 'bank_transfer' | 'payzone' | 'cash_plus';

interface PaymentMethodSelectorProps {
    selectedId: PaymentMethodId | null;
    onSelect: (id: PaymentMethodId) => void;
}

export default function PaymentMethodSelector({ selectedId, onSelect }: PaymentMethodSelectorProps) {
    const t = useTranslations('Wallet');

    const methods = [
        { id: 'cmi', icon: <CreditCard size={24} />, label: 'CMI (Maroc)', desc: t('methods.cmi_desc') },
        { id: 'bank_transfer', icon: <Landmark size={24} />, label: t('methods.bank_transfer'), desc: t('methods.bank_transfer_desc') },
        { id: 'payzone', icon: <Wallet size={24} />, label: 'Payzone', desc: t('methods.payzone_desc') },
        { id: 'cash_plus', icon: <Banknote size={24} />, label: 'Cash Plus', desc: t('methods.cash_plus_desc') },
    ] as const;

    return (
        <div className={styles.methodSelectorGrid}>
            {methods.map((m) => (
                <button
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    className={`${styles.paymentMethodCard} ${selectedId === m.id ? styles.selected : ''}`}
                >
                    <div className={styles.paymentIconWrapper}>
                        {m.icon}
                    </div>
                    <div className={styles.paymentInfo}>
                        <span className={styles.paymentName}>{m.label}</span>
                        <span className={styles.paymentDesc}>{m.desc}</span>
                    </div>
                    <CheckCircle2 size={24} className={styles.checkIcon} />
                </button>
            ))}
        </div>
    );
}
