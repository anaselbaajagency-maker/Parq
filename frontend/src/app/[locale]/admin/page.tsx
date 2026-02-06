'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useLocale } from 'next-intl';
import { Link } from '../../../navigation';
import {
    Users, Package, BarChart3, Shield,
    Loader2, AlertTriangle, Layers, ArrowRight,
    Home, Settings
} from 'lucide-react';
import { API_BASE_URL, fetchCategories, fetchAdminStats } from '@/lib/api';
import styles from './admin.module.css';

interface Stats {
    total_users: number;
    total_listings: number;
    pending_approvals: number;
    total_revenue: number;
}

export default function AdminPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        total_users: 0,
        total_listings: 0,
        pending_approvals: 0,
        total_revenue: 0
    });
    const [categoryCount, setCategoryCount] = useState(0);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }

        loadAdminData();
    }, [user, router]);

    async function loadAdminData() {
        try {
            const [cats, statsData] = await Promise.all([
                fetchCategories(),
                fetchAdminStats()
            ]);

            setCategoryCount(cats.length);
            if (statsData) {
                setStats({
                    total_users: statsData.total_users || 0,
                    total_listings: statsData.total_listings || 0,
                    pending_approvals: statsData.pending_approvals || 0,
                    total_revenue: statsData.total_revenue || 0
                });
            }

        } catch (error) {
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 className={styles.spinner} size={32} />
                <p>Loading admin panel...</p>
            </div>
        );
    }

    if (!user || user.role !== 'ADMIN') {
        return (
            <div className={styles.accessDenied}>
                <AlertTriangle size={48} />
                <h2>Access Denied</h2>
                <p>You don't have permission to access this page.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Admin Overview</h1>
                    <p className={styles.subtitle}>Welcome back, {user.full_name}</p>
                </div>
                <div className={styles.adminBadge}>
                    <Shield size={16} />
                    Administrator
                </div>
            </header>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <Users size={24} className={styles.statIcon} />
                    <div className={styles.statValue}>{stats.total_users}</div>
                    <div className={styles.statLabel}>Total Users</div>
                </div>
                <div className={styles.statCard}>
                    <Package size={24} className={styles.statIcon} />
                    <div className={styles.statValue}>{stats.total_listings}</div>
                    <div className={styles.statLabel}>Total Listings</div>
                </div>
                <div className={styles.statCard}>
                    <Layers size={24} className={styles.statIcon} />
                    <div className={styles.statValue}>{categoryCount}</div>
                    <div className={styles.statLabel}>Categories</div>
                </div>
                <div className={styles.statCard}>
                    <BarChart3 size={24} className={styles.statIcon} />
                    <div className={styles.statValue}>{stats.total_revenue.toLocaleString()} DH</div>
                    <div className={styles.statLabel}>Total Revenue</div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.quickActionsGrid}>
                <Link href="/admin/users" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Users size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>Manage Users</h3>
                        <p>View, search, and manage platform users</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href="/admin/listings" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Package size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>All Listings</h3>
                        <p>View and manage all listings</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href="/admin/homepage" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Home size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>Homepage Settings</h3>
                        <p>Customize hero text and featured categories</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href="/admin/categories" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Layers size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>All Categories</h3>
                        <p>Manage listing categories and structure</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href="/admin/settings" className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Settings size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>Global Settings</h3>
                        <p>Configure general platform settings</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>
            </div>
        </div>
    );
}
