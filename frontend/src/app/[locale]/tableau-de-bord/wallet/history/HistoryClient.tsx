'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import { Transaction } from '@/types/wallet';
import TransactionList from '@/components/wallet/TransactionList';
import { useRouter } from '@/navigation';
import { ArrowLeft, History, ArrowUpRight } from 'lucide-react';
import styles from '../wallet.module.css';

export default function HistoryClient() {
    const t = useTranslations('Wallet');
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('all');
    const [page, setPage] = useState(1);
    const limit = 20;
    const [hasMore, setHasMore] = useState(false);

    const filters = [
        { id: 'all', label: t('filters.all') },
        { id: 'credit', label: t('filters.topup') },
        { id: 'debit', label: t('filters.payment') },
        { id: 'bonus', label: t('filters.bonus') },
    ];

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            try {
                const offset = (page - 1) * limit;
                const type = filterType === 'all' ? undefined : filterType;

                const response = await api.wallet.getTransactions(limit, offset, type);
                // @ts-ignore
                const txData = response.data || response;

                if (Array.isArray(txData)) {
                    setTransactions(txData);
                    setHasMore(txData.length === limit);
                } else {
                    setTransactions([]);
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Failed to load history', error);
            } finally {
                setLoading(false);
            }
        };
        loadHistory();
    }, [page, filterType]);

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setPage(1);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-black mb-4 transition-colors"
                >
                    <ArrowLeft size={18} />
                    {t('cancel')}
                </button>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className={styles.title}>{t('transactions.title')}</h1>
                        <p className={styles.subtitle}>{t('transactions.subtitle')}</p>
                    </div>
                </div>
            </header>

            <div className={styles.filters}>
                {filters.map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => handleFilterChange(filter.id)}
                        className={`${styles.filterBtn} ${filterType === filter.id ? styles.active : ''}`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            <div className={styles.card}>
                {loading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner} />
                    </div>
                ) : (
                    <>
                        <TransactionList transactions={transactions} />

                        <div className={styles.pagination}>
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className={styles.pageBtn}
                            >
                                <ArrowLeft size={16} />
                                {t('pagination.previous')}
                            </button>
                            <span className={styles.pageInfo}>
                                {t('pagination.page', { page })}
                            </span>
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!hasMore}
                                className={styles.pageBtn}
                            >
                                {t('pagination.next')}
                                <ArrowUpRight size={16} className="rotate-45" />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
