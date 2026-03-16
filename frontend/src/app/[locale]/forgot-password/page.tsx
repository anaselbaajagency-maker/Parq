'use client';

import { useState } from 'react';
import { Link } from '../../../navigation';
import { apiForgotPassword } from '@/lib/api';
import { ArrowLeft, ArrowRight, Mail, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { getErrorMessage } from '@/lib/error-message';
import styles from '../login/auth.module.css';

export default function ForgotPasswordPage() {
    const t = useTranslations('Auth');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await apiForgotPassword(email);
            setSuccess(true);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'An error occurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.page} suppressHydrationWarning>
            {/* ——— Left: Brand Panel ——— */}
            <div className={styles.brandPanel}>
                <div className={styles.orb + ' ' + styles.orb1} />
                <div className={styles.orb + ' ' + styles.orb2} />
                <div className={styles.brandContent}>
                    <div className={styles.brandLogo}>
                        <div className={styles.brandLogoIcon}>P</div>
                        <span className={styles.brandLogoText}>PARQ</span>
                    </div>
                    <h2 className={styles.brandTagline}>
                        {t('forgot_tagline_1')}<br />
                        <span>{t('forgot_tagline_2')}</span>
                    </h2>
                    <p className={styles.brandDescription}>
                        {t('brand_description')}
                    </p>
                </div>
            </div>

            {/* ——— Right: Form Panel ——— */}
            <div className={styles.formPanel}>
                <div className={styles.card}>
                    <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                        {t('login_link') || "Retour à la connexion"}
                    </Link>

                    <header className={styles.header} style={{ marginBottom: '1.5rem' }}>
                        <div className={styles.logoArea}>
                            <div className={styles.brandLogo} style={{ justifyContent: 'center' }}>
                                <div className={styles.brandLogoIcon}>P</div>
                                <span className={styles.brandLogoText} style={{ color: '#0f172a' }}>PARQ</span>
                            </div>
                        </div>
                        <h1 className={styles.title}>Mot de passe oublié ?</h1>
                        <p className={styles.subtitle}>
                            Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                    </header>

                    {success ? (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center shadow-sm">
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-green-600">
                                <Mail size={28} />
                            </div>
                            <h3 className="font-bold text-slate-800 text-lg mb-2">Email envoyé</h3>
                            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                                Si un compte existe pour <b>{email}</b>, vous recevrez les instructions sous peu.
                            </p>
                            <button onClick={() => setSuccess(false)} className="text-sm font-bold text-green-700 hover:text-green-800 transition-colors">
                                Réessayer avec un autre email
                            </button>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {error && <div className={styles.error}>{error}</div>}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>{t('email_label')}</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="name@company.com"
                                    id="forgot-email"
                                />
                            </div>

                            <button type="submit" className={styles.button} disabled={loading} style={{ marginTop: '0.5rem' }}>
                                {loading && <Loader2 className="animate-spin" size={18} />}
                                {loading ? "Envoi en cours..." : "Envoyer le lien"}
                                {!loading && <ArrowRight size={16} className="rtl:rotate-180" />}
                            </button>
                        </form>
                    )}

                    <div className={styles.footer}>
                        Vous n&apos;avez pas de compte ?
                        <Link href="/register" className={styles.link}>{t('signup_link')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
