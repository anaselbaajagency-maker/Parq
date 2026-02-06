'use client';

import { useState, useEffect } from 'react';

import Link from 'next/link';
import styles from './Header.module.css';
import { useTranslations } from 'next-intl';
import { Globe, Menu, UserCircle, LayoutDashboard, List, LogOut, ShieldCheck, PlusCircle, HelpCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { usePathname, useRouter } from '@/navigation';
import LoginModal from './LoginModal';
import { useAuthStore } from '@/lib/auth-store';
import { fetchSettings, Settings } from '@/lib/api';

export default function Header({ locale }: { locale: string }) {
    const t = useTranslations('Header');
    const tCat = useTranslations('HomePage');
    const pathname = usePathname();
    const router = useRouter();
    const params = useParams();

    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        const loadSettings = async () => {
            const data = await fetchSettings();
            setSettings(data);
        };
        loadSettings();
    }, []);

    const switchLocale = (newLocale: string) => {
        router.replace(
            // @ts-expect-error -- TypeScript will validate that only known `params`
            // are used in combination with a given `pathname`. Since the two will
            // always match for the current route, we can skip runtime checks.
            { pathname, params },
            { locale: newLocale }
        );
    };

    const [searchType, setSearchType] = useState<'rent' | 'buy'>('rent');
    const [activeSection, setActiveSection] = useState<'category' | 'city' | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedCity, setSelectedCity] = useState<string>('');

    const { user, isAuthenticated, logout } = useAuthStore();

    // Login Modal State
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [initialAuthView, setInitialAuthView] = useState<'login' | 'register'>('login');

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
    const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen);

    const openLogin = () => {
        setInitialAuthView('login');
        setIsLoginModalOpen(true);
        setIsUserMenuOpen(false);
    };

    const openRegister = () => {
        setInitialAuthView('register');
        setIsLoginModalOpen(true);
        setIsUserMenuOpen(false);
    };

    // Close dropdowns when clicking outside
    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(`.${styles.detailedSearch}`)) {
                setActiveSection(null);
            }
            if (isUserMenuOpen && !target.closest(`.${styles.userMenu}`)) {
                setIsUserMenuOpen(false);
            }
            if (isLangMenuOpen && !target.closest(`.${styles.langSwitcher}`)) {
                setIsLangMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isUserMenuOpen, isLangMenuOpen]);

    const categories = [
        { id: 'car_rental', label: 'cat_car_rental' },
        { id: 'btp', label: 'cat_btp' },
        { id: 'tourist', label: 'cat_tourist' },
        { id: 'staff', label: 'cat_staff' },
        { id: 'drivers', label: 'cat_drivers' },
    ];

    const cities = [
        'Casablanca', 'Rabat', 'Tangier', 'Marrakech', 'Agadir'
    ];

    const handleSelectCategory = (id: string) => {
        setSelectedCategory(id);
        setActiveSection(null);
    };

    const handleSelectCity = (city: string) => {
        setSelectedCity(city);
        setActiveSection(null);
    };

    const getCategoryLabel = (id: string) => {
        const cat = categories.find(c => c.id === id);
        return cat ? tCat(cat.label) : t('category_label');
    };

    const isDashboard = pathname.includes('/dashboard') || pathname.includes('/tableau-de-bord');
    // Check if path is admin, accounting for potential locale prefix
    const isAdmin = pathname.includes('/admin');
    const isAuthPage = pathname.includes('/login') || pathname.includes('/connexion') || pathname.includes('/register') || pathname.includes('/inscription') || pathname.includes('/forgot-password') || pathname.includes('/mot-de-passe-oublie') || pathname.includes('/nisyan-kalimat-sir');

    if (isAdmin || isDashboard || isAuthPage) return null;

    // Helper to check boolean/string settings
    const isTrue = (val: boolean | string | undefined) => {
        if (val === undefined) return true; // Default to true if loading or missing
        if (val === true) return true;
        if (val === 'true') return true;
        if (val === '1') return true;
        return false;
    };

    const showLangInfo = settings?.header_show_language_switcher !== undefined ? isTrue(settings.header_show_language_switcher) : true;
    const showLogin = isTrue(settings?.header_show_login_button);

    return (
        <>
            <header className={styles.header} role="banner">
                <div className={`container ${styles.container}`}>
                    {/* 1. Left Section: Logo */}
                    <Link href={`/${locale}`} className={styles.logo} aria-label="PARQ Home">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoIcon}>
                            <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="#ffd700" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 23L16 30L30 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M2 16L16 23L30 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>PARQ</span>
                    </Link>

                    {/* 2. Middle Section: Navigation (Perfectly Centered) */}
                    <nav className={styles.nav} aria-label="Main navigation">
                        <Link href={`/${locale}`} className={`${styles.navLink} ${pathname === `/${locale}` ? styles.activeNavLink : ''}`}>
                            {t('home')}
                        </Link>
                        <Link href={`/${locale}/rent`} className={`${styles.navLink} ${pathname.includes('/rent') ? styles.activeNavLink : ''}`}>
                            {t('rent')}
                        </Link>
                        <Link href={`/${locale}/buy`} className={`${styles.navLink} ${pathname.includes('/buy') ? styles.activeNavLink : ''}`}>
                            {t('buy')}
                        </Link>
                    </nav>

                    {/* 3. Right Section: Actions */}
                    <div className={styles.actions}>
                        {showLangInfo && (
                            <div className={styles.langSwitcher} onClick={toggleLangMenu} aria-haspopup="true" aria-expanded={isLangMenuOpen} aria-label="Switch Language">
                                <div className={styles.langButton}>
                                    <Globe size={18} />
                                    <span className={styles.langCode}>{locale.toUpperCase()}</span>
                                </div>

                                <div className={`${styles.langDropdown} ${isLangMenuOpen ? styles.show : ''}`}>
                                    <div onClick={(e) => { e.stopPropagation(); switchLocale('fr'); setIsLangMenuOpen(false); }} className={`${styles.langOption} ${locale === 'fr' ? styles.activeLang : ''}`}>
                                        <Globe size={16} />
                                        <span>FR</span>
                                        <span className={styles.langLabel}>Français</span>
                                    </div>
                                    <div onClick={(e) => { e.stopPropagation(); switchLocale('ar'); setIsLangMenuOpen(false); }} className={`${styles.langOption} ${locale === 'ar' ? styles.activeLang : ''}`}>
                                        <Globe size={16} />
                                        <span>AR</span>
                                        <span className={styles.langLabel}>العربية</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Link href={`/${locale}/list`} className={styles.listLink}>
                            <PlusCircle size={18} style={{ marginRight: '8px' }} />
                            {t('list_item')}
                        </Link>

                        {showLogin && (
                            <div className={styles.userMenu} aria-haspopup="true" aria-expanded={isUserMenuOpen} aria-label="User Menu">
                                <div className={styles.userPill} onClick={toggleUserMenu}>
                                    <Menu size={18} className={styles.menuIcon} />
                                    {isAuthenticated ? (
                                        <div className={styles.userAvatar}>
                                            {user?.full_name?.charAt(0).toUpperCase()}
                                        </div>
                                    ) : (
                                        <UserCircle size={24} className={styles.userIcon} />
                                    )}
                                </div>

                                <div className={`${styles.userDropdown} ${isUserMenuOpen ? styles.show : ''}`}>
                                    {isAuthenticated ? (
                                        <>
                                            <div className={styles.userInfo}>
                                                <div className={styles.userGreeting}>Bonjour,</div>
                                                <div className={styles.userName}>{user?.full_name}</div>
                                            </div>
                                            <div className={styles.separator}></div>

                                            <Link href={`/${locale}/tableau-de-bord`} className={styles.userDropdownLink} onClick={() => setIsUserMenuOpen(false)}>
                                                <LayoutDashboard size={18} className={styles.dropdownIcon} />
                                                {t('dashboard')}
                                            </Link>
                                            <Link href={`/${locale}/tableau-de-bord/annonces`} className={styles.userDropdownLink} onClick={() => setIsUserMenuOpen(false)}>
                                                <List size={18} className={styles.dropdownIcon} />
                                                {t('my_listings')}
                                            </Link>

                                            <div className={styles.separator}></div>

                                            {user?.role === 'ADMIN' && (
                                                <Link href={`/${locale}/admin`} className={styles.userDropdownLink} onClick={() => setIsUserMenuOpen(false)}>
                                                    <ShieldCheck size={18} className={styles.dropdownIcon} />
                                                    {t('admin_dashboard')}
                                                </Link>
                                            )}

                                            <div onClick={() => { logout(); setIsUserMenuOpen(false); }} className={`${styles.userDropdownLink} ${styles.cursorPointer}`}>
                                                <LogOut size={18} className={styles.dropdownIcon} />
                                                {t('logout')}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link href={`/${locale}/login`} onClick={() => setIsUserMenuOpen(false)} className={`${styles.userDropdownLink} ${styles.cursorPointer} ${styles.boldLink}`}>
                                                {t('login')}
                                            </Link>
                                            <Link href={`/${locale}/register`} onClick={() => setIsUserMenuOpen(false)} className={`${styles.userDropdownLink} ${styles.cursorPointer}`}>
                                                {t('signup')}
                                            </Link>

                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>


        </>
    );
}
