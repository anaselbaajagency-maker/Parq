'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useTranslations } from 'next-intl';
import { Link } from '../../../navigation';
import {
    Package, MessageSquare,
    Plus, Wallet, Eye, ChevronRight, Loader2, TrendingDown, Gift, X, Bell
} from 'lucide-react';
import {
    fetchDashboardStats,
    fetchDashboardActivity,
    fetchUserListings,
    fetchDashboardPerformance,
    DashboardStats,
    DashboardActivity,
    PerformanceData,
    fetchUserProfile,
    api
} from '@/lib/api';
import { WalletBalance } from '@/types/wallet';
import WalletSummaryCard from '@/components/wallet/WalletSummaryCard';
import LowBalanceAlert from '@/components/wallet/LowBalanceAlert';
import { useAlert } from '@/context/AlertContext';
import styles from './dashboard.module.css';

export default function DashboardClient() {
    const { user, isAuthenticated } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const t = useTranslations('Dashboard');
    const { showAlert } = useAlert();

    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [activity, setActivity] = useState<DashboardActivity[]>([]);
    const [performance, setPerformance] = useState<PerformanceData | null>(null);
    const [wallet, setWallet] = useState<WalletBalance | null>(null);
    const [listingsCount, setListingsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Check if we should show welcome message
        const hasSeenWelcome = localStorage.getItem('parq_welcome_seen');
        if (!hasSeenWelcome && user?.email_verified_at) {
            setShowWelcome(true);
        }
    }, [user?.email_verified_at]);

    const dismissWelcome = () => {
        setShowWelcome(false);
        localStorage.setItem('parq_welcome_seen', 'true');
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const updateUser = useAuthStore(state => state.updateUser);
    const initialized = useRef(false);
    const lastUserId = useRef<string | null>(null);

    useEffect(() => {
        async function loadDashboardData() {
            if (!isMounted) return;
            if (initialized.current && lastUserId.current === user?.id) return;

            if (!user?.id) {
                // console.log('[DashboardClient] Skipping load: No user ID ready');
                if (!isAuthenticated) {
                    setLoading(false);
                }
                return;
            }

            try {
                // Fetch all data in parallel
                const [statsData, activityData, listings, perfData, walletData, profileRes] = await Promise.all([
                    fetchDashboardStats(user.id),
                    fetchDashboardActivity(user.id),
                    fetchUserListings(user.id),
                    fetchDashboardPerformance(user.id),
                    api.wallet.getBalance(),
                    fetchUserProfile(user.id).catch(() => null)
                ]);

                if (statsData) setStats(statsData);
                setActivity(activityData || []);
                setListingsCount(listings?.length || 0);
                if (perfData) setPerformance(perfData);
                if (walletData) setWallet(walletData);

                // Update user in store if profile fetched successfully
                if (profileRes?.user) {
                    updateUser(profileRes.user as any);
                }

                initialized.current = true;
                lastUserId.current = user?.id || null;
            } catch (error: any) {
                // If it's a 401, don't show alert here, the layout handles it
                if (error?.message?.includes('401') || error?.message?.includes('429')) {
                    return;
                }
                console.error('[DashboardClient] Error loading dashboard data:', error);
                showAlert('error', t('common.error_loading_dashboard') || 'Impossible de charger le tableau de bord. Veuillez rafraîchir la page.', 'Erreur');
            } finally {
                setLoading(false);
            }
        }

        loadDashboardData();
    }, [user?.id, isMounted, isAuthenticated]);


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
            label: t('stats.balance'),
            value: `${stats?.balance?.toLocaleString() || '0'} DH`,
            icon: Wallet,
            trend: t('available') || 'Available',
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

    const isEmailVerified = !!user?.email_verified_at;

    return (
        <div className={styles.dashboardContent}>
            {/* Header */}
            <header className={styles.dashHeader}>
                <h1 className={styles.dashTitle}>{t('greeting', { name: user?.full_name?.split(' ')[0] || '' })}</h1>
                <p className={styles.dashSubtitle}>{t('greeting_subtitle')}</p>
            </header>

            {/* Verification Banner */}
            {!isEmailVerified && (
                <div className={`${styles.welcomeBanner} ${styles.verificationBanner}`}>
                    <div className={styles.welcomeContent}>
                        <div className={`${styles.welcomeIcon} ${styles.verificationIcon}`}>
                            <Bell size={24} color="white" />
                        </div>
                        <div className={styles.welcomeText}>
                            <h3 className={styles.welcomeTitle} style={{ color: '#78350f', fontWeight: 800 }}>{t('verification.title')}</h3>
                            <p className={styles.welcomeDesc} style={{ color: '#92400e' }}>
                                {t('verification.desc')}
                            </p>

                            <div className="mt-3">
                                <Link
                                    href="/account/verify-email"
                                    className={styles.verificationBtn}
                                >
                                    {t('verification.button')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Welcome Bonus Banner */}
            {showWelcome && (
                <div className={styles.welcomeBanner}>
                    <div className={styles.welcomeContent}>
                        <div className={styles.welcomeIcon}>
                            <Gift size={24} />
                        </div>
                        <div className={styles.welcomeText}>
                            <h3 className={styles.welcomeTitle}>{t('welcome_bonus.title')}</h3>
                            <p className={styles.welcomeDesc}>{t('welcome_bonus.desc')}</p>
                        </div>
                    </div>
                    <button onClick={dismissWelcome} className={styles.closeWelcome}>
                        <X size={20} />
                    </button>
                </div>
            )}

            {/* Top Widgets Section - Mockup Layout */}
            <div className={styles.topWidgetsContainer}>
                {/* Wallet Quick Awareness */}
                {wallet && wallet.days_remaining !== undefined && (
                    <div className="w-full">
                        <LowBalanceAlert
                            daysRemaining={wallet.days_remaining}
                            balance={wallet.balance}
                            isCritical={wallet.critical_balance_warning}
                        />
                        <WalletSummaryCard
                            balance={wallet.balance}
                            dailyExpense={wallet.daily_expense}
                            daysRemaining={wallet.days_remaining}
                        />
                    </div>
                )}

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                    {displayStats.filter((s: any) => !s.isBalance).map((stat, i) => (
                        <div key={i} className={styles.statCard}>
                            <div className={styles.statHeader}>
                                <div className={styles.statIcon}>
                                    <stat.icon size={20} />
                                </div>
                                <span className={styles.statTrend}>{stat.trend}</span>
                            </div>
                            <div>
                                <div className={styles.statValue}>{stat.value}</div>
                                <div className={styles.statLabel}>{stat.label}</div>
                            </div>
                        </div>
                    ))}
                    {/* Add the Solde card as the 3rd stat card, matching mockup exactly */}
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={styles.statIcon}>
                                <Wallet size={20} />
                            </div>
                            <Link href="/tableau-de-bord/wallet" className={styles.addBalanceBtn}>
                                <Plus size={14} />
                                <span>{t('add_new')}</span>
                            </Link>
                        </div>
                        <div>
                            <div className={styles.statValue}>{`${stats?.balance?.toLocaleString() || '0'} DH`}</div>
                            <div className={styles.statLabel}>{t('stats.balance')}</div>
                        </div>
                    </div>
                </div>
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
