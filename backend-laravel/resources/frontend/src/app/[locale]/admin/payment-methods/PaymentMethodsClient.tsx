'use client';

import { useState, useEffect } from 'react';
import styles from './paymentMethods.module.css';
import {
    AdminPaymentMethod, fetchAdminPaymentMethods,
    updatePaymentMethod, togglePaymentMethod
} from '@/lib/admin-wallet-api';
import { Loader2, Edit, Save, XCircle, CreditCard, Landmark, Banknote, Wallet, MoveRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function PaymentMethodsClient() {
    const [methods, setMethods] = useState<AdminPaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingDetails, setEditingDetails] = useState<AdminPaymentMethod | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        try {
            const data = await fetchAdminPaymentMethods();
            setMethods(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id: number) => {
        // Optimistic update
        setMethods(prev => prev.map(m => m.id === id ? { ...m, is_active: !m.is_active } : m));
        try {
            await togglePaymentMethod(id);
        } catch (e) {
            console.error(e);
            // Revert on failure
            loadMethods();
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingDetails) return;
        setSaving(true);
        try {
            const updated = await updatePaymentMethod(editingDetails.id, {
                name: editingDetails.name,
                name_ar: editingDetails.name_ar,
                description: editingDetails.description,
                description_ar: editingDetails.description_ar,
                sort_order: editingDetails.sort_order,
                icon: editingDetails.icon
            });
            setMethods(prev => prev.map(m => m.id === updated.id ? updated : m));
            setEditingDetails(null);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la mise à jour");
        } finally {
            setSaving(false);
        }
    };

    // Helper to dynamically render icon
    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName] || CreditCard; // fallback
        return <IconComponent size={24} />;
    };

    if (loading) return <div className={styles.loading}><Loader2 className={styles.spinner} /></div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Méthodes de Paiement</h1>
                <p className={styles.subtitle}>Gérez les modes de paiement disponibles pour les recharges.</p>
            </header>

            <div className={styles.grid}>
                {methods.map(method => (
                    <div key={method.id} className={`${styles.methodCard} ${!method.is_active ? styles.inactive : ''}`}>
                        <div className={styles.iconWrapper}>
                            {getIcon(method.icon)}
                        </div>

                        <div className={styles.info}>
                            <div className="flex items-center">
                                <span className={styles.name}>{method.name}</span>
                                <span className={styles.codeBadge}>{method.code}</span>
                            </div>
                            <p className={styles.description}>{method.description}</p>
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={styles.editBtn}
                                onClick={() => setEditingDetails(method)}
                            >
                                <Edit size={16} /> Modifier
                            </button>
                        </div>

                        <div className={styles.switchWrapper}>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={method.is_active}
                                    onChange={() => handleToggle(method.id)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingDetails && (
                <div className={styles.modalOverlay} onClick={() => setEditingDetails(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Modifier la méthode</h2>
                            <button className={styles.closeBtn} onClick={() => setEditingDetails(null)}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className={styles.form}>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nom (FR)</label>
                                    <input
                                        className={styles.input}
                                        value={editingDetails.name}
                                        onChange={e => setEditingDetails({ ...editingDetails, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nom (AR)</label>
                                    <input
                                        className={styles.input}
                                        value={editingDetails.name_ar || ''}
                                        onChange={e => setEditingDetails({ ...editingDetails, name_ar: e.target.value })}
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description (FR)</label>
                                <textarea
                                    className={styles.textarea}
                                    value={editingDetails.description || ''}
                                    onChange={e => setEditingDetails({ ...editingDetails, description: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description (AR)</label>
                                <textarea
                                    className={`${styles.textarea} text-right`}
                                    value={editingDetails.description_ar || ''}
                                    onChange={e => setEditingDetails({ ...editingDetails, description_ar: e.target.value })}
                                    dir="rtl"
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Ordre</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        value={editingDetails.sort_order}
                                        onChange={e => setEditingDetails({ ...editingDetails, sort_order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Icône (Lucide React)</label>
                                    <input
                                        className={styles.input}
                                        value={editingDetails.icon}
                                        onChange={e => setEditingDetails({ ...editingDetails, icon: e.target.value })}
                                        placeholder="ex: CreditCard"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={saving}
                            >
                                {saving ? <Loader2 className={styles.spinner} /> : <Save size={18} />}
                                Enregistrer les modifications
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
