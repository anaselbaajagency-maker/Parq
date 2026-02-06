"use client";

import { Wallet, TrendingUp, Calendar, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '../../navigation';
import styles from './wallet.module.css';

interface WalletSummaryCardProps {
    balance: number;
    dailyExpense: number;
    daysRemaining: number;
}

export default function WalletSummaryCard({ balance, dailyExpense, daysRemaining }: WalletSummaryCardProps) {
    const t = useTranslations('Wallet');

    const safeBalance = balance ?? 0;
    const safeDailyExpense = dailyExpense ?? 0;
    const safeDaysRemaining = daysRemaining ?? 0;

    return (
        <div className={styles.walletCard}>
            {/* Header with Balance */}
            <div className={styles.walletHeader}>
                <div>
                    <p className={styles.walletLabel}>{t('summary.current_balance')}</p>
                    <div className={styles.walletBalance}>
                        <span className={styles.walletAmount}>{safeBalance.toLocaleString()}</span>
                        <span className={styles.walletCurrency}>DH</span>
                    </div>
                </div>
                <div className={styles.walletIcon}>
                    <Wallet size={28} />
                </div>
            </div>

            {/* Stats */}
            <div className={styles.walletStats}>
                <div className={styles.walletStat}>
                    <div className={styles.walletStatIcon}>
                        <TrendingUp size={20} />
                    </div>
                    <div className={styles.walletStatInfo}>
                        <p className={styles.walletStatLabel}>{t('summary.daily_expense')}</p>
                        <p className={styles.walletStatValue}>{safeDailyExpense} DH/jour</p>
                    </div>
                </div>

                <div className={styles.walletStat}>
                    <div className={styles.walletStatIcon}>
                        <Calendar size={20} />
                    </div>
                    <div className={styles.walletStatInfo}>
                        <p className={styles.walletStatLabel}>{t('summary.est_remaining')}</p>
                        <p className={`${styles.walletStatValue} ${safeDaysRemaining <= 1 ? styles.walletStatValueDanger : ''}`}>
                            {safeDaysRemaining} {t('summary.days')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recharge Button */}
            <Link href="/tableau-de-bord/wallet" className={styles.rechargeBtn}>
                <Plus size={20} />
                {t('actions.recharge_now')}
            </Link>
        </div>
    );
}
