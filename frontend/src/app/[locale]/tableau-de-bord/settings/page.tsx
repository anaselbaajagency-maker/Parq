'use client';

import { useAuthStore } from '@/lib/auth-store';
import { useRef, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Save, User, Lock, Bell, CreditCard, ChevronRight, Camera, ChevronDown } from 'lucide-react';
import { fetchCities, City, getLocalizedName, apiUser, parseImageUrl } from '@/lib/api';
import styles from './settings.module.css';
import Image from 'next/image';
export default function SettingsPage() {
    const { user, isAuthenticated, updateUser } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const t = useTranslations('Dashboard');
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarLoading(true);
        try {
            const res = await apiUser.updateAvatar(file);
            if (res.user) {
                updateUser(res.user as any);
            }
            alert(t('settings_page.success_message'));
        } catch (error) {
            console.error('Failed to upload avatar', error);
            alert(t('settings_page.error_message'));
        } finally {
            setAvatarLoading(false);
        }
    };
    const [activeTab, setActiveTab] = useState('profile');
    const [cities, setCities] = useState<City[]>([]);
    
    // Form state
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        city_id: '',
        bio: ''
    });

    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const [twoFactorStatus, setTwoFactorStatus] = useState<{ enabled: boolean; confirmed: boolean }>({ enabled: false, confirmed: false });
    const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
    const [twoFactorData, setTwoFactorData] = useState<{ secret: string; qr_code_svg: string; qr_code_url: string } | null>(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
    const [isVerifying2FA, setIsVerifying2FA] = useState(false);

    const [sessions, setSessions] = useState<any[]>([]);
    const [showSessionsList, setShowSessionsList] = useState(false);
    const [isSessionsLoading, setIsSessionsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                phone: (user as any).phone || '',
                city_id: String((user as any).city_id || ''),
                bio: (user as any).bio || ''
            });

            // Fetch 2FA status
            apiUser.get2FAStatus().then(setTwoFactorStatus).catch(console.error);
            // Fetch sessions
            fetchSessions();
        }
    }, [user]);

    const fetchSessions = async () => {
        setIsSessionsLoading(true);
        try {
            const res = await apiUser.getSessions();
            setSessions(res.sessions);
        } catch (error) {
            console.error('Failed to fetch sessions', error);
        } finally {
            setIsSessionsLoading(false);
        }
    };

    useEffect(() => {
        if (!isMounted) return;
        fetchCities().then(setCities);
    }, [isMounted]);

    if (!isMounted) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid #f3f3f3', borderTop: '3px solid #3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) {
        if (isAuthenticated) {
            return (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px' }}>
                    <p>Chargement du profil...</p>
                </div>
            );
        }
        return null; // Layout will handle redirect
    }

    const isGoogleUser = !!(user as any).google_id;

    const tabs = [
        { id: 'profile', label: t('settings_page.personal_info'), icon: User },
        { id: 'security', label: t('settings_page.login_security'), icon: Lock },
        { id: 'notifications', label: t('settings_page.notifications'), icon: Bell },
        // { id: 'payments', label: t('settings_page.payments'), icon: CreditCard },
    ];

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.password !== passwordData.password_confirmation) {
            alert(t('settings_page.password_mismatch') || 'Les mots de passe ne correspondent pas.');
            return;
        }

        setIsPasswordUpdating(true);
        try {
            await apiUser.changePassword(passwordData);
            alert(t('settings_page.password_change_success'));
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: ''
            });
            setShowPasswordForm(false);
        } catch (error: any) {
            console.error('Failed to change password', error);
            alert(t('settings_page.password_change_error'));
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    const handleEnable2FA = async () => {
        try {
            const data = await apiUser.enable2FA();
            setTwoFactorData(data);
            setShowTwoFactorModal(true);
        } catch (error) {
            console.error('Failed to initiate 2FA setup', error);
            alert(t('settings_page.error_message'));
        }
    };

    const handleConfirm2FA = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying2FA(true);
        try {
            const res = await apiUser.confirm2FA(verificationCode);
            setRecoveryCodes(res.recovery_codes);
            setTwoFactorStatus({ enabled: true, confirmed: true });
            alert(t('settings_page.password_change_success'));
        } catch (error: any) {
            console.error('Failed to confirm 2FA', error);
            alert(error.message || t('settings_page.password_change_error'));
        } finally {
            setIsVerifying2FA(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!confirm(t('settings_page.two_factor_disable_confirm') || 'Êtes-vous sûr de vouloir désactiver l\'authentification à deux facteurs ?')) return;
        try {
            await apiUser.disable2FA();
            setTwoFactorStatus({ enabled: false, confirmed: false });
            alert(t('settings_page.password_change_success'));
        } catch (error) {
            console.error('Failed to disable 2FA', error);
            alert(t('settings_page.error_message'));
        }
    };

    const handleRevokeSession = async (id: number) => {
        try {
            await apiUser.revokeSession(id);
            setSessions(sessions.filter(s => s.id !== id));
            alert(t('settings_page.password_change_success'));
        } catch (error) {
            console.error('Failed to revoke session', error);
            alert(t('settings_page.password_change_error') || 'Erreur lors de la révocation');
        }
    };

    const handleRevokeOthers = async () => {
        if (!confirm(t('settings_page.session_revoke_others_confirm'))) return;
        try {
            await apiUser.revokeOtherSessions();
            setSessions(sessions.filter(s => s.is_current));
            alert(t('settings_page.password_change_success'));
        } catch (error) {
            console.error('Failed to revoke other sessions', error);
            alert(t('settings_page.password_change_error') || 'Erreur lors de la révocation');
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const res = await apiUser.updateProfile({
                full_name: formData.full_name,
                phone: formData.phone,
                city_id: formData.city_id ? Number(formData.city_id) : null,
                bio: formData.bio
            });
            
            // Update local user state
            if (res.user) {
                updateUser(res.user as any);
            }
            
            alert(t('settings_page.success_message'));
        } catch (error) {
            console.error('Failed to update profile', error);
            alert(t('settings_page.error_message'));
        } finally {
            setIsLoading(false);
        }
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
                                <p className={styles.sectionDesc}>{t('settings_page.profile_desc')}</p>
                            </div>

                            {/* Avatar */}
                            <div className={styles.avatarSection}>
                                <div className={styles.avatar}>
                                    {avatarLoading ? (
                                        <div className={styles.loader} />
                                    ) : (user as any).avatar ? (
                                        <Image 
                                            src={parseImageUrl((user as any).avatar) || (user as any).avatar} 
                                            alt={user.full_name} 
                                            className={styles.avatarImg} 
                                            width={88} 
                                            height={88} 
                                            unoptimized
                                        />
                                    ) : (
                                        user.full_name?.charAt(0)
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                                <button 
                                    className={styles.avatarBtn}
                                    onClick={handleAvatarClick}
                                    disabled={avatarLoading}
                                >
                                    <Camera size={16} />
                                    {avatarLoading ? t('settings_page.saving') : t('settings_page.update_photo')}
                                </button>
                            </div>

                            {/* Form Fields */}
                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t('settings_page.full_name')}</label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
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
                                        <span className={styles.inputHint}>{t('settings_page.google_linked')}</span>
                                    )}
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t('settings_page.phone')}</label>
                                    <input
                                        type="tel"
                                        placeholder="+212 6XX XXX XXX"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>{t('settings_page.location')}</label>
                                    <div className={styles.selectWrapper}>
                                        <select
                                            value={formData.city_id}
                                            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
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
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                                <p className={styles.sectionDesc}>{t('settings_page.security_desc')}</p>
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
                                            <h4>{t('settings_page.google_signed_in')}</h4>
                                            <p>{t('settings_page.google_security_managed')}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.securityItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <div className={styles.securityInfo}>
                                                <h4>{t('settings_page.password')}</h4>
                                                <p>{t('settings_page.password_updated')}</p>
                                            </div>
                                            <button 
                                                className={styles.updateBtn}
                                                onClick={() => setShowPasswordForm(!showPasswordForm)}
                                            >
                                                {showPasswordForm ? t('common.cancel') || 'Annuler' : t('settings_page.update')}
                                            </button>
                                        </div>

                                        {showPasswordForm && (
                                            <form onSubmit={handlePasswordChange} className={styles.formGrid} style={{ width: '100%', marginTop: '10px' }}>
                                                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                                    <label className={styles.label}>{t('settings_page.current_password')}</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.current_password}
                                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                        className={styles.input}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>{t('settings_page.new_password')}</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.password}
                                                        onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                                        className={styles.input}
                                                    />
                                                </div>
                                                <div className={styles.formGroup}>
                                                    <label className={styles.label}>{t('settings_page.confirm_password')}</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwordData.password_confirmation}
                                                        onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                                        className={styles.input}
                                                    />
                                                </div>
                                                <div className={styles.formGroupFull}>
                                                    <button 
                                                        type="submit" 
                                                        disabled={isPasswordUpdating}
                                                        className={styles.saveBtn}
                                                        style={{ padding: '10px 24px', fontSize: '14px', width: 'auto' }}
                                                    >
                                                        {isPasswordUpdating ? t('settings_page.saving') : t('settings_page.save')}
                                                    </button>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                )}
                                    <div className={styles.securityItem}>
                                        <div className={styles.securityInfo}>
                                            <h4>{t('settings_page.two_factor')}</h4>
                                            <p>{t('settings_page.two_factor_desc')}</p>
                                            {twoFactorStatus.confirmed && (
                                                <span className={styles.statusBadge} style={{ color: '#10b981', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', marginTop: '4px', display: 'inline-block' }}>
                                                    {t('settings_page.two_factor_status_enabled')}
                                                </span>
                                            )}
                                        </div>
                                        {twoFactorStatus.confirmed ? (
                                            <button className={styles.updateBtn} style={{ color: '#ef4444' }} onClick={handleDisable2FA}>
                                                {t('common.deactivate')}
                                            </button>
                                        ) : (
                                            <button className={styles.updateBtn} onClick={handleEnable2FA}>
                                                {t('settings_page.setup')}
                                            </button>
                                        )}
                                    </div>

                                    {showTwoFactorModal && (
                                        <div className={styles.modalOverlay} style={{
                                            position: 'fixed',
                                            top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                            zIndex: 1000,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div className={styles.modalContent} style={{
                                                backgroundColor: 'white',
                                                padding: '30px',
                                                borderRadius: '16px',
                                                maxWidth: '500px',
                                                width: '100%',
                                                textAlign: 'center'
                                            }}>
                                                <h3 style={{ marginBottom: '20px' }}>{t('settings_page.two_factor_title')}</h3>
                                                
                                                {!recoveryCodes ? (
                                                    <div style={{ textAlign: 'left' }}>
                                                        <p style={{ marginBottom: '15px' }}>{t('settings_page.two_factor_step1')}</p>
                                                        {twoFactorData && (
                                                            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }} 
                                                                 dangerouslySetInnerHTML={{ __html: twoFactorData.qr_code_svg }} />
                                                        )}
                                                        <p style={{ marginBottom: '10px' }}>{t('settings_page.two_factor_step2')}</p>
                                                        <form onSubmit={handleConfirm2FA}>
                                                            <input 
                                                                type="text" 
                                                                placeholder={t('settings_page.two_factor_placeholder')}
                                                                value={verificationCode}
                                                                onChange={(e) => setVerificationCode(e.target.value)}
                                                                className={styles.input}
                                                                style={{ marginBottom: '15px', textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
                                                                maxLength={6}
                                                                required
                                                            />
                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                <button type="button" className={styles.dangerBtn} onClick={() => setShowTwoFactorModal(false)} style={{ flex: 1 }}>
                                                                    {t('common.cancel') || 'Annuler'}
                                                                </button>
                                                                <button type="submit" disabled={isVerifying2FA} className={styles.saveBtn} style={{ flex: 1 }}>
                                                                    {isVerifying2FA ? t('settings_page.saving') : t('settings_page.two_factor_verify')}
                                                                </button>
                                                            </div>
                                                        </form>
                                                    </div>
                                                ) : (
                                                    <div style={{ textAlign: 'left' }}>
                                                        <p style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '15px' }}>{t('settings_page.two_factor_enabled_msg')}</p>
                                                        <h4 style={{ marginBottom: '10px' }}>{t('settings_page.two_factor_recovery_title')}</h4>
                                                        <p style={{ fontSize: '13px', marginBottom: '15px', color: '#666' }}>{t('settings_page.two_factor_recovery_desc')}</p>
                                                        <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                                            {recoveryCodes.map(code => (
                                                                <code key={code} style={{ fontSize: '14px', color: '#333' }}>{code}</code>
                                                            ))}
                                                        </div>
                                                        <button className={styles.saveBtn} onClick={() => setShowTwoFactorModal(false)} style={{ width: '100%' }}>
                                                            {t('common.finish')}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div className={styles.securityItem} style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <div className={styles.securityInfo}>
                                                <h4>{t('settings_page.active_sessions')}</h4>
                                                <p>{t('settings_page.active_sessions_desc')}</p>
                                            </div>
                                            <button 
                                                className={styles.updateBtn}
                                                onClick={() => setShowSessionsList(!showSessionsList)}
                                            >
                                                {showSessionsList ? t('common.cancel') || 'Fermer' : t('settings_page.manage')}
                                            </button>
                                        </div>

                                        {showSessionsList && (
                                            <div style={{ width: '100%', marginTop: '10px' }}>
                                                {sessions.length > 1 && (
                                                    <button 
                                                        onClick={handleRevokeOthers}
                                                        className={styles.updateBtn}
                                                        style={{ color: '#ef4444', marginBottom: '20px', padding: '0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
                                                    >
                                                        {t('settings_page.session_revoke_others')}
                                                    </button>
                                                )}

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                                    {sessions.map((session) => (
                                                        <div key={session.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #f3f4f6', borderRadius: '12px', backgroundColor: '#f9f9fb' }}>
                                                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                                <div style={{ padding: '8px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                                                                    {session.device_name.toLowerCase().includes('web') ? (
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                                                                    ) : (
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                                        <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{session.device_name}</h5>
                                                                        {session.is_current && (
                                                                            <span style={{ fontSize: '11px', color: '#10b981', backgroundColor: '#ecfdf5', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>
                                                                                {t('settings_page.session_current')}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                                                                        {session.ip_address} • {t('settings_page.session_last_active', { date: new Date(session.last_used_at || session.created_at).toLocaleDateString() })}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {!session.is_current && (
                                                                <button 
                                                                    onClick={() => handleRevokeSession(session.id)}
                                                                    className={styles.updateBtn}
                                                                    style={{ color: '#ef4444', fontSize: '13px' }}
                                                                >
                                                                    {t('settings_page.session_revoke')}
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t('settings_page.notifications')}</h2>
                                <p className={styles.sectionDesc}>{t('settings_page.notifications_desc')}</p>
                            </div>

                            <div className={styles.notificationsList}>
                                {[
                                    { key: 'messages', title: t('settings_page.notif_messages'), desc: t('settings_page.notif_messages_desc'), checked: true },
                                    { key: 'bookings', title: t('settings_page.notif_bookings'), desc: t('settings_page.notif_bookings_desc'), checked: true },
                                    { key: 'updates', title: t('settings_page.notif_updates'), desc: t('settings_page.notif_updates_desc'), checked: true },
                                    { key: 'promos', title: t('settings_page.notif_promos'), desc: t('settings_page.notif_promos_desc'), checked: true },
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

                    {/* {activeTab === 'payments' && (
                        <div className={styles.section}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>{t('settings_page.payments')}</h2>
                                <p className={styles.sectionDesc}>{t('settings_page.payments_desc')}</p>
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
                    )} */}

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
