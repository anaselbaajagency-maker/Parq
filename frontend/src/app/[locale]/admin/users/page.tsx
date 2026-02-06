'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useLocale } from 'next-intl';
import {
    Users, Plus, ChevronRight, Loader2,
    AlertTriangle, Shield, Search, Trash2, Edit2, UserCog, UserCheck
} from 'lucide-react';
import { API_BASE_URL, fetchAdminUsers, updateAdminUser, deleteAdminUser } from '@/lib/api';
import styles from './users.module.css';

interface User {
    id: string;
    full_name: string;
    email: string;
    role: string;
    created_at: string;
    listings_count?: number;
}

export default function UsersPage() {
    const { user: currentUser } = useAuthStore();
    const router = useRouter();
    const locale = useLocale();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }
        loadUsers();
    }, [currentUser, router]);

    async function loadUsers() {
        try {
            const response = await fetchAdminUsers();
            const userData = response.data || [];
            setUsers(userData);
        } catch (error) {
            console.error('Failed to load users:', error);
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

    const stats = useMemo(() => ({
        total: users.length,
        admins: users.filter(u => u.role === 'ADMIN').length,
        providers: users.filter(u => u.role === 'PROVIDER').length,
    }), [users]);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
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
        } catch (error) {
            console.error('Failed to update user', error);
            alert("Failed to update user role");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        setIsDeleting(id);
        try {
            await deleteAdminUser(id);
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user', error);
            alert("Failed to delete user");
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

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestion des Utilisateurs</h1>
                    <p className={styles.subtitle}>Administrez les accès et rôles de la plateforme</p>
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

            {/* Table */}
            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Identité</th>
                            <th>Rôle</th>
                            <th>Date d'inscription</th>
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
                                <tr key={u.id}>
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
        </div>
    );
}
