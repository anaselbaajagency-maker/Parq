'use client';

import { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '@/lib/api';
import styles from './maintenance.module.css';
import { Save, Check, X, ShieldAlert, Activity, Power, Clock, Loader2 } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';

export default function MaintenancePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Maintenance State
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');
    const { showAlert } = useAlert();

    useEffect(() => {
        async function loadData() {
            try {
                const settingsData = await fetchSettings();
                if (settingsData) {
                    // Handle boolean or string 'true'/'false' from backend
                    const isActive = settingsData.maintenance_mode === true || settingsData.maintenance_mode === 'true' || settingsData.maintenance_mode === 1 || settingsData.maintenance_mode === '1';
                    setMaintenanceMode(isActive);
                    setMaintenanceMessage(settingsData.maintenance_message || '');
                }
            } catch (error) {
                console.error('Failed to load maintenance settings:', error);
                showAlert('error', 'Impossible de charger les paramètres de maintenance.', 'Erreur');
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
        } catch (error) {
            console.error('Failed to save settings:', error);
            showAlert('error', 'Échec de la mise à jour des paramètres.', 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className={styles.loadingState}><Loader2 className={styles.spinner} size={40} /></div>;

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
                            Ce message sera affiché bien en évidence sur l'écran de maintenance. Vous pouvez utiliser du texte simple.
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
