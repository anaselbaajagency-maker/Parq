'use client';

import { useState, useEffect, useMemo } from 'react';
import { fetchCities, createCity, updateCity, deleteCity, City } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Loader2, Save, Search, MapPin, Globe, CheckCircle2 } from 'lucide-react';
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
    const { showAlert } = useAlert();

    useEffect(() => {
        loadCities();
    }, []);

    const loadCities = async () => {
        setLoading(true);
        try {
            const data = await fetchCities();
            setCities(data);
        } catch (error) {
            console.error('Failed to load cities', error);
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
        return cities.filter(city =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (city.region && city.region.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [cities, searchQuery]);

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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Villes</h1>
                    <p className={styles.subtitle}>Gérez les zones de couverture (Villes et Régions)</p>
                </div>
                <button onClick={handleCreate} className={styles.primaryBtn}>
                    <Plus size={20} />
                    Ajouter une ville
                </button>
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
            </div>

            {/* Table */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
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
                            <tr key={city.id}>
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
                                    <option value="L'Oriental">L'Oriental</option>
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
        </div>
    );
}
