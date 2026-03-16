'use client';

import { useState, useEffect, useCallback } from 'react';
// HMR evaluation trigger: 2026-03-09T17:35:00
import { useTranslations } from 'next-intl';
import styles from './admin-wallets.module.css';
import {
    AdminTopUpRequest, WalletStats, AdminCoupon,
    fetchPendingTopUps, fetchAllTopUps, fetchWalletStats,
    approveTopUp, rejectTopUp, fetchCoupons, createCoupon, toggleCoupon, deleteCoupon
} from '@/lib/admin-wallet-api';
import {
    CheckCircle, XCircle, Loader2, RefreshCw,
    Clock, DollarSign, Calendar, Eye, AlertCircle, FileText, CheckCircle2, ChevronRight,
    ShieldAlert, AlertTriangle, Info, Ticket, Plus, Trash2, Power
} from 'lucide-react';

export default function WalletAdminClient() {
    const t = useTranslations('Admin');

    const [activeTab, setActiveTab] = useState<'pending' | 'history' | 'coupons'>('pending');
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [pendingRequests, setPendingRequests] = useState<AdminTopUpRequest[]>([]);
    const [history, setHistory] = useState<AdminTopUpRequest[]>([]);
    const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [couponsLoading, setCouponsLoading] = useState(false);

    // Modal State
    const [selectedRequest, setSelectedRequest] = useState<AdminTopUpRequest | null>(null);
    const [actionModal, setActionModal] = useState<'approve' | 'reject' | 'view' | 'create_coupon' | null>(null);
    const [actionNote, setActionNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    // New Coupon State
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        credit_amount: 100,
        max_uses: 1,
        description: '',
        expires_at: ''
    });

    // Coupons Multi-select
    const [selectedCouponIds, setSelectedCouponIds] = useState<Set<number>>(new Set());
    const [isCouponsMultiSelect, setIsCouponsMultiSelect] = useState(false);
    const [bulkCouponLoading, setBulkCouponLoading] = useState(false);

    const loadData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [statsData, pendingData] = await Promise.all([
                fetchWalletStats(),
                fetchPendingTopUps()
            ]);
            setStats(statsData);
            setPendingRequests(pendingData);
        } catch (err: any) {
            const errorMessage = err?.message || (typeof err === 'string' ? err : '');
            if (errorMessage.includes('ACCESS_DENIED')) {
                setError('ACCESS_DENIED');
            } else {
                console.error('Failed to load wallet data:', err);
                setError(err.message || "Une erreur est survenue");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const data = await fetchAllTopUps();
            setHistory(data.filter(r => r.status !== 'pending'));
        } catch (err) {
            console.error(err);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    const loadCoupons = useCallback(async () => {
        setCouponsLoading(true);
        try {
            const data = await fetchCoupons();
            setCoupons(data);
        } catch (err) {
            console.error(err);
        } finally {
            setCouponsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (activeTab === 'history' && history.length === 0) {
            loadHistory();
        } else if (activeTab === 'coupons' && coupons.length === 0) {
            loadCoupons();
        }
    }, [activeTab, loadHistory, loadCoupons, history.length, coupons.length]);

    const handleToggleCoupon = async (id: number) => {
        try {
            await toggleCoupon(id);
            setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !c.is_active } : c));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCoupon = async (id: number) => {
        if (!confirm('Voulez-vous vraiment supprimer ce coupon ?')) return;
        try {
            await deleteCoupon(id);
            setCoupons(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCreateCoupon = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await createCoupon(newCoupon);
            await loadCoupons();
            handleCloseModal();
            setNewCoupon({
                code: '',
                credit_amount: 100,
                max_uses: 1,
                description: '',
                expires_at: ''
            });
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du coupon");
        } finally {
            setSubmitting(false);
        }
    };

    const toggleCouponSelection = (id: number) => {
        const newSelected = new Set(selectedCouponIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedCouponIds(newSelected);
    };

    const toggleSelectAllCoupons = () => {
        if (selectedCouponIds.size === coupons.length) {
            setSelectedCouponIds(new Set());
        } else {
            setSelectedCouponIds(new Set(coupons.map(c => c.id)));
        }
    };

    const handleBulkDeleteCoupons = async () => {
        if (selectedCouponIds.size === 0) return;
        if (!confirm(`Voulez-vous vraiment supprimer ${selectedCouponIds.size} coupons ? (Les coupons utilisés ne seront pas supprimés)`)) return;

        setBulkCouponLoading(true);
        try {
            const { bulkDeleteCoupons } = await import('@/lib/admin-wallet-api');
            await bulkDeleteCoupons(Array.from(selectedCouponIds));
            // Refresh
            await loadCoupons();
            setSelectedCouponIds(new Set());
            setIsCouponsMultiSelect(false);
        } catch (err) {
            console.error(err);
            alert("Erreur lors de la suppression groupée");
        } finally {
            setBulkCouponLoading(false);
        }
    };

    const handleOpenAction = (req: AdminTopUpRequest, action: 'approve' | 'reject' | 'view') => {
        setSelectedRequest(req);
        setActionModal(action);
        setActionNote('');
        setError(null);
    };

    const handleCloseModal = () => {
        setSelectedRequest(null);
        setActionModal(null);
        setActionNote('');
        setError(null);
    };

    const handleExecuteAction = async () => {
        if (!selectedRequest || !actionModal) return;
        setSubmitting(true);
        setError(null);

        try {
            if (actionModal === 'approve') {
                await approveTopUp(selectedRequest.id, actionNote);
            } else if (actionModal === 'reject') {
                await rejectTopUp(selectedRequest.id, actionNote);
            }

            // Refresh Data
            await loadData();
            if (activeTab === 'history') await loadHistory();
            handleCloseModal();

        } catch (err: any) {
            setError(err.message || "Une erreur est survenue");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading && !stats) {
        return (
            <div className={styles.loading}>
                <Loader2 className={styles.spinner} size={40} />
                <p>Chargement des données...</p>
            </div>
        );
    }

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
                        className={styles.actionBtn}
                        style={{ width: 'auto' }}
                    >
                        Se connecter
                    </button>
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div className={styles.container}>
                <div className="p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
                    <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
                    <p className="text-slate-600 mb-6">Impossible de charger les données du portefeuille.</p>
                    <button onClick={loadData} className={styles.actionBtn} style={{ width: 'auto', margin: '0 auto' }}>Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Portefeuilles</h1>
                    <p className={styles.subtitle}>Supervision des recharges et soldes utilisateurs</p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'coupons' && (
                        <>
                            <button
                                className={`${styles.selectAllBtn} ${selectedCouponIds.size === coupons.length && coupons.length > 0 ? styles.selected : ''}`}
                                onClick={toggleSelectAllCoupons}
                                title={selectedCouponIds.size === coupons.length ? "Désélectionner tout" : "Tout sélectionner"}
                            >
                                {selectedCouponIds.size === coupons.length && coupons.length > 0 ? <CheckCircle2 size={18} /> : <div className={styles.checkboxPlaceholder}></div>}
                                <span>{selectedCouponIds.size === coupons.length && coupons.length > 0 ? "Tout désélectionner" : "Tout sélectionner"}</span>
                            </button>

                            {selectedCouponIds.size > 0 && (
                                <button
                                    className={styles.headerDeleteBtn}
                                    onClick={handleBulkDeleteCoupons}
                                    disabled={bulkCouponLoading}
                                >
                                    <Trash2 size={18} />
                                    <span>Supprimer ({selectedCouponIds.size})</span>
                                </button>
                            )}
                        </>
                    )}
                    <button onClick={loadData} className={styles.actionBtn}>
                        <RefreshCw size={16} /> Actualiser
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className={styles.statValue}>{stats?.pending_count || 0}</div>
                            <div className={styles.statLabel}>Demandes en attente</div>
                        </div>
                        <div className={styles.statIconWrapper}>
                            <Clock size={24} />
                        </div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className={styles.statValue}>{stats?.approved_this_month_amount || 0} Mad</div>
                            <div className={styles.statLabel}>Revenu ce mois</div>
                        </div>
                        <div className={styles.statIconWrapper}>
                            <DollarSign size={24} />
                        </div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className={styles.statValue}>{stats?.coupons_total_credit || 0} Mad</div>
                            <div className={styles.statLabel}>Total Coupons</div>
                        </div>
                        <div className={`${styles.statIconWrapper} ${styles.statIconCoupon}`}>
                            <Ticket size={24} />
                        </div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className={styles.statValue}>{stats?.free_credits_total || 0} Mad</div>
                            <div className={styles.statLabel}>Free Account sold</div>
                        </div>
                        <div className={`${styles.statIconWrapper} ${styles.statIconFree}`}>
                            <Plus size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`${styles.tab} ${activeTab === 'pending' ? styles.activeTab : ''}`}
                    >
                        En attente ({pendingRequests.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`${styles.tab} ${activeTab === 'history' ? styles.activeTab : ''}`}
                    >
                        Historique
                    </button>
                    <button
                        onClick={() => setActiveTab('coupons')}
                        className={`${styles.tab} ${activeTab === 'coupons' ? styles.activeTab : ''}`}
                    >
                        Tickets Coupons
                    </button>
                </div>
                
                {activeTab === 'coupons' && (
                    <button 
                        className={styles.addBtn}
                        onClick={() => setActionModal('create_coupon')}
                    >
                        <Plus size={18} /> Créer un Coupon
                    </button>
                )}
            </div>

            {/* Content */}
            <div className={styles.tableContainer}>
                {activeTab === 'pending' ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Utilisateur</th>
                                <th>Montant</th>
                                <th>Méthode</th>
                                <th>Date</th>
                                <th>Preuve</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRequests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>
                                        Aucune demande en attente
                                    </td>
                                </tr>
                            ) : (
                                pendingRequests.map(req => (
                                    <tr key={req.id}>
                                        <td>
                                            <div className="font-semibold text-gray-900">{req.user.full_name}</div>
                                            <div className="text-xs text-gray-500">{req.user.email}</div>
                                        </td>
                                        <td className="font-bold text-gray-900">{req.amount} DH</td>
                                        <td>
                                            <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                                                {req.method_label}
                                            </span>
                                        </td>
                                        <td className="text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td>
                                            {req.proof_image ? (
                                                <div
                                                    className={styles.thumbnailContainer}
                                                    onClick={() => setLightboxImage(req.proof_image || null)}
                                                >
                                                    <img
                                                        src={req.proof_image}
                                                        alt="Reçu"
                                                        className={styles.thumbnailImage}
                                                    />
                                                    <div className={styles.imageOverlay}>
                                                        <Eye size={16} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-slate-300 italic text-xs">Aucun reçu</div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className={styles.iconBtnInfo}
                                                    title="Voir le reçu"
                                                    onClick={() => handleOpenAction(req, 'view')}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    className={styles.iconBtn}
                                                    title="Approuver"
                                                    onClick={() => handleOpenAction(req, 'approve')}
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    className={styles.iconBtnDanger}
                                                    title="Rejeter"
                                                    onClick={() => handleOpenAction(req, 'reject')}
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : activeTab === 'history' ? (
                    // History Table
                    <table className={styles.table}>
                        {/* ... existing history table headers ... */}
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Utilisateur</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Preuve</th>
                                <th>Date</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyLoading ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyCell}>
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Chargement de l&apos;historique...
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className={styles.emptyCell}>Aucun historique pour le moment</td>
                                </tr>
                            ) : (
                                history.map(req => (
                                    <tr key={req.id}>
                                        <td className="text-gray-400 font-mono text-xs">#{req.id}</td>
                                        <td>
                                            <div className="font-semibold text-gray-900">{req.user.full_name}</div>
                                            <div className="text-xs text-gray-500">{req.user.email}</div>
                                        </td>
                                        <td className="font-bold text-gray-900">{req.amount} DH</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[req.status]}`}>
                                                {req.status_label}
                                            </span>
                                        </td>
                                        <td>
                                            {req.proof_image ? (
                                                <div
                                                    className={styles.thumbnailContainer}
                                                    style={{ width: '40px', height: '40px' }}
                                                    onClick={() => setLightboxImage(req.proof_image || null)}
                                                >
                                                    <img
                                                        src={req.proof_image}
                                                        alt="Reçu"
                                                        className={styles.thumbnailImage}
                                                    />
                                                    <div className={styles.imageOverlay}>
                                                        <Eye size={14} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                        <td className="text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex justify-end gap-2">
                                                {req.proof_image && (
                                                    <button
                                                        className={styles.iconBtnInfo}
                                                        title="Voir le reçu"
                                                        onClick={() => handleOpenAction(req, 'view')}
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                )}
                                                <div className="text-xs text-gray-400 self-center">
                                                    {req.approved_at ? new Date(req.approved_at).toLocaleDateString() : '-'}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                ) : (
                    // Coupons Table
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>Code</th>
                                <th>Crédit</th>
                                <th>Utilisations</th>
                                <th>Statut</th>
                                <th>Expiration</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {couponsLoading ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Chargement des coupons...
                                    </td>
                                </tr>
                            ) : coupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>Aucun coupon disponible</td>
                                </tr>
                            ) : (
                                coupons.map(coupon => (
                                    <tr 
                                        key={coupon.id}
                                        className={selectedCouponIds.has(coupon.id) ? styles.selectedRow : ''}
                                        onClick={() => toggleCouponSelection(coupon.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td>
                                            <div className={`${styles.customCheckbox} ${selectedCouponIds.has(coupon.id) ? styles.checked : ''}`}>
                                                {selectedCouponIds.has(coupon.id) && <CheckCircle2 size={14} />}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                                                {coupon.code}
                                            </div>
                                            {coupon.description && (
                                                <div className="text-xs text-gray-500 mt-1">{coupon.description}</div>
                                            )}
                                        </td>
                                        <td className="font-bold text-gray-900">{coupon.credit_amount} DH</td>
                                        <td className="text-gray-600">
                                            {coupon.used_count} / {coupon.max_uses === -1 ? '∞' : coupon.max_uses}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${coupon.is_active ? styles.statusActive : styles.statusInactive}`}>
                                                {coupon.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="text-gray-500">
                                            {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : 'Jamais'}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                <button
                                                    className={coupon.is_active ? styles.iconBtnWarning : styles.iconBtnSuccess}
                                                    title={coupon.is_active ? 'Désactiver' : 'Activer'}
                                                    onClick={() => handleToggleCoupon(coupon.id)}
                                                >
                                                    <Power size={18} />
                                                </button>
                                                <button
                                                    className={styles.iconBtnDanger}
                                                    title="Supprimer"
                                                    onClick={() => handleDeleteCoupon(coupon.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {actionModal && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {actionModal === 'view' && 'Preuve de paiement'}
                                {actionModal === 'approve' && 'Approuver la recharge'}
                                {actionModal === 'reject' && 'Rejeter la recharge'}
                                {actionModal === 'create_coupon' && 'Nouveau Coupon'}
                            </h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            {actionModal === 'create_coupon' ? (
                                <form onSubmit={handleCreateCoupon} className="animate-fadeIn space-y-4">
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Code du Coupon (ex: PARQ2024)</label>
                                        <input
                                            type="text"
                                            className={styles.inputPremium}
                                            required
                                            value={newCoupon.code}
                                            onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                            placeholder="Ex: WELCOME100"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Crédit (DH)</label>
                                            <input
                                                type="number"
                                                className={styles.inputPremium}
                                                required
                                                value={newCoupon.credit_amount}
                                                onChange={e => setNewCoupon({ ...newCoupon, credit_amount: parseInt(e.target.value) })}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.formLabel}>Max Utilisations (-1 = ∞)</label>
                                            <input
                                                type="number"
                                                className={styles.inputPremium}
                                                required
                                                value={newCoupon.max_uses}
                                                onChange={e => setNewCoupon({ ...newCoupon, max_uses: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Date d&apos;expiration</label>
                                        <input
                                            type="date"
                                            className={styles.inputPremium}
                                            value={newCoupon.expires_at}
                                            onChange={e => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>Description</label>
                                        <textarea
                                            className={styles.textareaPremium}
                                            value={newCoupon.description}
                                            onChange={e => setNewCoupon({ ...newCoupon, description: e.target.value })}
                                            placeholder="Ex: Coupon de bienvenue pour les nouveaux utilisateurs"
                                        />
                                    </div>
                                    
                                    {error && (
                                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2">
                                            <AlertCircle size={16} /> {error}
                                        </div>
                                    )}

                                    <div className={styles.modalFooterActions}>
                                        <button
                                            type="button"
                                            className={styles.secondaryBtn}
                                            onClick={handleCloseModal}
                                            style={{ flex: 1 }}
                                        >
                                            Annuler
                                        </button>
                                        <button
                                            type="submit"
                                            className={styles.actionBtn}
                                            disabled={submitting}
                                            style={{ flex: 2, justifyContent: 'center' }}
                                        >
                                            {submitting ? <Loader2 className="animate-spin" /> : 'Créer le Coupon'}
                                        </button>
                                    </div>
                                </form>
                            ) : selectedRequest && (
                                <>
                                    {actionModal === 'view' && (
                                        <div className="animate-fadeIn">
                                            <div className={`${styles.modalContentGrid} ${selectedRequest.proof_image ? styles.modalGridTwoCols : ''}`}>
                                                <div className="flex flex-col gap-3">
                                                    <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <FileText size={16} className="text-blue-500" />
                                                        Justificatif de paiement
                                                    </h3>
                                                    {selectedRequest.proof_image ? (
                                                        <div className={styles.receiptPreviewContainer} style={{ aspectRatio: 'auto', maxHeight: '500px' }}>
                                                            <img
                                                                src={selectedRequest.proof_image}
                                                                alt="Preuve"
                                                                className={styles.receiptPreview}
                                                                style={{ maxHeight: '500px' }}
                                                            />
                                                            <a
                                                                href={selectedRequest.proof_image}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.receiptExternalLink}
                                                            >
                                                                <Eye size={14} /> Voir l&apos;original
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
                                                            <AlertTriangle size={48} className="mb-4 opacity-20" />
                                                            <p className="font-medium text-slate-500 text-center">Aucun justificatif n&apos;a été fourni</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className={styles.modalActionColumn}>
                                                    <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
                                                        <div className="bg-orange-500 p-2 rounded-lg shrink-0 h-fit">
                                                            <Info className="text-white" size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-orange-900 text-base">Détails de la demande</h4>
                                                            <p className="text-sm mt-1">Vérifiez les informations avant de valider.</p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.detailsGrid}>
                                                        <div className={styles.detailItem}>
                                                            <div className={styles.detailLabel}>Utilisateur</div>
                                                            <div className={styles.detailValue}>{selectedRequest.user.full_name}</div>
                                                            <div className={styles.detailSubValue}>{selectedRequest.user.email}</div>
                                                        </div>
                                                        <div className={styles.detailItem}>
                                                            <div className={styles.detailLabel}>Montant</div>
                                                            <div className={styles.amountHighlight}>{selectedRequest.amount} DH</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {selectedRequest.status === 'pending' && (
                                                <div className={styles.modalFooterActions}>
                                                    <button className={styles.secondaryBtn} onClick={() => setActionModal('reject')} style={{ flex: 1 }}>
                                                        <XCircle size={18} /> Refuser
                                                    </button>
                                                    <button className={styles.actionBtn} onClick={() => setActionModal('approve')} style={{ flex: 1, justifyContent: 'center' }}>
                                                        <CheckCircle size={18} /> Approuver
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {actionModal === 'approve' && (
                                        <div className="animate-fadeIn">
                                            <div className={`${styles.modalContentGrid} ${selectedRequest.proof_image ? styles.modalGridTwoCols : ''}`}>
                                                {selectedRequest.proof_image && (
                                                    <div className="flex flex-col gap-3">
                                                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                            <FileText size={16} className="text-blue-500" />
                                                            Justificatif
                                                        </h3>
                                                        <div className={styles.receiptPreviewContainer}>
                                                            <img src={selectedRequest.proof_image} alt="Reçu" className={styles.receiptPreview} />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className={styles.modalActionColumn}>
                                                    <div className={`${styles.infoBox} ${styles.infoBoxOrange}`}>
                                                        <div className="bg-orange-500 p-2 rounded-lg shrink-0 h-fit">
                                                            <CheckCircle className="text-white" size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-orange-900 text-base">Approuver</h4>
                                                            <p className="text-sm mt-1">
                                                                Créditer <span className="font-bold">{selectedRequest.amount} DH</span> à {selectedRequest.user.full_name}.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label className={styles.formLabel}>Note interne</label>
                                                        <textarea
                                                            className={styles.textareaPremium}
                                                            value={actionNote}
                                                            onChange={e => setActionNote(e.target.value)}
                                                            placeholder="Référence de transaction..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.modalFooterActions}>
                                                <button className={styles.secondaryBtn} onClick={() => setActionModal('view')} style={{ flex: 1 }}>Retour</button>
                                                <button className={styles.actionBtn} onClick={handleExecuteAction} disabled={submitting} style={{ flex: 2, justifyContent: 'center' }}>
                                                    {submitting ? <Loader2 className="animate-spin" /> : 'Confirmer et Créditer'}
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {actionModal === 'reject' && (
                                        <div className="animate-fadeIn">
                                            <div className={`${styles.modalContentGrid} ${selectedRequest.proof_image ? styles.modalGridTwoCols : ''}`}>
                                                <div className={styles.modalActionColumn}>
                                                    <div className={`${styles.infoBox} ${styles.infoBoxRed}`}>
                                                        <div className="bg-red-500 p-2 rounded-lg shrink-0 h-fit">
                                                            <AlertCircle className="text-white" size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-red-900 text-base">Rejeter</h4>
                                                            <p className="text-sm mt-1">L&apos;utilisateur sera notifié par email.</p>
                                                        </div>
                                                    </div>

                                                    <div className={styles.formGroup}>
                                                        <label className={styles.formLabel}>Motif</label>
                                                        <textarea
                                                            className={styles.textareaPremium}
                                                            value={actionNote}
                                                            onChange={e => setActionNote(e.target.value)}
                                                            placeholder="Image illisible, etc..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.modalFooterActions}>
                                                <button className={styles.secondaryBtn} onClick={() => setActionModal('view')} style={{ flex: 1 }}>Retour</button>
                                                <button className={styles.dangerBtnPrimary} onClick={handleExecuteAction} disabled={submitting} style={{ flex: 2 }}>
                                                    {submitting ? <Loader2 className="animate-spin" /> : 'Confirmer le Rejet'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Lightbox Pop-up */}
            {lightboxImage && (
                <div className={styles.lightboxOverlay} onClick={() => setLightboxImage(null)}>
                    <div className={styles.lightboxContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.lightboxClose} onClick={() => setLightboxImage(null)}>
                            <XCircle size={24} />
                        </button>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={lightboxImage} alt="Large receipt preview" className={styles.lightboxImage} />
                    </div>
                </div>
            )}
        </div>
    );
}
