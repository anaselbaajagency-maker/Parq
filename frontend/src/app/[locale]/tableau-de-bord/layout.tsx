'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../../navigation';
import {
    LayoutDashboard, Package, MessageSquare,
    Settings, LogOut, Bell, Search,
    Plus, User as UserIcon, ChevronRight, Wallet
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from '../../../navigation';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Auth');
    const td = useTranslations('Dashboard');
    const tw = useTranslations('Wallet');
    const pathname = usePathname();
    const { logout, user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !isAuthenticated) {
            router.push('/login'); // specific login route
        }
    }, [isAuthenticated, router, mounted]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    useEffect(() => {
        const fetchBalance = async () => {
            if (user) {
                try {
                    const res = await api.wallet.getBalance();
                    // @ts-ignore
                    const data = res.data || res;
                    setBalance(data.balance);
                } catch (e) {
                    console.error('Failed to fetch balance', e);
                }
            }
        };
        fetchBalance();
    }, [user]);

    if (!mounted) return null;

    const getBreadcrumb = () => {
        if (pathname.includes('/listings')) return td('my_fleet');
        if (pathname.includes('/messages')) return td('messages_page.title');
        if (pathname.includes('/settings')) return td('settings_page.title');
        if (pathname.includes('/wallet')) return tw('title');
        return td('stats.active_listings').split(' ')[0] || 'Overview';
    };

    if (!user && isAuthenticated) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.spinner}>
                    <LayoutDashboard size={48} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>LOADING DASHBOARD...</p>
            </div>
        );
    }

    if (!user) return null;

    const navSections = [
        {
            label: 'Menu',
            items: [
                // @ts-ignore
                { href: '/tableau-de-bord' as const, label: t('dashboard') || 'Tableau de bord', icon: LayoutDashboard },
                // @ts-ignore
                { href: '/tableau-de-bord/annonces' as const, label: td('my_fleet'), icon: Package },
                // @ts-ignore
                { href: '/tableau-de-bord/messages' as const, label: td('messages_page.title'), icon: MessageSquare },
                {
                    // @ts-ignore
                    href: '/tableau-de-bord/wallet' as const,
                    label: tw('title'),
                    icon: Wallet,
                    badge: balance !== null ? `${balance.toLocaleString()} DH` : null
                },
            ]
        },
        {
            label: 'Preferences',
            items: [
                // @ts-ignore
                { href: '/tableau-de-bord/settings' as const, label: td('settings_page.title'), icon: Settings },
            ]
        }
    ];

    return (
        <div className={styles.container}>
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Floating Sidebar */}
            <aside className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.open : ''}`}>
                <div className={styles.sidebar}>
                    <div className="flex justify-center items-center mb-10 w-full lg:mb-[40px] px-3 lg:px-0">
                        <Link href="/" className={styles.logo}>
                            <div className={styles.logoDot} />
                            <span>PARQ.</span>
                        </Link>
                    </div>

                    {navSections.map((section, idx) => (
                        <div key={idx} className={styles.navSection}>
                            <p className={styles.navLabel}>{section.label}</p>
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`${styles.sidebarItem} ${isActive ? styles.active : ''}`}
                                    >
                                        <Icon size={20} className={styles.icon} />
                                        <span className="flex-1">{item.label}</span>
                                        {/* @ts-ignore */}
                                        {item.badge && (
                                            <span className="text-[10px] font-bold text-white bg-black px-2 py-0.5 rounded-full shadow-sm">
                                                {/* @ts-ignore */}
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}

                    <button
                        onClick={() => { logout(); router.push('/'); }}
                        className={`${styles.logoutBtn}`}
                    >
                        <LogOut size={20} className={styles.icon} />
                        <span>{t('logout') || 'Log Out'}</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className={styles.contentArea}>
                {/* Top Nav Bar */}
                <header className={styles.topBar}>
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle Hidden as requested */}
                        {/* <button
                            className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <LayoutDashboard size={24} />
                        </button> */}
                        <div className={styles.breadCrumb}>
                            {t('dashboard') || 'Dashboard'} <ChevronRight size={16} /> <span>{getBreadcrumb()}</span>
                        </div>
                    </div>

                    <div className={styles.userActions}>
                        {/* Wallet Balance Display */}
                        {/* Wallet Balance Display Hidden as requested */}
                        {/* <Link href="/tableau-de-bord/wallet" className="mr-2 hidden md:flex flex-col items-end justify-center px-4 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors group">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-black transition-colors">{tw('summary.current_balance')}</span>
                            <span className="text-sm font-black text-black">
                                {balance !== null ? balance.toLocaleString() : '---'} <span className="text-xs font-bold text-gray-400">DH</span>
                            </span>
                        </Link> */}

                        <button className={styles.actionIcon}>
                            <Search size={20} />
                        </button>
                        <button className={styles.actionIcon}>
                            <Bell size={20} />
                        </button>
                        <Link href="/create" className={styles.createBtn}>
                            <Plus size={20} />
                            <span>{td('new_listing') || 'Post'}</span>
                        </Link>

                        <div className={styles.userProfile}>
                            <div className={styles.userName}>{user.full_name?.split(' ')[0]}</div>
                            <div className={styles.userAvatar}>
                                {user.full_name?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className={styles.mainPage}>
                    {children}
                </main>
            </div>
        </div>
    );
}
