'use client';

import { useAuthStore } from '@/lib/auth-store';
import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Save, User, Lock, Bell, CreditCard, ChevronRight, Camera, ChevronDown } from 'lucide-react';
import { fetchCities, City, getLocalizedName } from '@/lib/api';
import styles from './settings.module.css';

export default function SettingsPage() {
    const { user } = useAuthStore();
    const t = useTranslations('Dashboard');
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        fetchCities().then(setCities);
    }, []);

    if (!user) return null;

    const isGoogleUser = !!(user as any).google_id;

    const tabs = [
        { id: 'profile', label: t('settings_page.personal_info'), icon: User },
        { id: 'security', label: t('settings_page.login_security'), icon: Lock },
        { id: 'notifications', label: t('settings_page.notifications'), icon: Bell },
        { id: 'payments', label: t('settings_page.payments'), icon: CreditCard },
    ];

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 800);
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>{t('settings_page.title')}</h1>
                <p className={styles.subtitle}>
                    <strong>{user.full_name}</strong>, {user.email}
                    {isGoogleUser && (
                        <span className={styles.googleBadge}>
                            <svg viewBox="0 0 24 24" width="14" height="14">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </span>
                    )}
                </p>
            </header>

            <div className={styles.layout}>
                {/* Sidebar Navigation */}
                <nav className={styles.nav}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ''}`}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                            <ChevronRight size={16} className={styles.navArrow} />
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className={styles.content}>
                    {activeTab === 'profile' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t('settings_page.personal_info')}</h2>
                                <p className={styles.sectionDesc}>Update your photo and personal details here.</p>
                            </div>

                            {/* Avatar */}
                            <div className={styles.avatarSection}>
                                <div className={styles.avatar}>
                                    {(user as any).avatar ? (
                                        <img src={(user as any).avatar} alt={user.full_name} className={styles.avatarImg} />
                                    ) : (
                                        user.full_name?.charAt(0)
                                    )}
                                </div>
                                <button className={styles.avatarBtn}>
                                    <Camera size={16} />
                                    {t('settings_page.update_photo')}
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t('settings_page.full_name')}</label>
                                    <input
                                        type="text"
                                        defaultValue={user.full_name}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t('settings_page.email')}</label>
                                    <input
                                        type="email"
                                        defaultValue={user.email}
                                        disabled
                                        className={`${styles.input} ${styles.inputDisabled}`}
                                    />
                                    {isGoogleUser && (
                                        <span className={styles.inputHint}>Linked with Google account</span>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t('settings_page.phone')}</label>
                                    <input
                                        type="tel"
                                        placeholder="+212 6XX XXX XXX"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t('settings_page.location')}</label>
                                    <div className={styles.selectWrapper}>
                                        <select
                                            value={selectedCity}
                                            onChange={(e) => setSelectedCity(e.target.value)}
                                            className={styles.select}
                                        >
                                            <option value="">{t('settings_page.select_city')}</option>
                                            {cities.map(city => (
                                                <option key={city.id} value={city.id}>
                                                    {getLocalizedName(city, locale)}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className={styles.selectIcon} />
                                    </div>
                                </div>
                                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                    <label className={styles.label}>{t('settings_page.bio')}</label>
                                    <textarea
                                        rows={3}
                                        placeholder={t('settings_page.bio_placeholder')}
                                        className={styles.textarea}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t('settings_page.login_security')}</h2>
                                <p className={styles.sectionDesc}>Manage your password and account security.</p>
                            </div>

                            <div className={styles.securityList}>
                                {isGoogleUser ? (
                                    <div className={styles.googleNotice}>
                                        <svg viewBox="0 0 24 24" width="24" height="24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                        <div>
                                            <h4>Signed in with Google</h4>
                                            <p>Your account security is managed by Google. Visit your Google Account settings to update your password.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.securityItem}>
                                        <div className={styles.securityInfo}>
                                            <h4>{t('settings_page.password')}</h4>
                                            <p>{t('settings_page.password_updated')}</p>
                                        </div>
                                        <button className={styles.updateBtn}>{t('settings_page.update')}</button>
                                    </div>
                                )}
                                <div className={styles.securityItem}>
                                    <div className={styles.securityInfo}>
                                        <h4>{t('settings_page.two_factor')}</h4>
                                        <p>{t('settings_page.two_factor_desc')}</p>
                                    </div>
                                    <button className={styles.updateBtn}>{t('settings_page.setup')}</button>
                                </div>
                                <div className={styles.securityItem}>
                                    <div className={styles.securityInfo}>
                                        <h4>{t('settings_page.active_sessions')}</h4>
                                        <p>{t('settings_page.sessions_desc')}</p>
                                    </div>
                                    <button className={styles.updateBtn}>{t('settings_page.manage')}</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t('settings_page.notifications')}</h2>
                                <p className={styles.sectionDesc}>Choose how you want to be notified.</p>
                            </div>

                            <div className={styles.notificationsList}>
                                {[
                                    { key: 'messages', title: t('settings_page.notif_messages'), desc: t('settings_page.notif_messages_desc'), checked: true },
                                    { key: 'bookings', title: t('settings_page.notif_bookings'), desc: t('settings_page.notif_bookings_desc'), checked: true },
                                    { key: 'updates', title: t('settings_page.notif_updates'), desc: t('settings_page.notif_updates_desc'), checked: true },
                                    { key: 'promos', title: t('settings_page.notif_promos'), desc: t('settings_page.notif_promos_desc'), checked: false },
                                ].map((item) => (
                                    <label key={item.key} className={styles.notificationItem}>
                                        <div className={styles.notificationInfo}>
                                            <h4>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </div>
                                        <div className={styles.toggle}>
                                            <input type="checkbox" defaultChecked={item.checked} />
                                            <span className={styles.toggleSlider}></span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t('settings_page.payments')}</h2>
                                <p className={styles.sectionDesc}>Manage your payment methods and payout preferences.</p>
                            </div>

                            <div className={styles.paymentCard}>
                                <CreditCard size={24} className={styles.paymentIcon} />
                                <div className={styles.paymentInfo}>
                                    <h4>{t('settings_page.no_payment')}</h4>
                                    <p>{t('settings_page.no_payment_desc')}</p>
                                </div>
                                <button className={styles.addBtn}>{t('settings_page.add')}</button>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className={styles.footer}>
                        <button className={styles.dangerBtn}>
                            {t('settings_page.deactivate')}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className={styles.saveBtn}
                        >
                            {isLoading ? t('settings_page.saving') : t('settings_page.save')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
