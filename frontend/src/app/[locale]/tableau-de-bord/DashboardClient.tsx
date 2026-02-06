'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useTranslations } from 'next-intl';
import { Link } from '../../../navigation';
import {
    Package, MessageSquare,
    Plus, Wallet, Eye, ChevronRight, Loader2, TrendingDown
} from 'lucide-react';
import {
    fetchDashboardStats,
    fetchDashboardActivity,
    fetchUserListings,
    fetchDashboardPerformance,
    DashboardStats,
    DashboardActivity,
    PerformanceData,
    api
} from '@/lib/api';
import { WalletBalance } from '@/types/wallet';
import WalletSummaryCard from '@/components/wallet/WalletSummaryCard';
import LowBalanceAlert from '@/components/wallet/LowBalanceAlert';
import styles from './dashboard.module.css';

export default function DashboardClient() {
    const { user } = useAuthStore();
    const t = useTranslations('Dashboard');

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<DashboardActivity[]>([]);
    const [performance, setPerformance] = useState<PerformanceData | null>(null);
    const [wallet, setWallet] = useState<WalletBalance | null>(null);
    const [listingsCount, setListingsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            if (!user?.id) return;

            try {
                // Fetch all data in parallel
                const [statsData, activityData, listings, perfData, walletData] = await Promise.all([
                    fetchDashboardStats(user.id),
                    fetchDashboardActivity(user.id),
                    fetchUserListings(user.id),
                    fetchDashboardPerformance(user.id),
                    api.wallet.getBalance()
                ]);

                if (statsData) setStats(statsData);
                setActivity(activityData);
                setListingsCount(listings.length);
                if (perfData) setPerformance(perfData);
                if (walletData) setWallet(walletData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [user]);

    // Fallback stats when API data is not available
    const displayStats = [
        {
            label: t('stats.active_listings'),
            value: stats?.active_listings?.toString() || listingsCount.toString() || '0',
            icon: Package,
            trend: stats?.listings_trend || '+0'
        },
        {
            label: t('stats.total_views'),
            value: stats?.total_views?.toLocaleString() || '0',
            icon: Eye,
            trend: stats?.views_trend || '+0%'
        },
        {
            label: t('summary.daily_expense', { defaultValue: 'Dépense Quotidienne' }),
            value: `${wallet?.daily_expense || 0} DH`,
            icon: TrendingDown,
            trend: 'Par jour'
        },
        {
            label: t('stats.balance'),
            value: `${stats?.balance?.toLocaleString() || '0'} DH`,
            icon: Wallet,
            trend: 'Available',
            isBalance: true
        },
    ];

    const displayActivity = activity.length > 0 ? activity : [
        { id: 1, title: t('no_activity'), time: '', type: 'view' as const },
    ];

    // Get performance chart data
    const chartData = performance?.data || [];

    // Calculate total views for the period
    const totalViews = chartData.reduce((acc, item) => acc + item.views, 0);

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.spinner} size={32} />
                <p>{t('loading')}</p>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContent}>
            {/* Header */}
            <header className={styles.dashHeader}>
                <h1 className={styles.dashTitle}>{t('greeting', { name: user?.full_name?.split(' ')[0] || '' })}</h1>
                <p className={styles.dashSubtitle}>{t('greeting_subtitle')}</p>
            </header>

            {/* Wallet Quick Awareness */}
            {wallet && wallet.days_remaining !== undefined && (
                <div className={styles.walletSection}>
                    <LowBalanceAlert
                        daysRemaining={wallet.days_remaining}
                        balance={wallet.balance}
                        isCritical={wallet.critical_balance_warning}
                    />
                    <div className={styles.walletGrid}>
                        <WalletSummaryCard
                            balance={wallet.balance}
                            dailyExpense={wallet.daily_expense}
                            daysRemaining={wallet.days_remaining}
                        />
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {displayStats.map((stat, i) => (
                    <div key={i} className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <stat.icon size={20} className={styles.statIcon} />
                            {(stat as any).isBalance ? (
                                <Link href="/tableau-de-bord/wallet" className={styles.addBalanceBtn}>
                                    <Plus size={14} />
                                    <span>{t('add_new')}</span>
                                </Link>
                            ) : (
                                <span className={styles.statTrend}>{stat.trend}</span>
                            )}
                        </div>
                        <div className={styles.statValue}>{stat.value}</div>
                        <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className={styles.contentGrid}>
                {/* Performance Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <div>
                            <h3 className={styles.cardTitle}>{t('performance')}</h3>
                            <p className={styles.cardSubtitle}>{totalViews} {t('stats.total_views')}</p>
                        </div>
                        <button className={styles.periodBtn}>
                            {performance?.period || t('last_7_days')}
                        </button>
                    </div>
                    <div className={styles.chartContainer}>
                        {chartData.map((item, i) => (
                            <div key={i} className={styles.chartBar}>
                                <div
                                    className={styles.chartBarFill}
                                    style={{ height: `${item.percentage}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={styles.chartLabels}>
                        {chartData.map((item, i) => (
                            <span key={i}>{item.day}</span>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className={styles.activityCard}>
                    <div className={styles.cardHeader}>
                        <h3 className={styles.cardTitle}>{t('recent_activity')}</h3>
                        <Link href="/tableau-de-bord/messages" className={styles.viewAllLink}>
                            {t('view_all')} <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className={styles.activityList}>
                        {displayActivity.map((act, i) => (
                            <div key={act.id || i} className={styles.activityItem}>
                                <div className={styles.activityDot} />
                                <div className={styles.activityContent}>
                                    <p className={styles.activityTitle}>{act.title}</p>
                                    {act.time && <span className={styles.activityTime}>{act.time}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActionsSection}>
                <h3 className={styles.sectionTitle}>{t('quick_actions')}</h3>
                <div className={styles.quickActionsGrid}>
                    <Link href="/create" className={styles.actionCard}>
                        <div className={styles.actionIconWrapper}>
                            <Plus size={24} />
                        </div>
                        <div className={styles.actionText}>
                            <span className={styles.actionTitle}>{t('new_listing')}</span>
                            <span className={styles.actionDesc}>{t('add_item_desc')}</span>
                        </div>
                        <ChevronRight size={20} className={styles.actionArrow} />
                    </Link>
                    <Link href="/tableau-de-bord/annonces" className={styles.actionCardAlt}>
                        <div className={styles.actionIconWrapperAlt}>
                            <Package size={24} />
                        </div>
                        <div className={styles.actionText}>
                            <span className={styles.actionTitle}>{t('my_fleet')}</span>
                            <span className={styles.actionDesc}>{t('manage_listings_desc')}</span>
                        </div>
                        <ChevronRight size={20} className={styles.actionArrow} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
