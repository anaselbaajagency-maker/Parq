"use client";

import { Transaction } from '@/types/wallet';
import { ArrowUpRight, ArrowDownLeft, Gift, AlertCircle, Info, FileText } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import styles from '../../app/[locale]/tableau-de-bord/wallet/wallet.module.css';

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const t = useTranslations('Wallet');
    const locale = useLocale();

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
                            <p>
                                {new Date(tx.created_at).toLocaleDateString()}
                                {tx.listing_title && (
                                    <> • <span className="font-medium text-gray-800">{tx.listing_title}</span></>
                                )}
                                {tx.receipt_url && (
                                    <a
                                        href={tx.receipt_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 inline-flex items-center text-xs text-blue-600 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <FileText size={12} className="mr-1" />
                                        {t('receipt.view')}
                                    </a>
                                )}
                                <span className={`ml-2 ${styles.statusBadge} ${getStatusClass(tx.status)}`}>
                                    {t(`status.${tx.status}`)}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className={`${styles.transactionAmount} ${tx.type === 'deduction' ? styles.negative : styles.positive}`}>
                        {tx.type === 'deduction' ? '-' : '+'}{Math.abs(tx.amount).toLocaleString()} DH
                    </div>
                </div>
            ))}
        </div>
    );
}
