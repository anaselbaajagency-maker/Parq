'use client';

import { useState, useEffect } from 'react';

import { apiRegister, RegisterPayload } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { UserPlus, Loader2 } from 'lucide-react';
import { Link, useRouter } from '../../../navigation';
import { useTranslations } from 'next-intl';
import { useGoogleLogin } from '@react-oauth/google';
import { getErrorMessage } from '@/lib/error-message';
import styles from '../login/auth.module.css';
import Image from 'next/image';

interface GoogleUserInfo {
    name: string;
    email: string;
    sub: string;
    picture?: string;
}

export default function RegisterPage() {
    const t = useTranslations('Auth');
    const setAuth = useAuthStore(state => state.setAuth);
    const isAuthenticated = useAuthStore(state => state.isAuthenticated);
    const user = useAuthStore(state => state.user);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        phone: '',
        role: 'CLIENT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);

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
    }, [mounted, isAuthenticated, user, router]);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const userInfo = await userInfoRes.json() as Partial<GoogleUserInfo>;

                if (!userInfo.name || !userInfo.email || !userInfo.sub) {
                    throw new Error('Google profile data is incomplete');
                }

                const payload: RegisterPayload = {
                    full_name: userInfo.name,
                    email: userInfo.email,
                    google_id: userInfo.sub,
                    role: formData.role,
                    password: null,
                    avatar: userInfo.picture,
                    phone: formData.phone
                };
                const data = await apiRegister(payload);

                setAuth(data.user, data.token);
            } catch (err: unknown) {
                console.error('Google Sign Up Error', err);
                setError(getErrorMessage(err, 'Google Sign Up failed'));
                setLoading(false);
            }
        },
        onError: () => {
            setError('Google Sign Up Failed');
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiRegister(formData);
            setAuth(data.user, data.token);
        } catch (err: unknown) {
            setError(getErrorMessage(err, t('error') || 'Registration failed.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page} suppressHydrationWarning>
            <div className={styles.card}>
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="animate-spin text-yellow-500 mb-4" size={48} />
                        <p className="text-slate-600 font-medium">{t('signing_up')}</p>
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
                            <h2 className={styles.title}>{t('create_account')}</h2>
                            <p className={styles.subtitle}>{t('signup_subtitle')}</p>
                        </header>

                        <form className={styles.form} onSubmit={handleSubmit}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('fullname_label')}</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.full_name}
                                    onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                                    className={styles.input}
                                    placeholder="John Doe"
                                />
                            </div>

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
                                <label className={styles.label}>{t('phone_label')}</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className={styles.input}
                                    placeholder="+212 6..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('password_label')}</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className={styles.input}
                                    placeholder="••••••••"
                                />
                            </div>

                            <p className="text-[11px] text-gray-500 mt-2">
                                {t('agree_terms')}
                            </p>

                            <button type="submit" className={styles.button} disabled={loading}>
                                <UserPlus size={20} />
                                {t('signup_btn')}
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
                            {t('have_account')}
                            <Link href="/login" className={styles.link}>{t('login_link')}</Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
