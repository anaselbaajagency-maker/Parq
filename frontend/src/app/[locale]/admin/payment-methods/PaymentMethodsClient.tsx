'use client';

import { useState, useEffect } from 'react';
import styles from './paymentMethods.module.css';
import {
    AdminPaymentMethod, fetchAdminPaymentMethods,
    updatePaymentMethod, togglePaymentMethod,
    createPaymentMethod, deletePaymentMethod,
    bulkDeletePaymentMethods
} from '@/lib/admin-wallet-api';
import { 
    Loader2, Edit, Save, XCircle, CreditCard, Landmark, 
    Banknote, Wallet, MoveRight, Plus, Trash2, AlertTriangle, 
    ShieldAlert, CheckCircle2, Power, Edit2 
} from 'lucide-react';
import * as Icons from 'lucide-react';

export default function PaymentMethodsClient() {
    const [methods, setMethods] = useState<AdminPaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingDetails, setEditingDetails] = useState<AdminPaymentMethod | null>(null);
    const [saving, setSaving] = useState(false);

    // Create/Delete State
    const [isAdding, setIsAdding] = useState(false);
    const [newMethod, setNewMethod] = useState<Partial<AdminPaymentMethod>>({
        code: '', name: '', name_ar: '', description: '', description_ar: '', sort_order: 0, icon: 'CreditCard'
    });
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkActionLoading, setBulkActionLoading] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<AdminPaymentMethod | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);


    useEffect(() => {
        loadMethods();
    }, []);

    const loadMethods = async () => {
        try {
            setError(null);
            const data = await fetchAdminPaymentMethods();
            setMethods(data);
        } catch (e: any) {
            if (e.message !== 'ACCESS_DENIED') {
                console.error(e);
            }
            if (e.message === 'ACCESS_DENIED') {
                setError('ACCESS_DENIED');
            } else {
                setError('FETCH_ERROR');
            }
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
                icon: editingDetails.icon,
                config: editingDetails.config
            });
            setMethods(prev => prev.map(m => m.id === updated.id ? updated : m));
            setEditingDetails(null);
            setIsEditModalOpen(false);
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la mise à jour");
        } finally {
            setSaving(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const created = await createPaymentMethod(newMethod);
            setMethods(prev => [...prev, created]);
            setIsAdding(false);
            setIsAddModalOpen(false);
            setNewMethod({ code: '', name: '', name_ar: '', description: '', description_ar: '', sort_order: 0, icon: 'CreditCard' });
        } catch (e) {
            console.error(e);
            alert("Erreur lors de la création");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (deletingId === null && confirmDelete === null) return;
        const idToDelete = deletingId || confirmDelete;
        if (idToDelete === null) return;

        setSaving(true);
        try {
            await deletePaymentMethod(idToDelete);
            setMethods(prev => prev.filter(m => m.id !== idToDelete));
            setDeletingId(null);
        } catch (error) {
            console.error('Delete error:', error);
            alert('Erreur lors de la suppression');
        } finally {
            setSaving(false);
            setConfirmDelete(null);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === methods.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(methods.map(m => m.id)));
        }
    };

    const toggleSelect = (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} méthodes de paiement ?`)) return;

        setBulkActionLoading(true);
        try {
            await bulkDeletePaymentMethods(Array.from(selectedIds));
            setMethods(prev => prev.filter(m => !selectedIds.has(m.id)));
            setSelectedIds(new Set());
        } catch (error) {
            console.error('Bulk delete error:', error);
            alert('Erreur lors de la suppression groupée');
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Helper to dynamically render icon
    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName] || CreditCard; // fallback
        return <IconComponent size={24} />;
    };

    if (loading) return <div className={styles.loading}><Loader2 className={styles.spinner} /></div>;

    if (error === 'ACCESS_DENIED') {
        return (
            <div className={styles.container}>
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
                    <ShieldAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Accès Refusé</h2>
                    <p className="text-slate-600 mb-6 max-w-md">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        Veuillez vous connecter avec un compte administrateur.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className={styles.addBtn}
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
                <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
                    <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
                    <p className="text-slate-600 mb-6">Impossible de charger les méthodes de paiement.</p>
                    <button onClick={loadMethods} className={styles.addBtn}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Méthodes de Paiement</h1>
                    <p className={styles.subtitle}>Gérez les modes de paiement disponibles pour les recharges.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className={`${styles.selectAllBtn} ${selectedIds.size === methods.length && methods.length > 0 ? styles.selected : ''}`}
                        onClick={toggleSelectAll}
                        title={selectedIds.size === methods.length ? "Désélectionner tout" : "Tout sélectionner"}
                    >
                        {selectedIds.size === methods.length && methods.length > 0 ? <CheckCircle2 size={18} /> : <div className={styles.checkboxPlaceholder}></div>}
                        <span>{selectedIds.size === methods.length && methods.length > 0 ? "Tout désélectionner" : "Tout sélectionner"}</span>
                    </button>

                    {selectedIds.size > 0 && (
                        <button
                            className={styles.headerDeleteBtn}
                            onClick={handleBulkDelete}
                            disabled={bulkActionLoading}
                        >
                            <Trash2 size={18} />
                            <span>Supprimer ({selectedIds.size})</span>
                        </button>
                    )}

                    <button onClick={() => setIsAddModalOpen(true)} className={styles.addBtn}>
                        <Plus size={20} />
                        Ajouter une méthode
                    </button>
                </div>
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

                        <div className={styles.switchWrapper}>
                            <div className={styles.actions}>
                                <button
                                    className={styles.editBtn}
                                    onClick={() => setEditingDetails(method)}
                                    title="Modifier"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => setDeletingId(method.id)}
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
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

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nom de la banque</label>
                                    <input
                                        className={styles.input}
                                        value={(editingDetails.config as any)?.bank_name || ''}
                                        onChange={e => setEditingDetails({
                                            ...editingDetails,
                                            config: { ...(editingDetails.config || {}), bank_name: e.target.value }
                                        })}
                                        placeholder="ex: Attijariwafa Bank"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>RIB</label>
                                    <input
                                        className={styles.input}
                                        value={(editingDetails.config as any)?.rib || ''}
                                        onChange={e => setEditingDetails({
                                            ...editingDetails,
                                            config: { ...(editingDetails.config || {}), rib: e.target.value }
                                        })}
                                        placeholder="007 810 0001234567890123 44"
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

            {/* Add Modal */}
            {isAdding && (
                <div className={styles.modalOverlay} onClick={() => setIsAdding(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Ajouter une méthode</h2>
                            <button className={styles.closeBtn} onClick={() => setIsAdding(false)}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Code Unique</label>
                                <input
                                    className={styles.input}
                                    value={newMethod.code}
                                    onChange={e => setNewMethod({ ...newMethod, code: e.target.value })}
                                    required
                                    placeholder="ex: parq_wallet"
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nom (FR)</label>
                                    <input
                                        className={styles.input}
                                        value={newMethod.name}
                                        onChange={e => setNewMethod({ ...newMethod, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nom (AR)</label>
                                    <input
                                        className={styles.input}
                                        value={newMethod.name_ar || ''}
                                        onChange={e => setNewMethod({ ...newMethod, name_ar: e.target.value })}
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description (FR)</label>
                                <textarea
                                    className={styles.textarea}
                                    value={newMethod.description || ''}
                                    onChange={e => setNewMethod({ ...newMethod, description: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description (AR)</label>
                                <textarea
                                    className={`${styles.textarea} text-right`}
                                    value={newMethod.description_ar || ''}
                                    onChange={e => setNewMethod({ ...newMethod, description_ar: e.target.value })}
                                    dir="rtl"
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Ordre</label>
                                    <input
                                        type="number"
                                        className={styles.input}
                                        value={newMethod.sort_order}
                                        onChange={e => setNewMethod({ ...newMethod, sort_order: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Icône (Lucide React)</label>
                                    <input
                                        className={styles.input}
                                        value={newMethod.icon}
                                        onChange={e => setNewMethod({ ...newMethod, icon: e.target.value })}
                                        placeholder="ex: CreditCard"
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Nom de la banque</label>
                                    <input
                                        className={styles.input}
                                        value={(newMethod.config as any)?.bank_name || ''}
                                        onChange={e => setNewMethod({
                                            ...newMethod,
                                            config: { ...(newMethod.config || {}), bank_name: e.target.value }
                                        })}
                                        placeholder="ex: Attijariwafa Bank"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>RIB</label>
                                    <input
                                        className={styles.input}
                                        value={(newMethod.config as any)?.rib || ''}
                                        onChange={e => setNewMethod({
                                            ...newMethod,
                                            config: { ...(newMethod.config || {}), rib: e.target.value }
                                        })}
                                        placeholder="007 810 0001234567890123 44"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={saving}
                            >
                                {saving ? <Loader2 className={styles.spinner} /> : <Save size={18} />}
                                Ajouter la méthode
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deletingId !== null && (
                <div className={styles.modalOverlay} onClick={() => setDeletingId(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                        <div className={styles.modalHeader} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#ef4444' }}>
                                <AlertTriangle size={28} />
                                <h2 style={{ color: '#ef4444' }}>Supprimer ?</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setDeletingId(null)}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div style={{ padding: '24px' }}>
                            <p style={{ color: '#475569', marginBottom: '24px', lineHeight: '1.5' }}>
                                Êtes-vous sûr de vouloir supprimer cette méthode de paiement ? Cette action est irréversible.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                                <button
                                    onClick={() => setDeletingId(null)}
                                    className={styles.editBtn}
                                    disabled={saving}
                                >
                                    Annuler
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className={styles.submitBtn}
                                    style={{ background: '#ef4444', color: 'white', width: 'auto' }}
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className={styles.spinner} /> : <Trash2 size={18} />}
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
