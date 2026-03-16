'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { useLocale } from 'next-intl';
import { Link, useRouter } from '../../../navigation';
import {
    Users, Package, BarChart3, Shield,
    Loader2, AlertTriangle, Layers, ArrowRight,
    Home, Settings, ShieldAlert
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
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<Stats>({
        total_users: 0,
        total_listings: 0,
        pending_approvals: 0,
        total_revenue: 0
    });
    const [categoryCount, setCategoryCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (!user) {
            router.replace('/login');
            return;
        }

        if (user.role !== 'ADMIN') {
            router.replace('/tableau-de-bord');
            return;
        }

        loadAdminData();
    }, [isMounted, user, router]);

    async function loadAdminData() {
        try {
            setError(null);
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

        } catch (error: any) {
            const errorMessage = error?.message || (typeof error === 'string' ? error : '');
            if (errorMessage.includes('ACCESS_DENIED')) {
                setError('ACCESS_DENIED');
            } else {
                console.error('Failed to load admin data:', error);
                setError('FETCH_ERROR');
            }
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

    if (error === 'ACCESS_DENIED' || (!user || user.role !== 'ADMIN')) {
        return (
            <div className={styles.container}>
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
                    <ShieldAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Accès Refusé</h2>
                    <p className="text-slate-600 mb-6 max-w-md">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        Veuillez vous connecter avec un compte administrateur.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
                    <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
                    <p className="text-slate-600 mb-6">Impossible de charger les données du tableau de bord.</p>
                    <button onClick={loadAdminData} className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors">Réessayer</button>
                </div>
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
                <Link href={"/admin/users" as any} className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Users size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>Manage Users</h3>
                        <p>View, search, and manage platform users</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href={"/admin/listings" as any} className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Package size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>All Listings</h3>
                        <p>View and manage all listings</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href={"/admin/homepage" as any} className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Home size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>Homepage Settings</h3>
                        <p>Customize hero text and featured categories</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href={"/admin/categories" as any} className={styles.actionCard}>
                    <div className={styles.actionIcon}>
                        <Layers size={24} />
                    </div>
                    <div className={styles.actionContent}>
                        <h3>All Categories</h3>
                        <p>Manage listing categories and structure</p>
                    </div>
                    <ArrowRight className={styles.arrow} size={20} />
                </Link>

                <Link href={"/admin/settings" as any} className={styles.actionCard}>
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
