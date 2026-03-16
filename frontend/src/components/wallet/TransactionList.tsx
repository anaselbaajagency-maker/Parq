"use client";

import { Transaction } from '@/types/wallet';
import { ArrowUpRight, ArrowDownLeft, Gift, AlertCircle, Info, FileText, Eye, XCircle } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import styles from '../../app/[locale]/tableau-de-bord/wallet/wallet.module.css';

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const t = useTranslations('Wallet');
    const locale = useLocale();
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    const getIcon = (type: Transaction['type'], status: Transaction['status']) => {
        if (status === 'failed') return <AlertCircle size={20} className="text-red-600" />;

        switch (type) {
            case 'topup': return <ArrowUpRight className="text-green-600" size={20} />;
            case 'deduction': return <ArrowDownLeft className="text-orange-600" size={20} />;
            case 'bonus': return <Gift className="text-purple-600" size={20} />;
            case 'refund': return <ArrowUpRight className="text-blue-600" size={20} />;
            default: return <Info size={20} className="text-gray-600" />;
        }
    };

    const getStatusClass = (status: Transaction['status']) => {
        switch (status) {
            case 'completed': return styles.status_approved;
            case 'pending': return styles.status_pending;
            case 'failed': return styles.status_rejected;
            default: return '';
        }
    };

    if (!Array.isArray(transactions) || transactions.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Info className="mx-auto mb-3 opacity-20" size={48} />
                <p className="font-medium">{t('transactions.empty')}</p>
            </div>
        );
    }

    return (
        <div>
            {transactions.map((tx) => (
                <div key={tx.id} className={styles.transactionItem}>
                    <div className={styles.transactionInfo}>
                        <div className={styles.transactionIcon}>
                            {getIcon(tx.type, tx.status)}
                        </div>
                        <div className={styles.transactionDetails}>
                            <h4>
                                {locale === 'ar' && tx.description_ar ? tx.description_ar : tx.description}
                            </h4>
                            <div className="text-gray-500 text-sm">
                                {new Date(tx.created_at).toLocaleDateString()}
                                {tx.listing_title && (
                                    <> • <span className="font-medium text-gray-800">{tx.listing_title}</span></>
                                )}
                                {tx.receipt_url && (
                                    <div className="mt-3">
                                        <div
                                            className={styles.receiptThumbnail}
                                            onClick={() => setLightboxImage(tx.receipt_url || null)}
                                            title={t('receipt.view')}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={tx.receipt_url}
                                                alt="Receipt Proof"
                                            />
                                            <div className={styles.receiptOverlay}>
                                                <Eye size={16} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <span className={`${styles.statusBadge} ${getStatusClass(tx.status)}`}>
                                    {t(`status.${tx.status}`)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.transactionAmount} ${tx.type === 'deduction' ? styles.negative : styles.positive}`}>
                        {tx.type === 'deduction' ? '-' : '+'}{Math.abs(tx.amount).toLocaleString()} DH
                    </div>
                </div>
            ))}

            {/* Lightbox Pop-up */}
            {lightboxImage && (
                <div className={styles.lightboxOverlay} onClick={() => setLightboxImage(null)}>
                    <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.lightboxClose} onClick={() => setLightboxImage(null)}>
                            <XCircle size={24} />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={lightboxImage} alt="Large receipt preview" className={styles.lightboxImage} />
                    </div>
                </div>
            )}
        </div>
    );
}
