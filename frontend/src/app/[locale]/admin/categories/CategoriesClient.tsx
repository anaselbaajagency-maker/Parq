'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchCategories, createCategory, updateCategory, deleteCategory, Category } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Loader2, Save, Search, LayoutGrid, CheckCircle2, AlertOctagon, Info } from 'lucide-react';
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
    const { showAlert } = useAlert();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to load categories', error);
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
            order: 0
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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Catégories</h1>
                    <p className={styles.subtitle}>Organisez les types d'équipements et services</p>
                </div>
                <button onClick={handleCreate} className={styles.primaryBtn}>
                    <Plus size={20} />
                    Ajouter une catégorie
                </button>
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
                            <th>Nom</th>
                            <th>Nom (FR)</th>
                            <th>Nom (AR)</th>
                            <th>Type</th>
                            <th>Icône</th>
                            <th>Slug</th>
                            <th>Statut</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCategories.map((category) => (
                            <tr key={category.id}>
                                <td className={styles.nameCell}>
                                    {category.name}
                                </td>
                                <td>{category.name_fr || '-'}</td>
                                <td>{category.name_ar || '-'}</td>
                                <td>
                                    <span className={`${styles.badge} ${category.type === 'rent' ? styles.badgeRent : styles.badgeBuy}`}>
                                        {category.type === 'rent' ? 'LOCATION' : 'ACHAT'}
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
                                <td colSpan={8} className={styles.emptyCell}>Aucune catégorie trouvée.</td>
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
        </div>
    );
}
