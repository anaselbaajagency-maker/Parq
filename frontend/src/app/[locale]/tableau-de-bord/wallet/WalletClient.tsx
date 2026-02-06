'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { api } from '@/lib/api';
import { WalletBalance, Transaction, TopUpRequest } from '@/types/wallet';
import TransactionList from '@/components/wallet/TransactionList';
import PaymentMethodSelector, { PaymentMethodId } from '@/components/wallet/PaymentMethodSelector';
import UploadReceipt from '@/components/wallet/UploadReceipt';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter, Link } from '@/navigation';
import {
    History,
    Ticket,
    CreditCard,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    Wallet,
    ArrowLeft,
    ShieldCheck,
    HelpCircle,
    ExternalLink
} from 'lucide-react';
import styles from './wallet.module.css';

export default function WalletClient() {
    const t = useTranslations('Wallet');
    const locale = useLocale();
    const router = useRouter();
    const { user } = useAuthStore();

    const [wallet, setWallet] = useState<WalletBalance | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    // Top-up flow status
    const [step, setStep] = useState<'main' | 'recharge' | 'coupon'>('main');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId | null>(null);
    const [amount, setAmount] = useState<number>(100);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [topUpResult, setTopUpResult] = useState<TopUpRequest | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    async function loadData() {
        setLoading(true);
        try {
            const [walletRes, txRes] = await Promise.all([
                api.wallet.getBalance(),
                api.wallet.getTransactions()
            ]);
            // @ts-ignore
            setWallet(walletRes.data || walletRes);
            // @ts-ignore
            const txList = txRes.data || txRes;
            setTransactions(Array.isArray(txList) ? txList.slice(0, 5) : []); // Just the last 5 for the main view
        } catch (error) {
            console.error('Failed to load wallet data', error);
        } finally {
            setLoading(false);
        }
    }

    const handleTopUpSubmit = async () => {
        if (!selectedMethod) return;
        setIsSubmitting(true);
        setMessage(null);
        try {
            const result = await api.wallet.createTopUp({ method: selectedMethod, amount });
            // @ts-ignore
            setTopUpResult(result.data || result);
            if (selectedMethod === 'cmi' || selectedMethod === 'payzone') {
                setMessage({ type: 'success', text: t('status.pending') });
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || t('error_topup') });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUploadProof = async (file: File) => {
        if (!topUpResult) return;
        setIsSubmitting(true);
        try {
            await api.wallet.uploadProof(topUpResult.id, file);
            setMessage({ type: 'success', text: t('receipt.sent_for_validation') });
        } catch (error) {
            setMessage({ type: 'error', text: t('error_topup') });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCouponRedeem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        try {
            const result = await api.wallet.redeemCoupon(couponCode);
            setMessage({ type: 'success', text: result.message });
            setCouponCode('');
            loadData(); // Refresh balance
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Invoice coupon' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && !wallet) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Chargement de votre portefeuille...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('title')}</h1>
                <p className={styles.subtitle}>{t('manage_wallet_desc')}</p>
            </header>

            <div className={styles.grid}>
                <div className="space-y-6">
                    {/* HUB VIEW */}
                    {step === 'main' && wallet && (
                        <>
                            <div className={styles.balanceCard}>
                                <div className={styles.balanceContent}>
                                    <h3 className={styles.balanceLabel}>{t('summary.current_balance')}</h3>
                                    <div className="flex items-baseline">
                                        <span className={styles.balanceAmount}>{(wallet.balance ?? 0).toLocaleString(locale)}</span>
                                        <span className={styles.balanceCurrency}>DH</span>
                                    </div>

                                    <div className={styles.balanceActions}>
                                        <button onClick={() => setStep('recharge')} className={styles.rechargeBtn}>
                                            <Wallet size={18} />
                                            {t('actions.recharge_now')}
                                        </button>
                                        <button onClick={() => setStep('coupon')} className={styles.couponBtn}>
                                            <Ticket size={18} />
                                            {t('actions.coupon')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.cardTitle}>
                                        <History size={20} className="text-gray-500" />
                                        {t('transactions.title')}
                                    </h3>
                                    <Link href="/tableau-de-bord/wallet/history" className={styles.historyLink}>
                                        {t('actions.history')} <ChevronRight size={16} />
                                    </Link>
                                </div>
                                <TransactionList transactions={transactions} />
                            </div>
                        </>
                    )}

                    {/* RECHARGE VIEW */}
                    {step === 'recharge' && (
                        <div className={`${styles.card} animate-fadeIn`}>
                            <button
                                onClick={() => { setStep('main'); setTopUpResult(null); setMessage(null); }}
                                className={styles.backBtn}
                            >
                                <ArrowLeft size={16} /> {t('cancel')}
                            </button>

                            {!topUpResult ? (
                                <>
                                    <h3 className={styles.cardTitle} style={{ fontSize: '24px', marginBottom: '24px' }}>
                                        {t('top_up')}
                                    </h3>

                                    <div className="space-y-8">
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>{t('select_amount')}</label>
                                            <div className={styles.selectionGrid}>
                                                {[100, 200, 500, 1000, 2000, 5000].map(v => (
                                                    <button
                                                        key={v}
                                                        type="button"
                                                        onClick={() => setAmount(v)}
                                                        className={`${styles.selectionCard} ${amount === v ? styles.selected : ''}`}
                                                    >
                                                        <span className={styles.amountValue}>{v}</span>
                                                        <span className={styles.amountLabel}>DH</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(Number(e.target.value))}
                                                    className={styles.input}
                                                    min="100"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">DH</span>
                                            </div>
                                        </div>

                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>{t('payment_method')}</label>
                                            <PaymentMethodSelector selectedId={selectedMethod} onSelect={setSelectedMethod} />
                                        </div>

                                        {message?.type === 'error' && (
                                            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm font-bold border border-red-100">
                                                <AlertCircle size={18} /> {message.text}
                                            </div>
                                        )}

                                        <button
                                            disabled={!selectedMethod || isSubmitting}
                                            onClick={handleTopUpSubmit}
                                            className={styles.submitBtn}
                                        >
                                            {isSubmitting ? 'Traitement...' : t('submit')}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.successState}>
                                    <div className={styles.successIcon}>
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black mb-2">{t('status.pending')}</h3>
                                    <p className="text-gray-500 font-medium mb-8">
                                        Référence: <span className="text-black font-bold font-mono bg-gray-100 px-2 py-1 rounded">{topUpResult.reference}</span>
                                    </p>

                                    {selectedMethod === 'bank_transfer' && (
                                        <div className={styles.bankDetails}>
                                            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-blue-600">
                                                <ShieldCheck size={18} />
                                                {t('instructions.bank_transfer')}
                                            </div>
                                            <div className={styles.bankRow}>
                                                <span className={styles.bankLabel}>RIB PARQ MARKET</span>
                                                <span className={styles.bankValue}>007 810 0001234567890123 44</span>
                                            </div>
                                            <div className={styles.bankRow}>
                                                <span className={styles.bankLabel}>Banque</span>
                                                <span className={styles.bankValue}>Attijariwafa Bank</span>
                                            </div>
                                            <div className="pt-6">
                                                <UploadReceipt onUpload={handleUploadProof} isUploading={isSubmitting} />
                                            </div>
                                        </div>
                                    )}

                                    {selectedMethod === 'cash_plus' && (
                                        <div className="bg-amber-50 p-8 rounded-2xl text-center space-y-4 border border-amber-100 mb-8">
                                            <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">Code de paiement Cash Plus</p>
                                            <div className="text-5xl font-black tracking-widest text-amber-900 font-mono my-4">
                                                {topUpResult.payment_code || '883-221-09'}
                                            </div>
                                            <p className="text-xs text-amber-700 max-w-[280px] mx-auto leading-relaxed">
                                                Veuillez présenter ce code dans n'importe quelle agence Cash Plus pour finaliser la recharge.
                                            </p>
                                        </div>
                                    )}

                                    {message?.type === 'success' && (
                                        <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2 text-sm font-bold border border-green-100 mb-6">
                                            <CheckCircle2 size={18} /> {message.text}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => { setStep('main'); setTopUpResult(null); setMessage(null); }}
                                        className={styles.submitBtn}
                                        style={{ background: '#000', color: '#fff' }}
                                    >
                                        Terminer
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* COUPON VIEW */}
                    {step === 'coupon' && (
                        <div className={styles.card}>
                            <button
                                onClick={() => { setStep('main'); setMessage(null); }}
                                className={styles.backBtn}
                            >
                                <ArrowLeft size={16} /> {t('cancel')}
                            </button>

                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Ticket size={32} />
                                </div>
                                <h3 className={styles.cardTitle} style={{ justifyContent: 'center', marginBottom: '12px' }}>
                                    {t('actions.coupon')}
                                </h3>
                                <p className={styles.subtitle} style={{ marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
                                    Saisissez votre code pour recevoir des crédits DH bonus instantanément sur votre compte.
                                </p>

                                <form onSubmit={handleCouponRedeem} className="max-w-md mx-auto">
                                    <input
                                        type="text"
                                        placeholder="CODE PROMO (Ex: FREE100)"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className={styles.couponInput}
                                    />

                                    <div className={styles.couponActions}>
                                        <button
                                            type="button"
                                            onClick={() => { setStep('main'); setMessage(null); }}
                                            className={styles.couponCancelBtn}
                                        >
                                            {t('cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!couponCode || isSubmitting}
                                            className={styles.couponSubmitBtn}
                                        >
                                            {isSubmitting ? '...' : t('submit')}
                                        </button>
                                    </div>
                                </form>

                                {message && (
                                    <div className={`mt-6 p-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                        {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} {message.text}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <div className={styles.helpCard}>
                        <h4 className={styles.helpTitle}>
                            <HelpCircle size={18} className="text-amber-400" />
                            Aide & Support
                        </h4>
                        <p className={styles.helpText}>
                            Besoin d'aide pour recharger votre compte ou comprendre le fonctionnement des crédits ?
                        </p>
                        <div className="space-y-3">
                            <button className={styles.helpLink}>
                                Comment recharger mon compte ? <ExternalLink size={12} />
                            </button>
                            <button className={styles.helpLink}>
                                Comprendre la tarification <ExternalLink size={12} />
                            </button>
                            <button className={styles.helpLink}>
                                Contacter le support <ExternalLink size={12} />
                            </button>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h4 className="font-bold mb-4 opacity-100 flex items-center gap-2 text-sm">
                            <ShieldCheck size={18} className="text-green-500" />
                            Paiement sécurisé
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">
                            Toutes les transactions sont sécurisées et cryptées via le protocole SSL.
                        </p>
                        <div className="flex gap-2 mt-4 grayscale opacity-70">
                            <div className="h-6 w-10 bg-gray-200 rounded"></div>
                            <div className="h-6 w-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
