'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '../../../navigation';
import { apiLogin, apiGoogleLogin } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useTranslations } from 'next-intl';
import { Loader2, ArrowRight } from 'lucide-react';
import { Link } from '../../../navigation';
import { useGoogleLogin } from '@react-oauth/google';
import styles from './auth.module.css';
import Image from 'next/image';

function toErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }
    if (typeof error === 'string') {
        return error;
    }
    return fallback;
}

export default function LoginPage() {
    const t = useTranslations('Auth');
    const router = useRouter();
    const setAuth = useAuthStore(state => state.setAuth);
    const { isAuthenticated, user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json();

                const data = await apiGoogleLogin({
                    email: userInfo.email,
                    google_id: userInfo.sub,
                    full_name: userInfo.name,
                    avatar: userInfo.picture
                });

                setAuth(data.user, data.token);
            } catch (err: unknown) {
                console.error('Google Login Error', err);
                setError(toErrorMessage(err, 'Google Login failed'));
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Login Failed');
        }
    });

    useEffect(() => {
        if (mounted && isAuthenticated) {
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get('redirect');
            const localeFromPath = window.location.pathname.split('/')[1];
            const locale = (localeFromPath === 'fr' || localeFromPath === 'ar') ? localeFromPath : 'fr';

            if (redirectUrl) {
                const cleanRedirectUrl = redirectUrl.replace(/^\/(fr|ar)(\/|$)/, '/');
                const finalPath = `/${locale}${cleanRedirectUrl.startsWith('/') ? '' : '/'}${cleanRedirectUrl}`;
                router.replace(finalPath as any);
            } else {
                router.replace((user?.role === 'ADMIN' ? '/admin' : '/tableau-de-bord') as any);
            }
        }
    }, [isAuthenticated, mounted, user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiLogin(formData);
            setAuth(data.user, data.token);
        } catch (err: unknown) {
            let errorMessage = 'Échec de la connexion';
            const rawErrorMessage = toErrorMessage(err, '');
            if (rawErrorMessage) {
                try {
                    const parsed = JSON.parse(rawErrorMessage.replace(/^API Error: \d+ - /, ''));
                    if (parsed.errors) {
                        const firstError = Object.values(parsed.errors)[0];
                        errorMessage = Array.isArray(firstError) ? firstError[0] : String(firstError);
                    } else if (parsed.message) {
                        errorMessage = parsed.message;
                    }
                } catch {
                    errorMessage = rawErrorMessage;
                }
            }
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <div className={styles.page} suppressHydrationWarning>
            <div className={styles.card}>
                {isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
                        <p className="text-slate-600 font-medium">{t('logging_in')}</p>
                    </div>
                ) : (
                    <>
                        <header className={styles.header}>
                            <div className={styles.logoArea}>
                                <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-2">
                                    <span className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">P</span>
                                    PARQ
                                </h1>
                            </div>
                            <h2 className={styles.title}>{t('welcome_back')}</h2>
                            <p className={styles.subtitle}>{t('login_subtitle')}</p>
                        </header>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('email_label')}</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className={styles.input}
                                    placeholder="name@company.com"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <div className="flex justify-between items-center mb-1">
                                    <label className={styles.label}>{t('password_label')}</label>
                                    <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">{t('forgot_password')}</Link>
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className={styles.input}
                                    placeholder="••••••••"
                                />
                            </div>

                            <button type="submit" className={styles.button} disabled={loading}>
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                {loading ? t('logging_in') : t('login_btn')}
                                {!loading && <ArrowRight size={18} className="rtl:rotate-180" />}
                            </button>
                        </form>

                        <div className={styles.divider}>{t('or_continue')}</div>

                        <div className={styles.socialLogin}>
                            <button className={styles.socialButton} onClick={() => handleGoogleLogin()} type="button">
                                <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} />
                                <span className="font-medium text-slate-700">{t('continue_google')}</span>
                            </button>
                        </div>

                        <div className={styles.footer}>
                            {t('no_account')}
                            <Link href="/register" className={styles.link}>{t('signup_link')}</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
