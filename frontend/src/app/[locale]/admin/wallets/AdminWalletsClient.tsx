'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import styles from './admin-wallets.module.css';
import {
    AdminTopUpRequest, WalletStats,
    fetchPendingTopUps, fetchAllTopUps, fetchWalletStats,
    approveTopUp, rejectTopUp
} from '@/lib/admin-wallet-api';
import {
    CheckCircle, XCircle, Loader2, RefreshCw,
    Clock, DollarSign, Calendar, Eye, AlertCircle, FileText, CheckCircle2, ChevronRight
} from 'lucide-react';
import Image from 'next/image';

export default function AdminWalletsClient() {
    const t = useTranslations('Admin');

    const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
    const [stats, setStats] = useState<WalletStats | null>(null);
    const [pendingRequests, setPendingRequests] = useState<AdminTopUpRequest[]>([]);
    const [history, setHistory] = useState<AdminTopUpRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Modal State
    const [selectedRequest, setSelectedRequest] = useState<AdminTopUpRequest | null>(null);
    const [actionModal, setActionModal] = useState<'approve' | 'reject' | 'view' | null>(null);
    const [actionNote, setActionNote] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [statsData, pendingData] = await Promise.all([
                fetchWalletStats(),
                fetchPendingTopUps()
            ]);
            setStats(statsData);
            setPendingRequests(pendingData);
        } catch (err) {
            console.error('Failed to load wallet data:', err);
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

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (activeTab === 'history' && history.length === 0) {
            loadHistory();
        }
    }, [activeTab, loadHistory, history.length]);

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
                if (!actionNote.trim()) {
                    setError("Un motif de refus est requis.");
                    setSubmitting(false);
                    return;
                }
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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Portefeuilles</h1>
                    <p className={styles.subtitle}>Supervision des recharges et soldes utilisateurs</p>
                </div>
                <button onClick={loadData} className={styles.actionBtn}>
                    <RefreshCw size={16} /> Actualiser
                </button>
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
                            <div className={styles.statValue}>{stats?.pending_amount || 0} Mad</div>
                            <div className={styles.statLabel}>Montant en attente</div>
                        </div>
                        <div className={styles.statIconWrapper}>
                            <AlertCircle size={24} />
                        </div>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className="flex justify-between items-start">
                        <div>
                            <div className={styles.statValue}>{stats?.approved_today || 0}</div>
                            <div className={styles.statLabel}>Validé aujourd'hui</div>
                        </div>
                        <div className={styles.statIconWrapper}>
                            <CheckCircle2 size={24} />
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
            </div>

            {/* Tabs */}
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
                    Historique complet
                </button>
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
                                                <button
                                                    onClick={() => handleOpenAction(req, 'view')}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                                                >
                                                    <FileText size={16} /> Voir le reçu
                                                </button>
                                            ) : (
                                                <span className="text-gray-400 text-sm italic">N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex justify-end gap-2">
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
                ) : (
                    // History Table
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>#ID</th>
                                <th>Utilisateur</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Date</th>
                                <th>Traitement</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyLoading ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Chargement de l'historique...
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>Aucun historique pour le moment</td>
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
                                        <td className="text-gray-500">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="text-xs text-gray-400">
                                            {req.approved_at ? new Date(req.approved_at).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {actionModal && selectedRequest && (
                <div className={styles.modalOverlay} onClick={handleCloseModal}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>
                                {actionModal === 'view' && 'Preuve de paiement'}
                                {actionModal === 'approve' && 'Approuver la recharge'}
                                {actionModal === 'reject' && 'Rejeter la recharge'}
                            </h2>
                            <button className={styles.closeBtn} onClick={handleCloseModal}>
                                <XCircle size={24} />
                            </button>
                        </div>
                        <div className="p-6">
                            {actionModal === 'view' && selectedRequest.proof_image && (
                                <div className="flex flex-col gap-4">
                                    <div className="relative w-full h-[400px] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                        <Image
                                            src={selectedRequest.proof_image}
                                            alt="Proof"
                                            fill
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                        <button
                                            className={styles.dangerBtn}
                                            onClick={() => setActionModal('reject')}
                                        >
                                            <XCircle size={18} /> Rejeter
                                        </button>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => setActionModal('approve')}
                                        >
                                            <CheckCircle size={18} /> Approuver
                                        </button>
                                    </div>
                                </div>
                            )}

                            {actionModal === 'approve' && (
                                <div>
                                    <div className="bg-orange-50 text-orange-800 p-4 rounded-xl mb-6 flex items-start gap-3">
                                        <CheckCircle className="shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <p className="font-bold">Confirmation d'approbation</p>
                                            <p className="text-sm opacity-90">
                                                Vous allez créditer <span className="font-bold">{selectedRequest.amount} DH</span> sur le compte de <span className="font-bold">{selectedRequest.user.full_name}</span>.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Note interne (optionnel)</label>
                                        <textarea
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors"
                                            rows={3}
                                            value={actionNote}
                                            onChange={e => setActionNote(e.target.value)}
                                            placeholder="Référence transaction, détails..."
                                        />
                                    </div>

                                    <button
                                        className={`${styles.actionBtn} ${styles.fullWidth}`}
                                        onClick={handleExecuteAction}
                                        disabled={submitting}
                                    >
                                        {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirmer et Créditer'}
                                    </button>
                                </div>
                            )}

                            {actionModal === 'reject' && (
                                <div>
                                    <div className="bg-red-50 text-red-800 p-4 rounded-xl mb-6 flex items-start gap-3">
                                        <AlertCircle className="shrink-0 mt-0.5" size={20} />
                                        <div>
                                            <p className="font-bold">Refus de la demande</p>
                                            <p className="text-sm opacity-90">
                                                L'utilisateur sera notifié et la demande sera marquée comme rejetée.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-bold mb-2 text-gray-700">Motif du refus <span className="text-red-500">*</span></label>
                                        <textarea
                                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-red-500 transition-colors"
                                            rows={3}
                                            value={actionNote}
                                            onChange={e => setActionNote(e.target.value)}
                                            placeholder="Ex: Preuve illisible, Montant incorrect..."
                                        />
                                    </div>

                                    {error && <p className="text-red-600 text-sm mb-4 font-medium flex items-center gap-2"><AlertCircle size={16} /> {error}</p>}

                                    <button
                                        className={styles.dangerBtnPrimary}
                                        onClick={handleExecuteAction}
                                        disabled={submitting}
                                    >
                                        {submitting ? <Loader2 className="animate-spin mx-auto" /> : 'Confirmer le Rejet'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
