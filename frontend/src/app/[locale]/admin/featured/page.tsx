'use client';

import { useEffect, useState } from 'react';
import {
    fetchSettings,
    fetchCategories,
    Settings,
    Category
} from '@/lib/api';
import styles from './featured.module.css';
import { Save, Layout, Check, X, CheckSquare, Settings2, Database } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import { useAlert } from '@/context/AlertContext';

export default function FeaturedCategoriesPage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [listingsCount, setListingsCount] = useState(6);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
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
        } catch (error) {
            console.error('Failed to load data:', error);
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
        } catch (error) {
            console.error('Save failed', error);
            showAlert('error', 'Échec de la mise à jour.', 'Erreur');
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
                        <span>Configuration d'affichage</span>
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
