'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchCities, createCity, updateCity, deleteCity, bulkDeleteCities, City } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Loader2, Save, Search, MapPin, Globe, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useAlert } from '@/context/AlertContext';
import styles from './cities.module.css';

export default function CitiesClient() {
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [formData, setFormData] = useState<Partial<City>>({});
    const [processing, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { showAlert } = useAlert();

    // Multi-select State
    const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());
    const [bulkActionProcessing, setBulkActionProcessing] = useState(false);

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCities();
            setCities(data);
        } catch (error: any) {
            const errorMessage = error?.message || (typeof error === 'string' ? error : '');
            if (errorMessage.includes('ACCESS_DENIED')) {
                setError('ACCESS_DENIED');
            } else {
                console.error('Failed to load cities', error);
                setError('FETCH_ERROR');
                showAlert('error', 'Impossible de charger les villes. Veuillez réessayer.', 'Erreur');
            }
        } finally {
            setLoading(false);
        }
    };

    const stats = useMemo(() => ({
        total: cities.length,
        active: cities.filter(c => c.is_active).length,
        regions: new Set(cities.map(c => c.region).filter(Boolean)).size
    }), [cities]);

    const filteredCities = useMemo(() => {
        return cities.filter(city => {
            const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (city.region && city.region.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesRegion = !selectedRegion || city.region === selectedRegion;
            return matchesSearch && matchesRegion;
        });
    }, [cities, searchQuery, selectedRegion]);

    const regionsList = [
        "Tanger-Tétouan-Al Hoceïma",
        "L'Oriental",
        "Fès-Meknès",
        "Rabat-Salé-Kénitra",
        "Béni Mellal-Khénifra",
        "Casablanca-Settat",
        "Marrakech-Safi",
        "Drâa-Tafilalet",
        "Souss-Massa",
        "Guelmim-Oued Noun",
        "Laâyoune-Sakia El Hamra",
        "Dakhla-Oued Ed-Dahab"
    ];

    const isAllSelected = filteredCities.length > 0 && Array.from(selectedIds).length === filteredCities.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredCities.map(c => c.id)));
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
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} villes ?`)) return;

        setBulkActionProcessing(true);
        try {
            const idsArray = Array.from(selectedIds);
            await bulkDeleteCities(idsArray);
            setCities(prev => prev.filter(c => !selectedIds.has(c.id)));
            setSelectedIds(new Set());
            showAlert('success', `${idsArray.length} villes supprimées avec succès.`, 'Succès');
        } catch (error) {
            console.error('Bulk delete error:', error);
            showAlert('error', 'Une erreur est survenue lors de la suppression en masse', 'Erreur');
        } finally {
            setBulkActionProcessing(false);
        }
    }

    const handleCreate = () => {
        setEditingCity(null);
        setFormData({
            name: '',
            name_fr: '',
            name_ar: '',
            slug: '',
            region: '',
            is_active: true
        } as any);
        setIsModalOpen(true);
    };

    const handleEdit = (city: City) => {
        setEditingCity(city);
        setFormData({ ...city });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) return;

        try {
            await deleteCity(id);
            setCities(prev => prev.filter(c => c.id !== id));
            showAlert('success', 'Ville supprimée avec succès.', 'Succès');
        } catch (error) {
            console.error('Failed to delete city', error);
            showAlert('error', 'Échec de la suppression.', 'Erreur');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editingCity) {
                const updated = await updateCity(editingCity.id, formData);
                if (updated) {
                    setCities(prev => prev.map(c => c.id === editingCity.id ? updated : c));
                    setIsModalOpen(false);
                    showAlert('success', 'Ville mise à jour avec succès.', 'Succès');
                }
            } else {
                const created = await createCity(formData);
                if (created) {
                    setCities(prev => [...prev, created]);
                    setIsModalOpen(false);
                    showAlert('success', 'Ville créée avec succès.', 'Succès');
                }
            }
        } catch (error) {
            console.error('Failed to save city', error);
            showAlert('error', "Échec de l'enregistrement.", 'Erreur');
        } finally {
            setSaving(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!editingCity) {
            setFormData(prev => ({
                ...prev,
                name: val,
                slug: val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }));
        } else {
            setFormData(prev => ({ ...prev, name: val }));
        }
    };

    const toggleStatus = async (city: City) => {
        try {
            const newStatus = !city.is_active;
            const updated = await updateCity(city.id, { is_active: newStatus });
            if (updated) {
                // Handle response where backend might return 1/0 or boolean
                const finalStatus = updated.is_active !== undefined ? Boolean(updated.is_active) : newStatus;
                setCities(prev => prev.map(c => c.id === city.id ? { ...c, is_active: finalStatus } : c));
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
                    <p className="text-slate-600 mb-6">Impossible de charger les villes.</p>
                    <button onClick={loadCities} className={styles.primaryBtn} style={{ width: 'auto', margin: '0 auto' }}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Villes</h1>
                    <p className={styles.subtitle}>Configurez les zones géographiques disponibles</p>
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
                        Ajouter une ville
                    </button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div>
                        <div className={styles.statValue}>{stats.total}</div>
                        <div className={styles.statLabel}>Villes Totales</div>
                    </div>
                    <div className={styles.statIconWrapper}>
                        <MapPin size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div>
                        <div className={styles.statValue}>{stats.active}</div>
                        <div className={styles.statLabel}>Villes Actives</div>
                    </div>
                    <div className={styles.statIconWrapper}>
                        <CheckCircle2 size={24} />
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div>
                        <div className={styles.statValue}>{stats.regions}</div>
                        <div className={styles.statLabel}>Régions Couvertes</div>
                    </div>
                    <div className={styles.statIconWrapper}>
                        <Globe size={24} />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.controlsRow}>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Rechercher une ville ou région..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <select 
                        className={styles.regionSelect}
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="">Toutes les régions</option>
                        {regionsList.map(region => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
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
                            <th>Nom (AR)</th>
                            <th>Région</th>
                            <th>Slug</th>
                            <th>Statut</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCities.map((city) => (
                            <tr 
                                key={city.id} 
                                className={selectedIds.has(city.id) ? styles.selectedRow : ''}
                                onClick={() => toggleSelect(city.id)}
                            >
                                <td>
                                    <div 
                                        className={`${styles.customCheckbox} ${selectedIds.has(city.id) ? styles.checked : ''}`}
                                        onClick={(e) => { e.stopPropagation(); toggleSelect(city.id); }}
                                    >
                                        {selectedIds.has(city.id) && <CheckCircle2 size={14} />}
                                    </div>
                                </td>
                                <td className={styles.nameCell}>{city.name}</td>
                                <td>{city.name_fr || <span className="text-gray-400">-</span>}</td>
                                <td>{city.name_ar || <span className="text-gray-400">-</span>}</td>
                                <td>
                                    {city.region ? (
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-semibold">
                                            {city.region}
                                        </span>
                                    ) : '-'}
                                </td>
                                <td className="text-gray-500 font-mono text-xs">{city.slug}</td>
                                <td>
                                    <button
                                        onClick={() => toggleStatus(city)}
                                        className={`${styles.statusBtn} ${city.is_active ? styles.statusActive : styles.statusInactive}`}
                                        title={city.is_active ? 'Cliquez pour désactiver' : 'Cliquez pour activer'}
                                    >
                                        {city.is_active ? 'Actif' : 'Inactif'}
                                    </button>
                                </td>
                                <td>
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(city)} className={styles.iconBtn} title="Modifier">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(city.id)} className={styles.iconBtnDanger} title="Supprimer">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCities.length === 0 && (
                            <tr>
                                <td colSpan={7} className={styles.emptyCell}>
                                    {searchQuery ? 'Aucune ville ne correspond à votre recherche.' : 'Aucune ville trouvée.'}
                                </td>
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
                            <h2>{editingCity ? 'Modifier la ville' : 'Ajouter une ville'}</h2>
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
                                    onChange={handleNameChange}
                                    required
                                    placeholder="Ex: Casablanca"
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Nom (Français)</label>
                                    <input
                                        type="text"
                                        value={formData.name_fr || ''}
                                        onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                        placeholder="Ex: Casablanca"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Nom (Arabe)</label>
                                    <input
                                        type="text"
                                        value={formData.name_ar || ''}
                                        onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                        placeholder="Ex: الدار البيضاء"
                                        dir="rtl"
                                    />
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
                                <label>Région</label>
                                <select
                                    value={formData.region || ''}
                                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                                >
                                    <option value="">Sélectionner une région</option>
                                    <option value="Tanger-Tétouan-Al Hoceïma">Tanger-Tétouan-Al Hoceïma</option>
                                    <option value={"L'Oriental"}>L&apos;Oriental</option>
                                    <option value="Fès-Meknès">Fès-Meknès</option>
                                    <option value="Rabat-Salé-Kénitra">Rabat-Salé-Kénitra</option>
                                    <option value="Béni Mellal-Khénifra">Béni Mellal-Khénifra</option>
                                    <option value="Casablanca-Settat">Casablanca-Settat</option>
                                    <option value="Marrakech-Safi">Marrakech-Safi</option>
                                    <option value="Drâa-Tafilalet">Drâa-Tafilalet</option>
                                    <option value="Souss-Massa">Souss-Massa</option>
                                    <option value="Guelmim-Oued Noun">Guelmim-Oued Noun</option>
                                    <option value="Laâyoune-Sakia El Hamra">Laâyoune-Sakia El Hamra</option>
                                    <option value="Dakhla-Oued Ed-Dahab">Dakhla-Oued Ed-Dahab</option>
                                </select>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>
                                    Annuler
                                </button>
                                <button type="submit" disabled={processing} className={styles.saveBtn}>
                                    {processing ? <Loader2 className={styles.spinner} size={18} /> : <Save size={18} />}
                                    {editingCity ? 'Enregistrer' : 'Créer la ville'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
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
