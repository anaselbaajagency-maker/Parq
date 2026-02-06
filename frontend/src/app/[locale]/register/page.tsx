'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRegister } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { UserPlus, Mail, Lock, User, Phone, Loader2 } from 'lucide-react';
import { Link } from '../../../navigation';
import { useTranslations } from 'next-intl';
import { useGoogleLogin } from '@react-oauth/google';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const setAuth = useAuthStore(state => state.setAuth);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'CLIENT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiRegister(formData);
            setAuth(data.user, data.token);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || t('error') || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                // Fetch info
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();

                // Backend login (which handles user creation)
                const data = await apiRegister({
                    full_name: userInfo.name,
                    email: userInfo.email,
                    google_id: userInfo.sub,
                    role: formData.role, // Use selected role
                    password: null, // No password for Google users
                    avatar: userInfo.picture,
                    phone: formData.phone // Optional logic for phone if available
                } as any);

                setAuth(data.user, data.token);
                // Redirect handled by success logic in handleSubmit or useEffect
                router.push('/dashboard');
            } catch (err: any) {
                console.error('Google Sign Up Error', err);
                setError(err.message || 'Google Sign Up failed');
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Sign Up Failed');
        }
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin" size={32} /></div>;

    return (
        <div className={styles.page}>
            {/* Left Section: Hero */}
            <div className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    <div className={styles.gridPattern}></div>
                    <div className={styles.glow}></div>
                </div>

                <div className={styles.heroContent}>
                    <div>
                        <div className={styles.heroTag}>
                            {t('register_hero_tag')}
                        </div>
                        <h1 className={styles.heroTitle}>
                            {t('register_hero_title')} <br /> <span>{t('register_hero_title_accent')}</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            {t('register_hero_subtitle')}
                        </p>
                    </div>

                    <div className={styles.heroFooter}>
                        <span>{t('footer_rights')}</span>
                        <span>{t('privacy_policy')}</span>
                        <span>{t('terms_of_service')}</span>
                    </div>
                </div>
            </div>

            {/* Right Section: Form */}
            <div className={styles.formSection}>
                <div className={styles.card}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>{t('create_account')}</h1>
                        <p className={styles.subtitle}>{t('signup_subtitle')}</p>
                    </header>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('fullname_label')}</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className={styles.input}
                                    placeholder="John Doe"
                                    style={{ paddingInlineStart: '1rem' }}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('email_label')}</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className={styles.input}
                                    placeholder="name@company.com"
                                    style={{ paddingInlineStart: '1rem' }}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('phone_label')}</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className={styles.input}
                                    placeholder="+212 6..."
                                    style={{ paddingInlineStart: '1rem' }}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('password_label')}</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className={styles.input}
                                    placeholder="••••••••"
                                    style={{ paddingInlineStart: '1rem' }}
                                />
                            </div>
                        </div>



                        <p className="text-[11px] text-gray-500 mt-2">
                            {t('agree_terms')}
                        </p>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                            {loading ? t('signing_up') : t('signup_btn')}
                        </button>
                    </form>

                    <div className={styles.divider}>{t('or_continue')}</div>

                    <div className={styles.socialLogin}>
                        <button className={styles.socialButton} onClick={() => handleGoogleLogin()} type="button">
                            <img src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
                            <span className="font-medium text-slate-700">{t('continue_google')}</span>
                        </button>
                    </div>

                    <div className={styles.footer}>
                        {t('have_account')}
                        <Link href="/login" className={styles.link}>{t('login_link')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
