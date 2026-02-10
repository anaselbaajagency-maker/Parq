'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '../../../navigation';
import { apiLogin, apiGoogleLogin } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useTranslations } from 'next-intl';
import { LogIn, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { Link } from '../../../navigation';
import { useGoogleLogin } from '@react-oauth/google';
import styles from './auth.module.css';

export default function LoginPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const setAuth = useAuthStore(state => state.setAuth);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { isAuthenticated, user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                // Fetch info
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();

                // Backend login
                const data = await apiGoogleLogin({
                    email: userInfo.email,
                    google_id: userInfo.sub,
                    full_name: userInfo.name,
                    avatar: userInfo.picture
                });

                setAuth(data.user, data.token);
                // We use useEffect to redirect
            } catch (err: any) {
                console.error('Google Login Error', err);
                setError(err.message || 'Google Login failed');
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Login Failed');
        }
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && isAuthenticated) {
            router.push((user?.role === 'ADMIN' ? '/admin' : '/tableau-de-bord') as any);
        }
    }, [isAuthenticated, mounted, router, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiLogin(formData);
            setAuth(data.user, data.token);
            // Redirect handled by useEffect
        } catch (err: any) {
            // Parse API error message
            let errorMessage = 'Échec de la connexion';
            if (err.message) {
                try {
                    // Try to parse JSON error from API
                    const parsed = JSON.parse(err.message.replace(/^API Error: \d+ - /, ''));
                    if (parsed.errors) {
                        // Get first error message from validation errors
                        const firstError = Object.values(parsed.errors)[0];
                        errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
                    } else if (parsed.message) {
                        errorMessage = parsed.message;
                    }
                } catch {
                    // If not JSON, use plain message
                    errorMessage = err.message;
                }
            }
            setError(errorMessage);
            setLoading(false);
        }
    };

    if (!mounted) return null;
    if (isAuthenticated) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin" size={32} /></div>;

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
                            {t('hero_tag')}
                        </div>
                        <h1 className={styles.heroTitle}>
                            {t('hero_title')} <br /> <span>{t('hero_title_accent')}</span>
                        </h1>
                        <p className={styles.heroSubtitle}>
                            {t('hero_subtitle')}
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
                        <div className={styles.logoArea}>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tighter flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-yellow-500 flex items-center justify-center text-white">P</span>
                                PARQ
                            </h1>
                        </div>
                        <h1 className={styles.title}>{t('welcome_back')}</h1>
                        <p className={styles.subtitle}>{t('login_subtitle')}</p>
                    </header>

                    <form className={styles.form} onSubmit={handleSubmit}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('email_label')}</label>
                            <div className="relative">
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
                            <div className="flex justify-between items-center mb-1">
                                <label className={styles.label}>{t('password_label')}</label>
                                <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">{t('forgot_password')}</Link>
                            </div>
                            <div className="relative">
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

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {loading ? t('logging_in') : t('login_btn')}
                            {!loading && <ArrowRight size={18} className="rtl:rotate-180" />}
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
                        {t('no_account')}
                        <Link href="/register" className={styles.link}>{t('signup_link')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
