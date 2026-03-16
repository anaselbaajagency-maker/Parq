'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { api } from '@/lib/api';
import { fetchTopUpRequests } from '@/lib/wallet-api';
import { Transaction } from '@/types/wallet';
import TransactionList from '@/components/wallet/TransactionList';
import { useRouter } from '@/navigation';
import { ArrowLeft, RefreshCw, ArrowRight } from 'lucide-react';
import styles from '../wallet.module.css';

export default function HistoryClient() {
    const t = useTranslations('Wallet');
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
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

    const loadHistory = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            const offset = (page - 1) * limit;
            const type = filterType === 'all' ? undefined : filterType;

            const [txData, topupRes] = await Promise.all([
                api.wallet.getTransactions(limit, offset, type),
                page === 1 && (filterType === 'all' || filterType === 'credit')
                    ? fetchTopUpRequests()
                    : Promise.resolve([])
            ]);

            const showPending = page === 1 && (filterType === 'all' || filterType === 'credit');
            const pendingTxs: Transaction[] = showPending
                ? (topupRes || [])
                    .filter(r => r.status === 'pending' || r.status === 'rejected')
                    .map(r => ({
                        id: -r.id,
                        type: 'topup',
                        amount: r.amount,
                        description: `${t('top_up')} (${r.method_label || r.method})`,
                        created_at: r.created_at,
                        status: (r.status === 'pending' ? 'pending' : 'failed') as Transaction['status'],
                        reference: r.reference,
                        receipt_url: r.proof_image
                    }))
                : [];

            if (Array.isArray(txData)) {
                const combined = [...pendingTxs, ...txData];
                setTransactions(combined);
                setHasMore(txData.length === limit);
            } else {
                setTransactions(pendingTxs);
                setHasMore(false);
            }
        } catch (error) {
            console.error('Failed to load history', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [page, filterType, t]);

    useEffect(() => {
        loadHistory();
    }, [loadHistory]);

    const handleFilterChange = (type: string) => {
        setFilterType(type);
        setPage(1);
    };

    const handleRefresh = () => {
        loadHistory(true);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerActions}>
                    <button
                        onClick={() => router.back()}
                        className={styles.secondaryBtn}
                    >
                        <ArrowLeft size={18} />
                        {t('cancel')}
                    </button>

                    <button
                        onClick={handleRefresh}
                        disabled={loading || refreshing}
                        className={`${styles.secondaryBtn} ${styles.refreshBtn}`}
                    >
                        <RefreshCw size={16} className={(loading || refreshing) ? styles.spinning : ''} />
                        {refreshing ? t('common.updating') || 'Mise à jour...' : t('common.update') || 'Mettre à jour'}
                    </button>
                </div>

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

            <div className={styles.card} style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                {loading && !refreshing ? (
                    <div className={styles.loadingState} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className={styles.spinner} />
                    </div>
                ) : (
                    <>
                        {transactions.length > 0 ? (
                            <TransactionList transactions={transactions} />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-60">
                                <RefreshCw size={48} className="text-gray-300 mb-4" />
                                <p className="font-bold text-gray-500">{t('transactions.empty') || 'Aucune transaction trouvée'}</p>
                                <p className="text-sm">{t('transactions.empty_desc') || 'Modifiez vos filtres ou rechargez la page.'}</p>
                            </div>
                        )}

                        {transactions.length > 0 && (
                            <div className={styles.pagination} style={{ marginTop: 'auto', paddingTop: '24px' }}>
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
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
