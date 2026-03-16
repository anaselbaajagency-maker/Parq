'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useGoogleLogin } from '@react-oauth/google';
import { apiGoogleLogin } from '@/lib/api';
// Assuming LoginModal needs to manipulate auth state directly or reload?
// Usually it should use a store, but let's check imports.
import { useRouter } from '../navigation';
import { useAuthStore } from '@/lib/auth-store';
import { X } from 'lucide-react';
import styles from './LoginModal.module.css';

function SocialButtons({ onGoogle, googleLabel }: { onGoogle: () => void; googleLabel: string }) {
    return (
        <div className={styles.socialButtons}>
            <button type="button" className={styles.socialBtn} onClick={onGoogle}>
                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 0, 0)">
                        <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
                        <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" />
                        <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
                        <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0 7.565 0 3.515 2.7 1.545 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
                    </g>
                </svg>
                {googleLabel}
            </button>
            {/* Facebook Hidden
            <button type="button" className={styles.socialBtn}>
                ...
            </button>
            */}
        </div>
    );
}

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    checkInDate?: Date; // Optional: prep for future booking flow context
    checkOutDate?: Date;
    initialView?: 'login' | 'register';
}

function getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof Error && error.message) {
        return error.message;
    }

    if (typeof error === 'string' && error) {
        return error;
    }

    return fallback;
}

export default function LoginModal({ isOpen, onClose, initialView = 'login' }: LoginModalProps) {
    const t = useTranslations('Auth');
    const [view, setView] = useState<'login' | 'register'>(initialView);
    const setAuth = useAuthStore(state => state.setAuth);
    const router = useRouter();

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    const loginWithGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
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
                // alert(t('success') || 'Login successful');
                onClose();
                if (data.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/tableau-de-bord');
                }
            } catch (err: unknown) {
                console.error(err);
                setLoginError(getErrorMessage(err, 'Google Login Failed'));
            }
        },
        onError: () => setLoginError('Google Login Failed')
    });

    // Register State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'CLIENT'
    });

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            // Reset states on open if needed
            setLoginError('');
        }
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            if (res.ok) {
                const data = await res.json();
                console.log('Login success:', data);
                alert('Login successful');
                onClose();
            } else {
                setLoginError('Invalid credentials');
            }
        } catch {
            setLoginError('An error occurred');
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Call registration API logic here
        console.log('Registering:', formData);
        alert('Registration simulated: ' + formData.email);
        onClose();
    };

    const googleLabel = t('login_google') || 'Continue with Google';

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>
                    <X size={20} />
                </button>

                <h2 className={styles.title}>
                    {view === 'login' ? (t('login_title') || 'Log in') : 'Create Account'}
                </h2>

                {view === 'login' ? (
                    <>
                        <form onSubmit={handleLoginSubmit} className={styles.form}>
                            {loginError && <div className={styles.error}>{loginError}</div>}
                            <div className={styles.field}>
                                <label>{t('email_label') || 'Email'}</label>
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>{t('password_label') || 'Password'}</label>
                                <input
                                    type="password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                {t('login_btn') || 'Log in'}
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>{t('or_continue') || 'or'}</span>
                        </div>

                        <SocialButtons onGoogle={() => loginWithGoogle()} googleLabel={googleLabel} />

                        <div className={styles.footer}>
                            <span>{t('no_account') || "Don't have an account?"}</span>
                            <button
                                onClick={() => setView('register')}
                                className={styles.switchLink}
                            >
                                {t('signup_link') || 'Sign up'}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <form onSubmit={handleRegisterSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className={styles.field}>
                                <label>I am a:</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="CLIENT">Client (Renter/Buyer)</option>
                                    <option value="PROVIDER">Provider (Owner)</option>
                                    <option value="DRIVER">Professional Driver</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                Sign Up
                            </button>
                        </form>

                        <div className={styles.divider}>
                            <span>{t('or_continue') || 'or'}</span>
                        </div>

                        <SocialButtons onGoogle={() => loginWithGoogle()} googleLabel={googleLabel} />

                        <div className={styles.footer}>
                            <span>Already have an account?</span>
                            <button
                                onClick={() => setView('login')}
                                className={styles.switchLink}
                            >
                                Log in
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
