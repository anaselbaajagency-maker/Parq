'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '../../../navigation';
import {
    LayoutDashboard, Package, MessageSquare,
    Settings, LogOut, Bell, Search,
    Plus, User as UserIcon, ChevronRight, Wallet, Globe
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { api } from '@/lib/api';
import { useRouter } from '../../../navigation';
import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import NotificationsDropdown from '@/components/notifications/NotificationsDropdown';

import { useRef } from 'react';
import { useParams } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const t = useTranslations('Auth');
    const td = useTranslations('Dashboard');
    const tw = useTranslations('Wallet');
    const pathname = usePathname();
    const { logout, user, isAuthenticated } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const params = useParams();
    const locale = (Array.isArray(params?.locale) ? params.locale[0] : params?.locale) || 'fr';

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showPausedModal, setShowPausedModal] = useState(false);

    // Lang Menu State
    const [isLangMenu, setIsLangMenu] = useState(false);
    const langMenuRef = useRef<HTMLDivElement>(null);

    const switchLocale = (newLocale: string) => {
        // @ts-ignore -- ignoring strict route typing for locale switch
        router.replace(pathname, { locale: newLocale });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
                setIsLangMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user) {
            // Check if listings are paused due to 0 balance
            api.wallet.getBalance().then((res: any) => {
                if (res && res.balance !== undefined && res.balance <= 0 && res.has_paused_listings) {
                    setShowPausedModal(true);
                }
            }).catch(err => console.error("Balance check error for modal:", err));
        }
    }, [isMounted, isAuthenticated, router, user]);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [pathname]);

    if (!isMounted) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f8fafc' }}>
                <div style={{ textAlign: 'center' }}>
                    <LayoutDashboard size={48} style={{ marginBottom: '1rem', marginLeft: 'auto', marginRight: 'auto', color: '#3b82f6' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b' }}>{td('common.initialization')}</h2>
                    <p style={{ color: '#64748b' }}>{td('common.secure_env')}</p>
                </div>
            </div>
        );
    }

    const getBreadcrumb = () => {
        if (pathname.includes('/listings')) return td('my_fleet');
        if (pathname.includes('/messages')) return td('messages_page.title');
        if (pathname.includes('/settings')) return td('settings_page.title');
        if (pathname.includes('/wallet')) return tw('title');
        return td('stats.active_listings').split(' ')[0] || 'Overview';
    };

    if (!user && isAuthenticated) {
        // console.log('[DashboardLayout] Auth: true, User: null. Waiting for state sync...');
        return (
            <div className={styles.loadingState}>
                <div className={styles.spinner}>
                    <LayoutDashboard size={48} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.05em' }}>{td('common.loading_profile')}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#fff' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <h2 style={{ fontWeight: 700 }}>{td('common.session_not_found')}</h2>
                    <p style={{ margin: '10px 0 20px' }}>{td('common.session_reconnect')}</p>
                    <Link href="/login" style={{ color: '#2563eb', fontWeight: 700 }}>{td('common.back_to_login')}</Link>
                </div>
            </div>
        );
    }

    const navSections = [
        {
            label: td('sidebar.menu'),
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
                },
            ]
        },
        {
            label: td('sidebar.preferences'),
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
                        <span>{t('logout')}</span>
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
                            {t('dashboard')} <ChevronRight size={16} /> <span>{getBreadcrumb()}</span>
                        </div>
                    </div>

                    <div className={styles.userActions}>
                        <div
                            className={styles.langSwitcher}
                            onClick={() => setIsLangMenu(!isLangMenu)}
                            ref={langMenuRef}
                        >
                            <button className={styles.langButton}>
                                <Globe size={18} className={styles.langIcon} />
                                <span className={styles.langCode}>{(locale as string).toUpperCase()}</span>
                            </button>

                            {isLangMenu && (
                                <div className={styles.langDropdown}>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); switchLocale('fr'); setIsLangMenu(false); }}
                                        className={`${styles.langOption} ${locale === 'fr' ? styles.activeLang : ''}`}
                                    >
                                        <Globe size={16} />
                                        <span className="font-bold">FR</span>
                                        <span>Français</span>
                                    </div>
                                    <div
                                        onClick={(e) => { e.stopPropagation(); switchLocale('ar'); setIsLangMenu(false); }}
                                        className={`${styles.langOption} ${locale === 'ar' ? styles.activeLang : ''}`}
                                    >
                                        <Globe size={16} />
                                        <span className="font-bold">AR</span>
                                        <span>العربية</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button className={styles.actionIcon}>
                            <Search size={20} />
                        </button>
                        <NotificationsDropdown />
                        <Link href="/create" className={styles.createBtn}>
                            <Plus size={20} />
                            <span>{td('new_listing')}</span>
                        </Link>

                        <div className={styles.userProfile}>
                            <div className={styles.userName}>{(user?.full_name || td('common.user') || 'Utilisateur').split(' ')[0]}</div>
                            <div className={styles.userAvatar}>
                                {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className={styles.mainPage}>
                    {children}
                </main>
            </div>

            {/* Paused Listings Modal */}
            {showPausedModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package size={28} className="text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{td('paused_modal.title')}</h3>
                        <p className="text-slate-600 mb-6">
                            {td('paused_modal.desc')}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={() => setShowPausedModal(false)}
                                className="px-5 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                            >
                                {td('paused_modal.later')}
                            </button>
                            {/* @ts-ignore */}
                            <Link
                                href="/tableau-de-bord/wallet"
                                onClick={() => setShowPausedModal(false)}
                                className="px-5 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                {td('paused_modal.recharge')}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
