'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, bulkDeleteCategories, Category } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Loader2, Save, Search, LayoutGrid, CheckCircle2, AlertOctagon, Info, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
import IconPicker from './IconPicker';
import styles from './admin-categories.module.css';

export default function CategoriesClient() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState<Partial<Category>>({});
    const [processing, setProcessing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();

    // Multi-select State
    const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());
    const [bulkActionProcessing, setBulkActionProcessing] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error: any) {
            const errorMessage = error?.message || (typeof error === 'string' ? error : '');
            if (errorMessage.includes('ACCESS_DENIED')) {
                setError('ACCESS_DENIED');
            } else {
                console.error('Failed to load categories', error);
                setError('FETCH_ERROR');
            }
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: categories.length,
        active: categories.filter(c => c.is_active).length,
        rent: categories.filter(c => c.type === 'rent').length,
        buy: categories.filter(c => c.type === 'buy').length,
    }), [categories]);

    const filteredCategories = useMemo(() => {
        return categories.filter(category =>
            category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (category.name_fr && category.name_fr.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (category.name_ar && category.name_ar.includes(searchQuery))
        );
    }, [categories, searchQuery]);

    const isAllSelected = filteredCategories.length > 0 && Array.from(selectedIds).length === filteredCategories.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredCategories.map(c => c.id)));
        }
    };

    const toggleSelect = (id: number | string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    async function handleBulkDelete() {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.size} categories? All listings in these categories might be affected.`)) return;

        setBulkActionProcessing(true);
        try {
            const idsArray = Array.from(selectedIds);
            await bulkDeleteCategories(idsArray);
            setCategories(prev => prev.filter(c => !selectedIds.has(c.id)));
            setSelectedIds(new Set());
            showAlert('success', `${idsArray.length} catégories supprimées avec succès.`, 'Succès');
        } catch (error) {
            console.error('Bulk delete error:', error);
            showAlert('error', 'Une erreur est survenue lors de la suppression en masse', 'Erreur');
        } finally {
            setBulkActionProcessing(false);
        }
    }

    const handleCreate = () => {
        setEditingCategory(null);
        setFormData({
            name: '',
            name_fr: '',
            name_ar: '',
            slug: '',
            type: 'rent',
            icon: 'LayoutGrid',
            description: '',
            description_fr: '',
            description_ar: '',
            is_active: true,
            order: 0,
            daily_cost: 0
        } as any);
        setIsModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ ...category });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await deleteCategory(id.toString());
            setCategories(prev => prev.filter(c => c.id !== id));
            showAlert('success', 'Catégorie supprimée.', 'Succès');
        } catch (error) {
            console.error('Failed to delete category', error);
            showAlert('error', 'Échec de la suppression.', 'Erreur');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            if (editingCategory) {
                const updated = await updateCategory(editingCategory.id.toString(), formData);
                if (updated) {
                    setCategories(prev => prev.map(c => c.id === editingCategory.id ? updated : c));
                    setIsModalOpen(false);
                    showAlert('success', 'Catégorie modifiée.', 'Modifié');
                }
            } else {
                const created = await createCategory(formData);
                if (created) {
                    setCategories(prev => [...prev, created]);
                    setIsModalOpen(false);
                    showAlert('success', 'Catégorie créée.', 'Créé');
                }
            }
        } catch (error) {
            console.error('Failed to save category', error);
            showAlert('error', "Échec de l'enregistrement.", 'Erreur');
        } finally {
            setProcessing(false);
        }
    };

    const toggleStatus = async (category: Category) => {
        try {
            const newStatus = !category.is_active;
            const updated = await updateCategory(category.id.toString(), { is_active: newStatus });
            if (updated) {
                const finalStatus = updated.is_active !== undefined ? Boolean(updated.is_active) : newStatus;
                setCategories(prev => prev.map(c => c.id === category.id ? { ...c, is_active: finalStatus } : c));
            }
        } catch (error) {
            console.error('Failed to toggle status', error);
            showAlert('error', 'Impossible de changer le statut', 'Erreur');
        }
    };

    if (loading) return <div className={styles.loadingState}><Loader2 className={styles.spinner} size={40} /></div>;

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
                        className={styles.primaryBtn}
                        style={{ width: 'auto' }}
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
                    <p className="text-slate-600 mb-6">Impossible de charger les catégories.</p>
                    <button onClick={loadCategories} className={styles.primaryBtn} style={{ width: 'auto', margin: '0 auto' }}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Catégories</h1>
                    <p className={styles.subtitle}>Organisez les types d&apos;équipements et services</p>
                </div>
                <div className="flex gap-3">
                    <button
                        className={`${styles.selectAllBtn} ${isAllSelected ? styles.selected : ''}`}
                        onClick={toggleSelectAll}
                        title={isAllSelected ? "Désélectionner tout" : "Tout sélectionner"}
                    >
                        {isAllSelected ? <CheckCircle2 size={18} /> : <div className={styles.checkboxPlaceholder}></div>}
                        <span>{isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}</span>
                    </button>

                    {selectedIds.size > 0 && (
                        <button
                            className={styles.headerDeleteBtn}
                            onClick={handleBulkDelete}
                            disabled={bulkActionProcessing}
                        >
                            {bulkActionProcessing ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            <span>Supprimer ({selectedIds.size})</span>
                        </button>
                    )}
                    <button onClick={handleCreate} className={styles.primaryBtn}>
                        <Plus size={20} />
                        Ajouter une catégorie
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Total Catégories</div>
                    </div>
                    <div className={styles.statIconWrapper}>
                        <LayoutGrid size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div>
                        <div className={styles.statValue}>{stats.active}</div>
                        <div className={styles.statLabel}>Actives</div>
                    </div>
                    <div className={styles.statIconWrapper}>
                        <CheckCircle2 size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div>
                        <div className={styles.statValue}>{stats.rent}</div>
                        <div className={styles.statLabel}>Location (Rent)</div>
                    </div>
                    <div className={styles.statIconWrapper}>
                        <Info size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div>
                        <div className={styles.statValue}>{stats.buy}</div>
                        <div className={styles.statLabel}>Achat (Buy)</div>
                    </div>
                    <div className={styles.statIconWrapper}>
                        <AlertOctagon size={24} />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search className={styles.searchIcon} size={18} />
                    <input
                        className={styles.searchInput}
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Nom</th>
                            <th>Nom (FR)</th>
                            <th>Annonces</th>
                            <th>Type</th>
                            <th>Coût journalier</th>
                            <th>Icône</th>
                            <th>Statut</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr 
                                key={category.id} 
                                className={selectedIds.has(category.id) ? styles.selectedRow : ''}
                                onClick={() => toggleSelect(category.id)}
                            >
                                <td>
                                    <div 
                                        className={`${styles.customCheckbox} ${selectedIds.has(category.id) ? styles.checked : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleSelect(category.id); }}
                                    >
                                        {selectedIds.has(category.id) && <CheckCircle2 size={14} />}
                                    </div>
                                </td>
                                <td className={styles.nameCell}>
                                    {category.name}
                                </td>
                                <td>{category.name_fr || '-'}</td>
                                <td>
                                    <div className={styles.countBadge}>
                                        <LayoutGrid size={14} className="text-slate-400" />
                                        <span>{category.listings_count || 0}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${category.type === 'rent' ? styles.badgeRent : styles.badgeBuy}`}>
                                        {category.type === 'rent' ? 'LOCATION' : 'ACHAT'}
                                    </span>
                                </td>
                                <td>
                                    <span style={{ fontWeight: 600, color: '#1e293b' }}>
                                        {category.daily_cost || 0} DH
                                    </span>
                                </td>
                                <td>
                                    <span className="bg-gray-100 p-2 rounded-lg inline-block text-xs">
                                        {category.icon || '-'}
                                    </span>
                                </td>
                                <td className="text-gray-400 font-mono text-xs">{category.slug}</td>
                                <td>
                                    <button
                                        onClick={() => toggleStatus(category)}
                                        className={`${styles.statusBtn} ${category.is_active ? styles.statusActive : styles.statusInactive}`}
                                        title={category.is_active ? 'Cliquez pour désactiver' : 'Cliquez pour activer'}
                                    >
                                        {category.is_active ? 'Actif' : 'Inactif'}
                                    </button>
                                </td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(category)} className={styles.iconBtn} title="Modifier">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className={styles.iconBtnDanger} title="Supprimer">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                         {filteredCategories.length === 0 && (
                            <tr>
                                <td colSpan={10} className={styles.emptyCell}>Aucune catégorie trouvée.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>{editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className={styles.closeBtn}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label>Nom (Anglais/Défaut) *</label>
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Ex: Heavy Machinery"
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Nom (Français)</label>
                                    <input
                                        type="text"
                                        value={formData.name_fr || ''}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setFormData(prev => ({
                                                ...prev,
                                                name_fr: val,
                                                slug: !editingCategory ? val.toLowerCase().trim()
                                                    .replace(/[àáâãäå]/g, 'a')
                                                    .replace(/[ç]/g, 'c')
                                                    .replace(/[èéêë]/g, 'e')
                                                    .replace(/[ìíîï]/g, 'i')
                                                    .replace(/[ñ]/g, 'n')
                                                    .replace(/[òóôõö]/g, 'o')
                                                    .replace(/[ùúûü]/g, 'u')
                                                    .replace(/[ýÿ]/g, 'y')
                                                    .replace(/ /g, '-')
                                                    .replace(/[^\w-]+/g, '') : prev.slug
                                            }));
                                        }}
                                        placeholder="Ex: Engins BTP"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nom (Arabe)</label>
                                    <input
                                        type="text"
                                        value={formData.name_ar || ''}
                                        onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                        placeholder="Ex: آليات الأشغال"
                                        dir="rtl"
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Type de transaction</label>
                                    <select
                                        value={formData.type || 'rent'}
                                        onChange={e => setFormData({ ...formData, type: e.target.value as 'rent' | 'buy' })}
                                    >
                                        <option value="rent">Location (Rent)</option>
                                        <option value="buy">Achat (Buy)</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Icône</label>
                                    <button
                                        type="button"
                                        className={styles.iconSelectorBtn}
                                        onClick={() => setShowIconPicker(true)}
                                    >
                                        {formData.icon ? (
                                            <>
                                                <span className="font-medium">{formData.icon}</span>
                                                <span className={styles.changeText}>Modifier</span>
                                            </>
                                        ) : (
                                            <span style={{ color: '#999' }}>Choisir une icône...</span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Slug (URL) *</label>
                                    <input
                                        type="text"
                                        value={formData.slug || ''}
                                        onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                        required
                                        className="font-mono text-sm bg-gray-50"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Coût journalier (DH)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.daily_cost || 0}
                                        onChange={e => setFormData({ ...formData, daily_cost: parseFloat(e.target.value) || 0 })}
                                        placeholder="Ex: 10.00"
                                    />
                                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Montant débité chaque jour.</p>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Description</label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    rows={2}
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                                    Annuler
                                </button>
                                <button type="submit" disabled={processing} className={styles.saveBtn}>
                                    {processing ? <Loader2 className={styles.spinner} size={18} /> : <Save size={18} />}
                                    {editingCategory ? 'Enregistrer' : 'Créer la catégorie'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showIconPicker && (
                <IconPicker
                    selectedIcon={formData.icon || ''}
                    onSelect={(icon) => setFormData({ ...formData, icon })}
                    onClose={() => setShowIconPicker(false)}
                />
            )}

            {/* Floating Bulk Actions Bar */}
            {selectedIds.size > 0 && (
                <div className={styles.bulkActionsBar}>
                    <div className={styles.bulkActionsContainer}>
                        <div className={styles.bulkActionsInfo}>
                            <span className={styles.selectionCount}>{selectedIds.size}</span>
                            <span className={styles.selectionLabel}>sélectionné(s)</span>
                        </div>
                        <div className={styles.bulkActionsButtons}>
                            <button
                                className={styles.bulkDeleteBtn}
                                onClick={handleBulkDelete}
                                disabled={bulkActionProcessing}
                            >
                                {bulkActionProcessing ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                <span>Supprimer la sélection</span>
                            </button>
                            <button
                                className={styles.bulkCancelBtn}
                                onClick={() => setSelectedIds(new Set())}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
