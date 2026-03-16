'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from '@/navigation';
import { api } from '@/lib/api';
import { Bell, Loader2, CheckCircle2, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { Link } from '@/navigation';
import styles from './verify-email.module.css';

export default function VerifyEmailPage() {
    const t = useTranslations('Auth');
    const { user, updateUser } = useAuthStore();
    const router = useRouter();

    const [verifyingStatus, setVerifyingStatus] = useState<'idle' | 'sending' | 'verifying' | 'success'>('idle');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');

    // Redirect if already verified
    useEffect(() => {
        if (user?.email_verified_at) {
            router.replace('/tableau-de-bord');
        }
    }, [user, router]);

    const handleSendCode = async () => {
        setVerifyingStatus('sending');
        setError('');
        try {
            await api.auth.sendVerificationCode();
            setVerifyingStatus('verifying');
        } catch (err: any) {
            setVerifyingStatus('idle');
            setError(err.message || 'Erreur lors de l\'envoi du code.');
        }
    };

    const handleVerifyCode = async () => {
        setVerifyingStatus('verifying');
        setError('');
        try {
            const response = await api.auth.verifyEmail(verificationCode);
            setVerifyingStatus('success');
            if (response.user) {
                updateUser(response.user);
            }
            // Auto redirect after success
            setTimeout(() => {
                router.push('/tableau-de-bord');
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Code de vérification invalide.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.blob1} />
            <div className={styles.blob2} />

            <div className={styles.card}>
                <div className={styles.header}>
                    <Link href="/tableau-de-bord" className={styles.backBtn}>
                        <ArrowLeft size={18} />
                        <span>Retour</span>
                    </Link>
                    <div className={styles.logo}>
                        <div className={styles.logoDot} />
                        <span>PARQ.</span>
                    </div>
                </div>

                <div className={styles.content}>
                    {verifyingStatus === 'success' ? (
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>
                                <CheckCircle2 size={64} color="#10b981" />
                            </div>
                            <h1 className={styles.title}>Email Vérifié !</h1>
                            <p className={styles.desc}>
                                Votre adresse email a été confirmée avec succès. Vous allez être redirigé vers votre tableau de bord.
                            </p>
                            <Loader2 size={24} className={styles.redirectSpinner} />
                        </div>
                    ) : (
                        <>
                            <div className={styles.iconWrapper}>
                                <Mail size={32} className={styles.mainIcon} />
                            </div>

                            <h1 className={styles.title}>Vérification de l'email</h1>
                            <p className={styles.desc}>
                                Pour sécuriser votre compte <strong>{user?.email}</strong>, nous devons valider votre adresse email.
                            </p>

                            {verifyingStatus === 'idle' && (
                                <div className={styles.actionSection}>
                                    <button
                                        onClick={handleSendCode}
                                        className={styles.primaryBtn}
                                    >
                                        Envoyer le code de vérification
                                    </button>
                                    <div className={styles.infoBox}>
                                        <ShieldCheck size={16} />
                                        <span>Le code expirera dans 10 minutes.</span>
                                    </div>
                                </div>
                            )}

                            {(verifyingStatus === 'verifying' || verifyingStatus === 'sending') && (
                                <div className={styles.verifySection}>
                                    <p className={styles.inputLabel}>Saisissez le code à 6 chiffres</p>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={verificationCode}
                                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000000"
                                        className={styles.otpInput}
                                    />

                                    {error && <p className={styles.errorMsg}>{error}</p>}

                                    <button
                                        onClick={handleVerifyCode}
                                        disabled={verificationCode.length !== 6 || verifyingStatus === 'sending'}
                                        className={styles.primaryBtn}
                                    >
                                        Vérifier mon compte
                                    </button>

                                    <button
                                        onClick={handleSendCode}
                                        className={styles.resendBtn}
                                    >
                                        Je n'ai pas reçu de code ? <span>Renvoyer</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
