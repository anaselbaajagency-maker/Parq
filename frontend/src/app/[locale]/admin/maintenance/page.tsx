'use client';

import { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '@/lib/api';
import styles from './maintenance.module.css';
import { Save, Check, X, ShieldAlert, Activity, Power, Clock, Loader2, AlertTriangle } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
import { useAuthStore } from '@/lib/auth-store';

export default function MaintenancePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Maintenance State
    // Maintenance State
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { user: currentUser } = useAuthStore();
    const { showAlert } = useAlert();

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            setError(null);
            try {
                const settingsData = await fetchSettings();
                if (settingsData) {
                    // Handle boolean or string 'true'/'false' from backend
                    const isActive = settingsData.maintenance_mode === true || settingsData.maintenance_mode === 'true' || settingsData.maintenance_mode === 1 || settingsData.maintenance_mode === '1';
                    setMaintenanceMode(isActive);
                    setMaintenanceMessage(settingsData.maintenance_message || '');
                }
            } catch (err: any) {
                const errorMessage = err?.message || (typeof err === 'string' ? err : '');
                if (errorMessage.includes('ACCESS_DENIED')) {
                    setError('ACCESS_DENIED');
                } else {
                    console.error('Failed to load maintenance settings:', err);
                    setError('FETCH_ERROR');
                    showAlert('error', 'Impossible de charger les paramètres de maintenance.', 'Erreur');
                }
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const handleSave = async () => {
        setSaving(true);

        try {
            const settingsToUpdate: any = {
                maintenance_mode: maintenanceMode ? "1" : "0", // Send as string/int if backend expects it
                maintenance_message: maintenanceMessage,
            };

            await updateSettings(settingsToUpdate);
            showAlert('success', 'Paramètres de maintenance mis à jour avec succès.', 'Succès');
        } catch (error: any) {
            if (error.message !== 'ACCESS_DENIED') {
                console.error('Failed to save settings:', error);
                showAlert('error', 'Échec de la mise à jour des paramètres.', 'Erreur');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loadingState}><Loader2 className={styles.spinner} size={40} /></div>;

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
                    <p className="text-slate-600 mb-6">Impossible de charger les paramètres de maintenance.</p>
                    <button onClick={() => window.location.reload()} className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors">Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Mode Maintenance</h1>
                <p className={styles.subtitle}>Gérez la disponibilité globale de la plateforme pour les utilisateurs.</p>
            </header>

            <div className={styles.statusGrid}>
                {/* Status Card */}
                <div className={`${styles.statusCard} ${maintenanceMode ? styles.active : styles.inactive}`}>
                    <div className={`${styles.iconWrapper} ${maintenanceMode ? styles.active : styles.inactive}`}>
                        <div className="relative">
                            <Activity size={24} />
                            {maintenanceMode && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
                            )}
                        </div>
                    </div>
                    <div className={styles.cardContent}>
                        <h3>État du Système</h3>
                        <p>Le site est actuellement <strong>{maintenanceMode ? 'VERROUILLÉ (Maintenance)' : 'EN LIGNE (Accessible)'}</strong>.</p>
                    </div>
                </div>

                {/* Admin Access Card */}
                <div className={`${styles.statusCard} ${styles.info}`}>
                    <div className={`${styles.iconWrapper} ${styles.info}`}>
                        <ShieldAlert size={24} />
                    </div>
                    <div className={styles.cardContent}>
                        <h3>Accès Administrateur</h3>
                        <p>Les administrateurs conservent un accès complet au Dashboard et au site, même en mode maintenance.</p>
                    </div>
                </div>
            </div>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div className="flex items-center gap-2">
                        <Power size={20} className="text-gray-400" />
                        <h2 className={styles.sectionTitle}>Activation</h2>
                    </div>
                    <p className={styles.sectionDesc}>Contrôle principal</p>
                </div>

                <div className={styles.formContent}>
                    <div className={styles.toggleWrapper}>
                        <div className={styles.toggleInfo}>
                            <span className={styles.toggleLabel}>Activer le Mode Maintenance</span>
                            <span className={styles.toggleDesc}>
                                Si activé, tous les utilisateurs non-admins seront redirigés vers la page de maintenance.
                            </span>
                        </div>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={maintenanceMode}
                                onChange={(e) => setMaintenanceMode(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Message public</label>
                        <textarea
                            value={maintenanceMessage}
                            onChange={(e) => setMaintenanceMessage(e.target.value)}
                            className={styles.textarea}
                            placeholder="Message à afficher aux visiteurs (ex: Nous effectuons une mise à jour critique...)"
                        />
                        <p className={styles.helperText}>
                            Ce message sera affiché bien en évidence sur l&apos;écran de maintenance. Vous pouvez utiliser du texte simple.
                        </p>
                    </div>
                </div>
            </section>

            <div className={styles.actions}>
                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <Loader2 className={styles.spinner} size={18} /> : <Save size={18} />}
                    <span className="ml-2">{saving ? 'Enregistrement...' : 'Enregistrer les changements'}</span>
                </button>
            </div>
        </div>
    );
}
