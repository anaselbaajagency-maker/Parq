'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
    Plus, 
    Search, 
    MoreVertical, 
    Trash2, 
    Power, 
    Edit2, 
    X, 
    Ticket, 
    Users, 
    Activity, 
    Calendar,
    Save,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import { 
    Coupon, 
    fetchAllCoupons, 
    createCoupon, 
    updateCoupon, 
    toggleCoupon, 
    deleteCoupon 
} from '@/lib/admin-coupon-api';
import styles from './admin-coupons.module.css';

export default function CouponAdminClient() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        code: '',
        credit_amount: 100,
        max_uses: 1,
        expires_at: '',
        description: ''
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    async function loadCoupons() {
        setLoading(true);
        try {
            const data = await fetchAllCoupons();
            setCoupons(data);
        } catch (error) {
            console.error('Failed to load coupons', error);
        } finally {
            setLoading(false);
        }
    }

    const handleOpenCreateModal = () => {
        setEditingCoupon(null);
        setFormData({
            code: '',
            credit_amount: 100,
            max_uses: 1,
            expires_at: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (coupon: Coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            credit_amount: coupon.credit_amount,
            max_uses: coupon.max_uses,
            expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
            description: coupon.description || ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);
        try {
            if (editingCoupon) {
                await updateCoupon(editingCoupon.id, formData);
                setMessage({ type: 'success', text: 'Coupon mis à jour avec succès' });
            } else {
                await createCoupon(formData);
                setMessage({ type: 'success', text: 'Coupon créé avec succès' });
            }
            setIsModalOpen(false);
            loadCoupons();
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Une erreur est survenue' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggle = async (id: number) => {
        try {
            await toggleCoupon(id);
            setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
        } catch (error) {
            console.error('Toggle failed', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce coupon ?')) return;
        try {
            await deleteCoupon(id);
            setCoupons(prev => prev.filter(c => c.id !== id));
            setMessage({ type: 'success', text: 'Coupon supprimé' });
        } catch (error: any) {
            alert(error.message);
        }
    };

    const filteredCoupons = coupons.filter(c => 
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        total: coupons.length,
        active: coupons.filter(c => c.is_active && !c.is_expired).length,
        totalUses: coupons.reduce((acc, c) => acc + c.used_count, 0)
    };

    if (loading && coupons.length === 0) {
        return <div className={styles.container}>Chargement...</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleSection}>
                    <h1>Gestion des Coupons</h1>
                    <p>Créez et gérez les codes promotionnels pour vos utilisateurs.</p>
                </div>
                <button className={styles.createBtn} onClick={handleOpenCreateModal}>
                    <Plus size={20} /> Nouveau Coupon
                </button>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} bg-blue-50 text-blue-600`}>
                        <Ticket size={28} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Coupons</h3>
                        <div className={styles.statValue}>{stats.total}</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} bg-green-50 text-green-600`}>
                        <Activity size={28} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Coupons Actifs</h3>
                        <div className={styles.statValue}>{stats.active}</div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} bg-purple-50 text-purple-600`}>
                        <Users size={28} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Utilisations Totales</h3>
                        <div className={styles.statValue}>{stats.totalUses}</div>
                    </div>
                </div>
            </div>

            {message && (
                <div style={{ margin: '0 24px 24px' }} className={`p-4 rounded-xl flex items-center gap-3 border ${message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                    {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <span className="font-bold">{message.text}</span>
                    <button className="ml-auto opacity-50 hover:opacity-100" onClick={() => setMessage(null)}>
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className={styles.tableCard}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchBox}>
                        <Search className={styles.searchIcon} size={20} />
                        <input 
                            type="text" 
                            placeholder="Rechercher un code ou une description..." 
                            className={styles.searchInput}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Code</th>
                                <th>Montant</th>
                                <th>Utilisations</th>
                                <th>Expire le</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCoupons.map(coupon => (
                                <tr key={coupon.id}>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className={styles.couponCode}>{coupon.code}</span>
                                            {coupon.description && <span className="text-xs text-gray-500 mt-1">{coupon.description}</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.amount}>{coupon.credit_amount} DH</span>
                                    </td>
                                    <td>
                                        <div className="flex flex-col">
                                            <span className="font-bold">{coupon.used_count} / {coupon.max_uses}</span>
                                            <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                <div 
                                                    className="h-full bg-blue-500" 
                                                    style={{ width: `${(coupon.used_count / coupon.max_uses) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-1.5 text-gray-600">
                                            <Calendar size={14} />
                                            {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Jamais'}
                                        </div>
                                    </td>
                                    <td>
                                        {coupon.is_expired ? (
                                            <span className={`${styles.statusBadge} ${styles.expiredBadge}`}>Expiré</span>
                                        ) : coupon.is_active ? (
                                            <span className={`${styles.statusBadge} ${styles.activeBadge}`}>Actif</span>
                                        ) : (
                                            <span className={`${styles.statusBadge} ${styles.inactiveBadge}`}>Inactif</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button 
                                                className={styles.actionBtn} 
                                                title={coupon.is_active ? 'Désactiver' : 'Activer'}
                                                onClick={() => handleToggle(coupon.id)}
                                            >
                                                <Power size={16} className={coupon.is_active ? 'text-green-500' : 'text-gray-400'} />
                                            </button>
                                            <button className={styles.actionBtn} title="Modifier" onClick={() => handleOpenEditModal(coupon)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`} 
                                                title="Supprimer"
                                                onClick={() => handleDelete(coupon.id)}
                                                disabled={coupon.used_count > 0}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>{editingCoupon ? 'Modifier' : 'Nouveau'} Coupon</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label>Code Coupon</label>
                                    <input 
                                        type="text" 
                                        placeholder="EX: BIENVENUE100" 
                                        required 
                                        value={formData.code}
                                        onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className={styles.formGroup}>
                                        <label>Montant (DH)</label>
                                        <input 
                                            type="number" 
                                            required 
                                            min="1"
                                            value={formData.credit_amount}
                                            onChange={(e) => setFormData({...formData, credit_amount: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Utilisations Max</label>
                                        <input 
                                            type="number" 
                                            required
                                            min="1"
                                            value={formData.max_uses}
                                            onChange={(e) => setFormData({...formData, max_uses: parseInt(e.target.value)})}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Date d'expiration (Optionnel)</label>
                                    <input 
                                        type="date" 
                                        value={formData.expires_at}
                                        onChange={(e) => setFormData({...formData, expires_at: e.target.value})}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Description (Optionnel)</label>
                                    <textarea 
                                        rows={3} 
                                        placeholder="Description pour usage interne..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                                    Annuler
                                </button>
                                <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                                    <Save size={18} className="mr-2" />
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
