'use client';

import { useEffect, useState } from 'react';
import {
    fetchSettings,
    fetchCategories,
    Settings,
    Category
} from '@/lib/api';
import styles from './featured.module.css';
import { Save, Layout, Check, X, CheckSquare, Settings2, Database, ShieldAlert, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { useAlert } from '@/context/AlertContext';
import { useAuthStore } from '@/lib/auth-store';

export default function FeaturedCategoriesPage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [listingsCount, setListingsCount] = useState(6);
    const [hasChanges, setHasChanges] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuthStore();

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        setError(null);
        try {
            const [settingsData, categoriesData] = await Promise.all([
                fetchSettings(),
                fetchCategories(),
            ]);

            setSettings(settingsData);
            setCategories(categoriesData);

            // Initialize from categories show_on_homepage flag (Source of Truth)
            const activeIds = categoriesData
                .filter(c => Number(c.show_on_homepage) === 1)
                .map(c => String(c.id));

            setSelectedIds(activeIds);

            if (settingsData) {
                setListingsCount(Number(settingsData.homepage_listings_count) || 6);
            }
        } catch (err: any) {
            const errorMessage = err?.message || (typeof err === 'string' ? err : '');
            if (errorMessage.includes('ACCESS_DENIED')) {
                setError('ACCESS_DENIED');
            } else {
                console.error('Failed to load data:', err);
                setError('FETCH_ERROR');
            }
        } finally {
            setLoading(false);
        }
    }

    const toggleCategory = (categoryId: string) => {
        setSelectedIds(prev => {
            const newIds = prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId];
            return newIds;
        });
        setHasChanges(true);
    };

    const { showAlert } = useAlert();

    const handleSave = async () => {
        setSaving(true);
        try {
            // 1. Update Homepage Categories via Bulk API
            const { updateHomepageCategories, updateSettings } = await import('@/lib/api');
            await updateHomepageCategories(selectedIds);

            // 2. Update Listings Count Setting
            await updateSettings({
                homepage_listings_count: listingsCount.toString(),
            });

            setHasChanges(false);
            showAlert('success', 'Catégories mises à jour avec succès.', 'Enregistré');

            // Reload categories to reflect changes in UI state if needed
            // But we already have the state locally, so just good.
        } catch (error: any) {
            if (error.message !== 'ACCESS_DENIED') {
                console.error('Save failed', error);
                showAlert('error', 'Échec de la mise à jour.', 'Erreur');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
            </div>
        );
    }

    if (error === 'ACCESS_DENIED' || (!currentUser || currentUser.role !== 'ADMIN')) {
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
                    <p className="text-slate-600 mb-6">Impossible de charger les catégories en vedette.</p>
                    <button onClick={loadData} className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors">Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Catégories en Vedette</h1>
                    <p className={styles.subtitle}>
                        Sélectionnez les catégories les plus pertinentes pour vos utilisateurs.
                    </p>
                </div>
                <div className={`${styles.statusBadge} ${!settings ? styles.error : ''}`}>
                    <CheckSquare size={16} />
                    {settings ? 'Connecté à la Homepage' : 'Erreur de connexion'}
                </div>
            </header>

            <div className={styles.content}>
                <div className={styles.sectionTitle}>
                    <Layout size={24} className="text-[#ffb800]" />
                    <span>Sélectionner les catégories à afficher</span>
                </div>

                <div className={styles.grid}>
                    {categories.map(cat => {
                        const isSelected = selectedIds.includes(String(cat.id));
                        const isActive = Number(cat.is_active) === 1;

                        return (
                            <div
                                key={cat.id}
                                className={`${styles.card} ${isSelected ? styles.selected : ''} ${!isActive ? styles.disabled : ''}`}
                                onClick={() => isActive && toggleCategory(String(cat.id))}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.checkbox}>
                                        {isSelected && <Check size={16} strokeWidth={3} />}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <h3 className={styles.cardTitle}>{cat.name_fr || cat.name}</h3>
                                </div>
                                <div className={styles.cardMeta}>
                                    <span className={`${styles.badge} ${styles.id}`}>#{cat.id}</span>
                                    <span className={`${styles.badge} ${cat.type === 'rent' ? styles.rent : styles.buy}`}>
                                        {cat.type === 'rent' ? 'Location' : 'Vente'}
                                    </span>
                                    <span className={`${styles.badge} ${isActive ? styles.active : styles.inactive}`}>
                                        {isActive ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.settingsPanel}>
                    <div className={styles.sectionTitle}>
                        <Settings2 size={24} className="text-slate-600" />
                        <span>Configuration d&apos;affichage</span>
                    </div>
                    <div className={styles.settingField}>
                        <label className={styles.label}>Max annonces par catégorie :</label>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={listingsCount}
                            onChange={(e) => {
                                setListingsCount(parseInt(e.target.value) || 6);
                                setHasChanges(true);
                            }}
                            className={styles.input}
                        />
                        <span className="text-sm text-slate-500">éléments par ligne</span>
                    </div>
                </div>
            </div>

            <div className={`${styles.stickyFooter} ${!hasChanges && !saving ? styles.hidden : ''}`}>
                <div className={styles.summary}>
                    {selectedIds.length} catégories sélectionnées • {listingsCount} par ligne
                </div>
                <button
                    className={styles.saveButton}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? (
                        <div className="animate-spin h-5 w-5 border-2 border-slate-900 border-t-transparent rounded-full" />
                    ) : (
                        <Save size={20} />
                    )}
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>
            </div>
        </div>
    );
}
