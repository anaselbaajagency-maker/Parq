'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from '../../../../navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useLocale } from 'next-intl';
import {
    Users, Plus, ChevronRight, Loader2,
    AlertTriangle, Shield, Search, Trash2, Edit2, UserCog, UserCheck, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { API_BASE_URL, fetchAdminUsers, updateAdminUser, deleteAdminUser, bulkDeleteUsers } from '@/lib/api';
import styles from './users.module.css';

interface User {
    id: string | number;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    listings_count?: number;
}

export default function UsersPage() {
    const { user: currentUser } = useAuthStore();
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const locale = useLocale();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Multi-select State
    const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        if (!currentUser || currentUser.role !== 'ADMIN') {
            router.replace('/tableau-de-bord');
            return;
        }
        loadUsers();
    }, [isMounted, currentUser, router]);

    async function loadUsers() {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchAdminUsers();
            const userData = response.data || [];
            setUsers(userData);
        } catch (error: any) {
            const errorMessage = error?.message || (typeof error === 'string' ? error : '');
            if (errorMessage.includes('ACCESS_DENIED')) {
                setError('ACCESS_DENIED');
            } else {
                console.error('Failed to load users:', error);
                setError('FETCH_ERROR');
            }
        } finally {
            setLoading(false);
        }
    }

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const isAllSelected = filteredUsers.length > 0 && Array.from(selectedIds).length === filteredUsers.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredUsers.map(u => u.id)));
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
        if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} utilisateurs ?`)) return;

        setBulkActionLoading(true);
        try {
            const idsArray = Array.from(selectedIds);
            await bulkDeleteUsers(idsArray);
            setUsers(prev => prev.filter(u => !selectedIds.has(u.id)));
            setSelectedIds(new Set());
            alert(`${idsArray.length} utilisateurs supprimés`);
        } catch (error) {
            console.error('Bulk delete error:', error);
            alert("Une erreur est survenue lors de la suppression en masse");
        } finally {
            setBulkActionLoading(false);
        }
    }

    const stats = useMemo(() => ({
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        providers: users.filter(u => u.role === 'PROVIDER').length,
    }), [users]);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Edit State
    const [editRole, setEditRole] = useState('user');

    const openEdit = (user: User) => {
        setEditingUser(user);
        setEditRole(user.role.toLowerCase());
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        setActionLoading(true);
        try {
            await updateAdminUser(editingUser.id, { role: editRole });
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, role: editRole.toUpperCase() } : u));
            setEditingUser(null);
        } catch (error: any) {
            if (error.message !== 'ACCESS_DENIED') {
                console.error('Failed to update user', error);
                alert("Failed to update user role");
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        setIsDeleting(id);
        try {
            await deleteAdminUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (error: any) {
            if (error.message !== 'ACCESS_DENIED') {
                console.error('Failed to delete user', error);
                alert("Failed to delete user");
            }
        } finally {
            setIsDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <Loader2 className={styles.spinner} size={40} />
                <p>Initialisation du module utilisateurs...</p>
            </div>
        );
    }

    if (error === 'ACCESS_DENIED' || (!currentUser || currentUser.role !== 'ADMIN')) {
        return (
            <div className={styles.container}>
                <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
                    <ShieldAlert size={48} className="text-red-500 mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Accès Refusé</h2>
                    <p className="text-slate-600 mb-6 max-w-md">
                        Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                        Veuillez vous connecter avec un compte administrateur.
                    </p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
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
                <div className="p-12 text-center bg-white rounded-2xl shadow-sm border border-slate-100 mt-8">
                    <AlertTriangle size={48} className="text-amber-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Une erreur est survenue</h2>
                    <p className="text-slate-600 mb-6">Impossible de charger la liste des utilisateurs.</p>
                    <button onClick={loadUsers} className="bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors">Réessayer</button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Utilisateurs</h1>
                    <p className={styles.subtitle}>Administrez les accès et rôles de la plateforme</p>
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
                            disabled={bulkActionLoading}
                        >
                            {bulkActionLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            <span>Supprimer ({selectedIds.size})</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} bg-blue-50 text-blue-600`}>
                        <Users />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.total}</h3>
                        <p>Utilisateurs Total</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} bg-green-50 text-green-600`}>
                        <UserCheck />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.providers}</h3>
                        <p>Prestataires</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={`${styles.statIcon} bg-purple-50 text-purple-600`}>
                        <Shield />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>{stats.admins}</h3>
                        <p>Administrateurs</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                <div className={styles.controlsRow}>
                    <button
                        className={`${styles.selectAllBtn} ${isAllSelected ? styles.selected : ''}`}
                        onClick={toggleSelectAll}
                    >
                        {isAllSelected ? <UserCheck size={18} /> : <div className={styles.checkboxPlaceholder}></div>}
                        <span>{isAllSelected ? "Tout désélectionner" : "Tout sélectionner"}</span>
                    </button>
                    <div className={styles.searchWrapper}>
                        <Search className={styles.searchIcon} size={20} />
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder="Rechercher par nom, email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}></th>
                            <th>Identité</th>
                            <th>Rôle</th>
                            <th>Date d&apos;inscription</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className={styles.emptyState}>
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map(u => (
                                <tr key={u.id} className={selectedIds.has(u.id) ? styles.selectedRow : ''} onClick={() => toggleSelect(u.id)}>
                                    <td>
                                        <div 
                                            className={`${styles.customCheckbox} ${selectedIds.has(u.id) ? styles.checked : ''}`}
                                            onClick={(e) => { e.stopPropagation(); toggleSelect(u.id); }}
                                        >
                                            {selectedIds.has(u.id) && <UserCheck size={14} />}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatar}>
                                                {u.full_name.charAt(0)}
                                            </div>
                                            <div className={styles.userDetails}>
                                                <h4>{u.full_name}</h4>
                                                <p>{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${styles[`role_${u.role.toLowerCase()}`]}`}>
                                            {u.role.toLowerCase()}
                                        </span>
                                    </td>
                                    <td className="text-gray-500 text-sm">
                                        {new Date(u.created_at).toLocaleDateString(locale, { dateStyle: 'medium' })}
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.btnIcon}
                                                onClick={() => openEdit(u)}
                                                title="Modifier le rôle"
                                            >
                                                <UserCog size={18} />
                                            </button>
                                            <button
                                                className={`${styles.btnIcon} ${styles.btnDelete}`}
                                                onClick={() => handleDeleteUser(u.id)}
                                                disabled={isDeleting === u.id}
                                                title="Supprimer l'utilisateur"
                                            >
                                                {isDeleting === u.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <div className={styles.modalOverlay} onClick={() => setEditingUser(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2>Modifier le rôle</h2>
                            <button className={styles.closeBtn} onClick={() => setEditingUser(null)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <p className="mb-4 text-gray-500 text-sm">
                                Sélectionner un nouveau rôle pour <strong>{editingUser.full_name}</strong>.
                            </p>

                            <div className="space-y-2">
                                {['user', 'provider', 'admin'].map(role => (
                                    <div
                                        key={role}
                                        className={`${styles.roleOption} ${editRole === role ? styles.active : ''}`}
                                        onClick={() => setEditRole(role)}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={role}
                                            checked={editRole === role}
                                            readOnly
                                            className={styles.roleRadio}
                                        />
                                        <div>
                                            <span className="block font-semibold capitalize text-gray-900">{role}</span>
                                            <span className="text-xs text-gray-500">
                                                {role === 'admin' && 'Accès complet au dashboard'}
                                                {role === 'provider' && 'Peut publier des annonces'}
                                                {role === 'user' && 'Accès standard'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={styles.saveBtn}
                                onClick={handleUpdateUser}
                                disabled={actionLoading}
                            >
                                {actionLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Enregistrer les modifications'}
                            </button>
                        </div>
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
                                disabled={bulkActionLoading}
                            >
                                {bulkActionLoading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
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
