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
        <div className={styles.page}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <div className={styles.logoArea}>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-2">
                            <span className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/30">P</span>
                            PARQ
                        </h1>
                    </div>
                    <Link href="/login" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
                        {t('login_link') || "Retour à la connexion"}
                    </Link>

                    <h1 className={styles.title}>Mot de passe oublié ?</h1>
                    <p className={styles.subtitle}>
                        Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                    </p>
                </header>

                {success ? (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                            <Mail size={24} />
                        </div>
                        <h3 className="font-bold text-slate-800 mb-2">Email envoyé</h3>
                        <p className="text-slate-600 text-sm mb-6">
                            Si un compte existe pour <b>{email}</b>, vous recevrez les instructions sous peu.
                        </p>
                        <button onClick={() => setSuccess(false)} className="text-sm font-semibold text-green-700 hover:underline">
                            Réessayer avec un autre email
                        </button>
                    </div>
                ) : (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        {error && <div className={styles.error}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('email_label')}</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className={styles.input}
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <button type="submit" className={styles.button} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                            {loading ? "Envoyer le lien" : "Envoyer le lien"}
                            {!loading && <ArrowRight size={18} className="rtl:rotate-180" />}
                        </button>
                    </form>
                )}

                <div className={styles.footer}>
                    Vous n&apos;avez pas de compte ?
                    <Link href="/register" className={styles.link}>{t('signup_link')}</Link>
                </div>
            </div>
        </div>
    );
}
