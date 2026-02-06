'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '../../../../navigation';
import {
    Search, Trash2, Eye, Shield, Loader2, Filter,
    CheckCircle2, XCircle, AlertCircle, RefreshCw, MoreVertical,
    Clock, MapPin, TrendingUp, TrendingDown, BarChart3, Package, Users
} from 'lucide-react';
import {
    fetchAdminListings,
    deleteListing,
    approveListing,
    rejectListing,
    hideListing,
    Listing,
    fetchCategories,
    fetchCities,
    Category,
    City
} from '@/lib/api';
import styles from './listings.module.css';
import { routes } from '@/lib/routes';
import ListingThumbnail from './ListingThumbnail';

interface AdminListing extends Listing {
    user_full_name?: string;
    user_email?: string;
}

function useClickOutside(ref: any, handler: any) {
    useEffect(() => {
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}

const ActionMenu = ({ listing, onApprove, onReject, onHide, onUnhide, onDelete, t }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    useClickOutside(menuRef, () => setIsOpen(false));

    return (
        <div className={styles.menuContainer} ref={menuRef} onClick={(e) => e.stopPropagation()}>
            <button
                className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                title={t('actions')}
            >
                <MoreVertical size={20} />
            </button>

            {isOpen && (
                <div className={styles.menuDropdown}>
                    <Link href={routes.listing(listing.slug || listing.id.toString()) as any} target="_blank" className={styles.menuItem}>
                        <Eye size={18} className="text-blue-500" />
                        {t('view')}
                    </Link>

                    {listing.status === 'pending' && (
                        <>
                            <button onClick={() => { setIsOpen(false); onApprove(listing.id); }} className={styles.menuItem}>
                                <CheckCircle2 size={18} className="text-green-600" />
                                {t('approve')}
                            </button>
                            <button onClick={() => { setIsOpen(false); onReject(listing.id); }} className={styles.menuItem}>
                                <XCircle size={18} className="text-red-600" />
                                {t('reject')}
                            </button>
                        </>
                    )}

                    {listing.status === 'rejected' && (
                        <button onClick={() => { setIsOpen(false); onApprove(listing.id); }} className={styles.menuItem}>
                            <RefreshCw size={18} className="text-green-600" />
                            {t('approve')}
                        </button>
                    )}

                    {listing.status === 'active' && (
                        <button onClick={() => { setIsOpen(false); onHide(listing.id); }} className={styles.menuItem}>
                            <Eye size={18} className="text-slate-400" />
                            {t('hide_listing')}
                        </button>
                    )}

                    {(listing.status === 'inactive' || listing.status === 'hidden') && (
                        <button onClick={() => { setIsOpen(false); onUnhide(listing.id); }} className={styles.menuItem}>
                            <Eye size={18} className="text-green-600" />
                            {t('unhide')}
                        </button>
                    )}

                    <div style={{ padding: '4px 0', borderTop: '1px solid #F1F5F9', margin: '4px 0' }}></div>

                    <button
                        onClick={() => { setIsOpen(false); onDelete(listing.id); }}
                        className={`${styles.menuItem} ${styles.danger}`}
                    >
                        <Trash2 size={18} />
                        {t('delete')}
                    </button>
                </div>
            )}
        </div>
    );
};
// Abort this specific replace to fix imports first.


export default function AdminListingsPage() {
    const { user: currentUser } = useAuthStore();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('AdminListings');
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<AdminListing[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);

    // Toast State
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Modal State
    const [selectedListing, setSelectedListing] = useState<AdminListing | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Derived state for unique users
    const uniqueUsers = useMemo(() => {
        const users = new Map();
        listings.forEach(l => {
            if (l.user_id && !users.has(l.user_id)) {
                users.set(l.user_id, {
                    id: l.user_id,
                    name: l.user?.full_name || l.user_full_name || t('unknown_user')
                });
            }
        });
        return Array.from(users.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [listings, t]);

    // Calculate Stats
    const stats = useMemo(() => ({
        total: listings.length,
        active: listings.filter(l => l.status === 'active').length,
        pending: listings.filter(l => l.status === 'pending').length,
        rejected: listings.filter(l => l.status === 'rejected').length
    }), [listings]);

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'ADMIN') {
            router.push('/dashboard');
            return;
        }
        loadData();
    }, [currentUser, router]);

    async function loadData() {
        setLoading(true);
        try {
            const [listingsData, categoriesData, citiesData] = await Promise.all([
                fetchAdminListings(),
                fetchCategories(),
                fetchCities()
            ]);
            setListings(listingsData);
            setCategories(categoriesData);
            setCities(citiesData);
        } catch (error) {
            console.error('Failed to load admin data:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number | string) {
        if (!confirm(t('confirm_delete'))) return;

        try {
            await deleteListing(id);
            setListings(prev => prev.filter(l => String(l.id) !== String(id)));
            showToast(t('success_deleted'));
        } catch (error) {
            console.error('Delete error:', error);
            showToast(t('error_occurred'), 'error');
        }
    }

    async function handleApprove(id: number | string) {
        if (!confirm(t('confirm_approve'))) return;
        try {
            const success = await approveListing(id);
            if (success) {
                setListings(prev => prev.map(l => String(l.id) === String(id) ? { ...l, status: 'active', is_available: true } : l));
                showToast(t('success_approved'));
            } else {
                showToast(t('failed_to_approve'), 'error');
            }
        } catch (error) {
            showToast(t('error_occurred'), 'error');
        }
    }

    async function handleReject(id: number | string) {
        const reason = prompt(t('reject_reason_prompt'), 'Non conforme');
        if (reason === null) return;

        try {
            const success = await rejectListing(id, reason);
            if (success) {
                setListings(prev => prev.map(l => String(l.id) === String(id) ? { ...l, status: 'rejected', is_available: false } : l));
                showToast(t('success_rejected'));
            } else {
                showToast(t('failed_to_reject'), 'error');
            }
        } catch (error) {
            showToast(t('error_occurred'), 'error');
        }
    }

    async function handleHide(id: number | string) {
        if (!confirm(t('confirm_hide'))) return;
        try {
            const success = await hideListing(id);
            if (success) {
                setListings(prev => prev.map(l => String(l.id) === String(id) ? { ...l, status: 'hidden', is_available: false } : l));
                showToast(t('success_hidden'));
            } else {
                showToast(t('failed_to_hide'), 'error');
            }
        } catch (error) {
            showToast(t('error_occurred'), 'error');
        }
    }

    async function handleUnhide(id: number | string) {
        if (!confirm(t('confirm_unhide'))) return;
        try {
            const success = await approveListing(id);
            if (success) {
                setListings(prev => prev.map(l => String(l.id) === String(id) ? { ...l, status: 'active', is_available: true } : l));
                showToast(t('success_unhidden'));
            } else {
                showToast(t('failed_to_unhide'), 'error');
            }
        } catch (error) {
            showToast(t('error_occurred'), 'error');
        }
    }

    const filteredListings = listings.filter(l => {
        const matchesSearch =
            l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (l.user?.full_name && l.user.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (l.user_full_name && l.user_full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (l.id && String(l.id).includes(searchQuery));

        const matchesCategory = selectedCategory ? String(l.category_id) === selectedCategory : true;
        const matchesCity = selectedCity ? String(l.city_id) === selectedCity : true;
        const matchesStatus = selectedStatus ? l.status === selectedStatus : true;

        let matchesDate = true;
        if (dateFrom || dateTo) {
            const created = new Date(l.created_at || '');
            if (dateFrom && new Date(dateFrom) > created) matchesDate = false;
            if (dateTo) {
                const end = new Date(dateTo);
                end.setHours(23, 59, 59);
                if (end < created) matchesDate = false;
            }
        }

        const matchesUser = selectedUser ? String(l.user_id) === selectedUser : true;

        return matchesSearch && matchesCategory && matchesCity && matchesStatus && matchesDate && matchesUser;
    });

    const visibleListings = filteredListings.slice(0, visibleCount);
    const hasMore = visibleCount < filteredListings.length;

    // Helper to get localized name
    const getLocalizedName = (item: any) => {
        if (!item) return '';
        if (locale === 'ar' && item.name_ar) return item.name_ar;
        if (locale === 'fr' && item.name_fr) return item.name_fr;
        return item.name;
    };

    // Helper to safe-parse image
    const getMainImage = (listing: AdminListing) => {
        if (listing.image_hero) return listing.image_hero;
        if (listing.main_image) return listing.main_image;
        if (listing.image) {
            if (listing.image.startsWith('[')) {
                try {
                    const parsed = JSON.parse(listing.image);
                    return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
                } catch (e) {
                    return null;
                }
            }
            return listing.image;
        }
        if (Array.isArray(listing.images) && listing.images.length > 0) {
            return listing.images[0].image_path;
        }
        return null;
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.spinner} size={40} />
                <p>{t('loading_listings')}</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('title')}</h1>
                    <p className={styles.subtitle}>{t('subtitle')}</p>
                </div>
            </header>

            {/* Analytics Grid */}
            <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                    <div className={styles.analyticsCardHeader}>
                        <div className={`${styles.analyticsIconWrapper} ${styles.analyticsIconTotal}`}>
                            <Package size={24} />
                        </div>
                        <div className={`${styles.analyticsTrend} ${styles.trendUp}`}>
                            <TrendingUp size={12} />
                            +12%
                        </div>
                    </div>
                    <div className={styles.analyticsValue}>{stats.total}</div>
                    <div className={styles.analyticsLabel}>Total Annonces</div>
                </div>

                <div className={styles.analyticsCard}>
                    <div className={styles.analyticsCardHeader}>
                        <div className={`${styles.analyticsIconWrapper} ${styles.analyticsIconActive}`}>
                            <CheckCircle2 size={24} />
                        </div>
                        <div className={`${styles.analyticsTrend} ${styles.trendUp}`}>
                            <TrendingUp size={12} />
                            +8%
                        </div>
                    </div>
                    <div className={styles.analyticsValue}>{stats.active}</div>
                    <div className={styles.analyticsLabel}>Actives</div>
                </div>

                <div className={styles.analyticsCard}>
                    <div className={styles.analyticsCardHeader}>
                        <div className={`${styles.analyticsIconWrapper} ${styles.analyticsIconPending}`}>
                            <Clock size={24} />
                        </div>
                    </div>
                    <div className={styles.analyticsValue}>{stats.pending}</div>
                    <div className={styles.analyticsLabel}>En Attente</div>
                </div>

                <div className={styles.analyticsCard}>
                    <div className={styles.analyticsCardHeader}>
                        <div className={`${styles.analyticsIconWrapper} ${styles.analyticsIconRejected}`}>
                            <XCircle size={24} />
                        </div>
                    </div>
                    <div className={styles.analyticsValue}>{stats.rejected}</div>
                    <div className={styles.analyticsLabel}>Rejetées</div>
                </div>
            </div>

            {/* Filter Controls */}
            <div className={styles.controls}>
                <div className={styles.filtersRow}>
                    <div className={styles.searchBar}>
                        <Search className={styles.searchIcon} size={18} />
                        <input
                            className={styles.searchInput}
                            type="text"
                            placeholder={t('search_placeholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        className={styles.selectInput}
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="">{t('all_statuses')}</option>
                        <option value="pending">{t('pending')}</option>
                        <option value="active">{t('active')}</option>
                        <option value="hidden">{t('inactive')}</option>
                        <option value="rejected">{t('rejected')}</option>
                    </select>

                    <select
                        className={styles.selectInput}
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">{t('all_categories')}</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {getLocalizedName(cat)}
                            </option>
                        ))}
                    </select>

                    <select
                        className={styles.selectInput}
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    >
                        <option value="">{t('all_cities')}</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.id}>
                                {getLocalizedName(city)}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => { setSearchQuery(''); setSelectedCategory(''); setSelectedCity(''); setSelectedStatus(''); setSelectedUser(''); setDateFrom(''); setDateTo(''); }}
                        className={styles.resetBtn}
                    >
                        <Filter size={16} />
                        {t('reset_filters')}
                    </button>
                </div>
            </div>

            {/* Listings Card Grid */}
            <div className={styles.listingsGrid}>
                {visibleListings.map((listing) => {
                    const categoryName = categories.find(c => c.id === listing.category_id)?.name || '';
                    const cityName = cities.find(c => c.id === listing.city_id)?.name || '';

                    return (
                        <div
                            key={listing.id}
                            className={styles.listingCard}
                            onClick={() => { setSelectedListing(listing); setIsModalOpen(true); }}
                            style={{ cursor: 'pointer' }}
                        >
                            {/* Status Badge */}
                            {listing.status === 'active' && (
                                <span className={`${styles.cardBadge} ${styles.cardBadgeActive}`}>
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                    ACTIF
                                </span>
                            )}
                            {listing.status === 'pending' && (
                                <span className={`${styles.cardBadge} ${styles.cardBadgePending}`}>
                                    <Clock size={10} />
                                    EN ATTENTE
                                </span>
                            )}
                            {listing.status === 'rejected' && (
                                <span className={`${styles.cardBadge} ${styles.cardBadgeRejected}`}>
                                    <XCircle size={10} />
                                    REJETÉ
                                </span>
                            )}
                            {(listing.status === 'inactive' || listing.status === 'hidden') && (
                                <span className={`${styles.cardBadge} ${styles.cardBadgeInactive}`}>
                                    INACTIF
                                </span>
                            )}

                            {/* Type Badge */}
                            <span className={`${styles.cardTypeBadge} ${listing.type === 'rent' ? styles.cardTypeRent : styles.cardTypeBuy}`}>
                                {listing.type === 'rent' ? 'LOCATION' : 'ACHAT'}
                            </span>

                            {/* Card Image */}
                            <ListingThumbnail
                                src={getMainImage(listing)}
                                alt={listing.title}
                                className={styles.listingCardImage}
                            />

                            {/* Card Body */}
                            <div className={styles.listingCardBody}>
                                <div className={styles.listingCardTitle}>{listing.title}</div>
                                <div className={styles.listingCardLocation}>
                                    <MapPin size={12} />
                                    {cityName} • {categoryName}
                                </div>

                                <div className={styles.listingCardPrice}>
                                    <span className={styles.listingCardPriceValue}>
                                        {new Intl.NumberFormat('fr-FR').format(listing.price)}
                                    </span>
                                    <span className={styles.listingCardPriceUnit}>DH {listing.price_unit?.replace('DH', '').trim()}</span>
                                </div>

                                <div className={styles.listingCardMeta}>
                                    <div className={styles.listingCardUser}>
                                        <div className={styles.listingCardUserAvatar}>
                                            {(listing.user?.full_name || listing.user_full_name || '?').charAt(0)}
                                        </div>
                                        <span className={styles.listingCardUserName}>
                                            {listing.user?.full_name || listing.user_full_name || t('unknown_user')}
                                        </span>
                                    </div>
                                    <div className={styles.listingCardDate}>
                                        <Clock size={12} />
                                        {new Date(listing.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'ar-MA')}
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className={styles.listingCardFooter}>
                                <div className={styles.listingCardStatus}>
                                    ID: #{listing.id}
                                </div>
                                <div className={styles.listingCardActions}>
                                    <ActionMenu
                                        listing={listing}
                                        onApprove={handleApprove}
                                        onReject={handleReject}
                                        onHide={handleHide}
                                        onUnhide={handleUnhide}
                                        onDelete={handleDelete}
                                        t={t}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {visibleListings.length === 0 && (
                <div className={styles.emptyState}>
                    <Package size={48} className={styles.emptyStateIcon} />
                    <p className={styles.emptyStateText}>Aucune annonce trouvée.</p>
                </div>
            )}

            {hasMore && (
                <div className={styles.pagination}>
                    <button onClick={() => setVisibleCount(prev => prev + 20)} className={styles.paginationBtn}>
                        Charger plus...
                    </button>
                </div>
            )}

            {/* Status Change Modal */}
            {isModalOpen && selectedListing && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Modifier le Statut</h2>
                            <button
                                className={styles.modalCloseBtn}
                                onClick={() => setIsModalOpen(false)}
                            >
                                <XCircle size={18} />
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <div className={styles.modalListingInfo}>
                                <ListingThumbnail
                                    src={getMainImage(selectedListing)}
                                    alt={selectedListing.title}
                                    className={styles.modalListingImage}
                                />
                                <div>
                                    <div className={styles.modalListingTitle}>{selectedListing.title}</div>
                                    <div className={styles.modalListingId}>ID: #{selectedListing.id}</div>
                                </div>
                            </div>

                            <div className={styles.modalStatusLabel}>Choisir un nouveau statut:</div>
                            <div className={styles.modalStatusGrid}>
                                <button
                                    className={`${styles.modalStatusBtn} ${styles.modalStatusBtnActive}`}
                                    onClick={() => {
                                        handleApprove(selectedListing.id);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <div className={`${styles.modalStatusIcon} ${styles.modalStatusIconActive}`}>
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <span className={styles.modalStatusText}>Actif</span>
                                </button>

                                <button
                                    className={`${styles.modalStatusBtn} ${styles.modalStatusBtnPending}`}
                                    onClick={() => {
                                        // For pending, we typically don't set this manually
                                        showToast('Statut "En attente" réservé aux nouvelles annonces', 'error');
                                    }}
                                >
                                    <div className={`${styles.modalStatusIcon} ${styles.modalStatusIconPending}`}>
                                        <Clock size={18} />
                                    </div>
                                    <span className={styles.modalStatusText}>En Attente</span>
                                </button>

                                <button
                                    className={`${styles.modalStatusBtn} ${styles.modalStatusBtnRejected}`}
                                    onClick={() => {
                                        handleReject(selectedListing.id);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <div className={`${styles.modalStatusIcon} ${styles.modalStatusIconRejected}`}>
                                        <XCircle size={18} />
                                    </div>
                                    <span className={styles.modalStatusText}>Rejeté</span>
                                </button>

                                <button
                                    className={`${styles.modalStatusBtn} ${styles.modalStatusBtnInactive}`}
                                    onClick={() => {
                                        handleHide(selectedListing.id);
                                        setIsModalOpen(false);
                                    }}
                                >
                                    <div className={`${styles.modalStatusIcon} ${styles.modalStatusIconInactive}`}>
                                        <Eye size={18} />
                                    </div>
                                    <span className={styles.modalStatusText}>Inactif</span>
                                </button>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className={styles.modalCancelBtn}
                                onClick={() => setIsModalOpen(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    padding: '1rem 2rem',
                    borderRadius: '12px',
                    background: toast.type === 'success' ? '#10B981' : '#EF4444',
                    color: 'white',
                    fontWeight: '700',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                        {toast.message}
                    </div>
                </div>
            )}
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
