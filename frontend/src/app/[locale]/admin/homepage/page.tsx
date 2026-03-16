'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '../../../../navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useLocale } from 'next-intl';
import {
    Save, Loader2, Languages, Type, LayoutTemplate, Database, Check, AlertTriangle, ShieldAlert
} from 'lucide-react';
import {
    fetchSettings,
    updateSettings
} from '@/lib/api';
import { useAlert } from '@/context/AlertContext';
import styles from './hero.module.css';

export default function HeroHomepage() {
    const { user } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // State
    const [heroData, setHeroData] = useState({
        hero_title_fr: '', hero_title_ar: '',
        hero_highlight_fr: '', hero_highlight_ar: '',
        hero_subtitle_fr: '', hero_subtitle_ar: ''
    });

    const [originalData, setOriginalData] = useState<any>(null);
    const [savingHero, setSavingHero] = useState(false);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (!user || user.role !== 'ADMIN') {
            router.replace('/tableau-de-bord');
            return;
        }
        loadData();
    }, [isMounted, user, router]);

    const hasChanges = JSON.stringify(heroData) !== JSON.stringify(originalData);

    async function loadData() {
        setLoading(true);
        setError(null);
        try {
            const settings = await fetchSettings();
            if (settings) {
                const data = {
                    hero_title_fr: settings.hero_title_fr || '',
                    hero_title_ar: settings.hero_title_ar || '',
                    hero_highlight_fr: settings.hero_highlight_fr || '',
                    hero_highlight_ar: settings.hero_highlight_ar || '',
                    hero_subtitle_fr: settings.hero_subtitle_fr || '',
                    hero_subtitle_ar: settings.hero_subtitle_ar || ''
                };
                setHeroData(data);
                setOriginalData(data);
                setConnected(true);
            }
        } catch (error: any) {
            const errorMessage = error?.message || (typeof error === 'string' ? error : '');
            if (errorMessage.includes('ACCESS_DENIED')) {
                setError('ACCESS_DENIED');
            } else {
                console.error('Failed to load hero data:', error);
                setConnected(false);
                setError('FETCH_ERROR');
            }
        } finally {
            setLoading(false);
        }
    }

    const { showAlert } = useAlert();

    async function saveHeroSettings() {
        setSavingHero(true);
        try {
            const success = await updateSettings(heroData);
            if (success) {
                setOriginalData({ ...heroData });
                showAlert('success', 'Hero settings updated successfully.', 'Saved');
            } else {
                showAlert('error', 'Failed to update hero settings.', 'Error');
            }
        } catch (error: any) {
            if (error.message !== 'ACCESS_DENIED') {
                console.error('Save error:', error);
                showAlert('error', 'An unexpected error occurred.', 'Error');
            }
        } finally {
            setSavingHero(false);
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
                <Loader2 className="animate-spin text-[#ffb800] mb-4" size={40} />
                <p className="text-gray-500 font-medium">Chargement...</p>
            </div>
        );
    }

    if (error === 'ACCESS_DENIED' || (!user || user.role !== 'ADMIN')) {
        return (
            <div className={styles.container}>
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
                    <ShieldAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Accès Refusé</h2>
                    <p className="text-slate-600 mb-6 max-w-md">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        Veuillez vous connecter avec un compte administrateur.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
                    <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
                    <p className="text-slate-600 mb-6">Impossible de charger les paramètres de la page d'accueil.</p>
                    <button onClick={loadData} className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors">Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Hero Homepage</h1>
                    <p className={styles.subtitle}>
                        Customize the main headline and introduction text displayed at the top of your homepage.
                    </p>
                </div>
                <div className={`${styles.statusBadge} ${!connected ? styles.error : ''}`}>
                    <Database size={16} />
                    {connected ? 'Database Connected' : 'Connection Error'}
                </div>
            </header>

            <div className={styles.grid}>
                {/* French Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.langIcon}>FR</div>
                        <div>
                            <h3 className={styles.cardTitle}>Version Française</h3>
                            <p className="text-sm text-gray-500">Left-to-Right orientation</p>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Main Title</label>
                        <input
                            value={heroData.hero_title_fr}
                            onChange={e => setHeroData({ ...heroData, hero_title_fr: e.target.value })}
                            className={styles.input}
                            placeholder="La Marketplace Marocaine pour"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Highlighted Text (Blue)</label>
                        <input
                            value={heroData.hero_highlight_fr}
                            onChange={e => setHeroData({ ...heroData, hero_highlight_fr: e.target.value })}
                            className={styles.input}
                            placeholder="Engins & Transport"
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Subtitle / Description</label>
                        <textarea
                            value={heroData.hero_subtitle_fr}
                            onChange={e => setHeroData({ ...heroData, hero_subtitle_fr: e.target.value })}
                            className={styles.textarea}
                            placeholder="La plateforme de confiance pour louer et acheter..."
                        />
                    </div>
                </div>

                {/* Arabic Card */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <div className={styles.langIcon}>AR</div>
                        <div>
                            <h3 className={styles.cardTitle}>النسخة العربية</h3>
                            <p className="text-sm text-gray-500">Right-to-Left orientation</p>
                        </div>
                    </div>

                    <div className={`${styles.inputGroup} ${styles.rtl}`}>
                        <label className={styles.label}>العنوان الرئيسي</label>
                        <input
                            value={heroData.hero_title_ar}
                            onChange={e => setHeroData({ ...heroData, hero_title_ar: e.target.value })}
                            className={styles.input}
                            dir="rtl"
                            placeholder="المنصة المغربية لـ"
                        />
                    </div>

                    <div className={`${styles.inputGroup} ${styles.rtl}`}>
                        <label className={styles.label}>النص المميز (أزرق)</label>
                        <input
                            value={heroData.hero_highlight_ar}
                            onChange={e => setHeroData({ ...heroData, hero_highlight_ar: e.target.value })}
                            className={styles.input}
                            dir="rtl"
                            placeholder="المعدات الثقيلة والنقل"
                        />
                    </div>

                    <div className={`${styles.inputGroup} ${styles.rtl}`}>
                        <label className={styles.label}>العنوان الفرعي / الوصف</label>
                        <textarea
                            value={heroData.hero_subtitle_ar}
                            onChange={e => setHeroData({ ...heroData, hero_subtitle_ar: e.target.value })}
                            className={styles.textarea}
                            dir="rtl"
                            placeholder="المنصة الموثوقة لكراء المعدات..."
                        />
                    </div>
                </div>
            </div>

            <div className={`${styles.stickyFooter} ${!hasChanges && !savingHero ? styles.hidden : ''}`}>
                <div className={styles.footerContent}>
                    {savingHero ? <Loader2 size={20} className="animate-spin" /> : <AlertTriangle size={20} className="text-yellow-400" />}
                    {savingHero ? 'Saving changes...' : 'You have unsaved changes'}
                </div>
                <button
                    className={styles.saveButton}
                    onClick={saveHeroSettings}
                    disabled={savingHero}
                >
                    {savingHero ? 'Processing...' : 'Save Updates'}
                </button>
            </div>
        </div>
    );
}
