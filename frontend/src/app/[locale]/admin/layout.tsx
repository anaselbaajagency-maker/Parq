'use client';

import { Link, usePathname, useRouter } from '../../../navigation';
import { useTranslations } from 'next-intl';
import { Settings, List, LayoutDashboard, ArrowLeft, Users, Home, Package, Layout, ShieldAlert, Wallet, CreditCard } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { AlertProvider } from '@/context/AlertContext';
import styles from './layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const t = useTranslations('Header');

    // Auth & Permission Check
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (user?.role !== 'ADMIN') {
                router.push('/dashboard'); // Restrict strictly to ADMIN
            }
        }
    }, [isAuthenticated, user, router, mounted]);

    if (!mounted || !isAuthenticated || user?.role !== 'ADMIN') return null;

    const navItems = [
        { href: '/admin', label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
        { href: '/admin/listings', label: 'Annonces', icon: Package },
        { href: '/admin/users', label: 'Utilisateurs', icon: Users },
        { href: '/admin/homepage', label: "Page d'accueil", icon: Home },
        { href: '/admin/featured', label: 'Catégories Accueil', icon: Layout },
        { href: '/admin/categories', label: 'Catégories', icon: List },
        { href: '/admin/cities', label: 'Gérer les Villes', icon: Layout },
        { href: '/admin/wallets', label: 'Portefeuilles', icon: Wallet },
        { href: '/admin/payment-methods', label: 'Méthodes de Paiement', icon: CreditCard },
        { href: '/admin/settings', label: 'Paramètres', icon: Settings },
        { href: '/admin/maintenance', label: 'Maintenance', icon: ShieldAlert },
    ];

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <LayoutDashboard size={24} />
                    <span className={styles.sidebarTitle}>Panneau Admin</span>
                </div>

                <nav className={styles.nav}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href as any}
                                className={`${styles.navLink} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link
                        href="/"
                        className={styles.backLink}
                    >
                        <ArrowLeft size={20} />
                        <span>Retour au site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <AlertProvider>
                    {children}
                </AlertProvider>
            </main>
        </div>
    );
}
