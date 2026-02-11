'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/lib/auth-store';
import { fetchUserListings, updateListing, deleteListing, Listing } from '@/lib/api';
import { Link } from '../../../../navigation';
import { routes } from '@/lib/routes';
import { Plus, Loader2, MoreHorizontal, Eye, Edit2, Pause, Play, Trash2, Package, ChevronDown, Image as ImageIcon } from 'lucide-react';
import styles from './listings.module.css';
import dashStyles from '../dashboard.module.css';

export default function ListingsClient() {
    const { user } = useAuthStore();
    const t = useTranslations('Dashboard');

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | string | null>(null);

    useEffect(() => {
        if (user?.id || (user as any)?.google_id) {
            const userId = user!.id;
            fetchUserListings(userId)
                .then(setListings)
                .finally(() => setLoading(false));
        }
    }, [user]);

    const handleToggleStatus = async (id: number | string, currentStatus: string) => {
        setProcessingId(id);
        // Toggle logic: If active -> paused, If paused -> active
        const newStatus = currentStatus === 'active' ? 'paused' : 'active';

        try {
            const updated = await updateListing(id, { status: newStatus });
            if (updated) {
                setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
            }
        } catch (error) {
            console.error('Failed to toggle status', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: number | string) => {
        if (!confirm('Are you sure you want to delete this listing?')) return;

        setProcessingId(id);
        try {
            await deleteListing(id);
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (error) {
            console.error('Failed to delete listing', error);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.spinner} size={32} />
                <p>Loading your listings...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={dashStyles.dashTitle}>{t('my_fleet')}</h1>
                    <p className={dashStyles.dashSubtitle}>
                        {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.filterDropdown}>
                        <button className={styles.filterBtn}>
                            <span>All listings</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <Link href="/create" className={styles.addBtn}>
                        <Plus size={18} />
                        <span>Add listing</span>
                    </Link>
                </div>
            </div>

            {/* Listings */}
            {listings.length === 0 ? (
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Package size={48} />
                    </div>
                    <h3 className={styles.emptyTitle}>{t('empty_fleet')}</h3>
                    <p className={styles.emptyDesc}>{t('empty_fleet_desc')}</p>
                    <Link href="/create" className={styles.emptyBtn}>
                        <Plus size={20} />
                        {t('add_first_item')}
                    </Link>
                </div>
            ) : (
                <div className={styles.listingsGrid}>
                    {listings.map(item => (
                        <div key={item.id} className={styles.listingCard}>
                            {/* Image */}
                            <div className={styles.cardImage}>
                                {(item.image_hero || item.main_image || item.image) ? (
                                    <img
                                        src={item.image_hero || item.main_image || item.image}
                                        alt={item.title}
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : (
                                    <div className={styles.placeholderBg}>
                                        <ImageIcon size={32} className={styles.placeholderIcon} />
                                    </div>
                                )}
                                {/* Fallback for error state */}
                                <div className={`${styles.placeholderBg} hidden`}>
                                    <ImageIcon size={32} className={styles.placeholderIcon} />
                                </div>
                                <div className={styles.cardStatus}>
                                    {item.status === 'pending' ? (
                                        <span className={`${styles.statusActive} ${styles.statusPending}`}>Pending</span>
                                    ) : item.status === 'rejected' ? (
                                        <span className={`${styles.statusActive} ${styles.statusRejected}`}>Rejected</span>
                                    ) : item.status === 'paused' ? (
                                        <span className={`${styles.statusActive} ${styles.statusPaused}`}>Paused</span>
                                    ) : (
                                        <span className={styles.statusActive}>Active</span>
                                    )}
                                </div>
                                <button className={styles.moreBtn} onClick={() => handleDelete(item.id)}>
                                    <Trash2 size={16} color="red" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>
                                    <Link href={routes.listing(item.slug || item.id.toString()) as any}>
                                        {item.title}
                                    </Link>
                                </h3>
                                <p className={styles.cardLocation}>{item.city?.name || 'Maroc'}</p>
                                <div className={styles.cardMeta}>
                                    <div className="flex flex-col gap-1 w-full">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                            <span className="flex items-center gap-1">
                                                <Eye size={14} />
                                                {item.views || 0} {t('stats.total_views', { defaultMessage: 'Vues' }).split(' ')[0]}
                                            </span>

                                            <span className="flex items-center gap-1 font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                                <span className="text-[10px] uppercase tracking-wide">Dépensé</span>
                                                <span>
                                                    {Math.floor(
                                                        (Math.max(0, new Date().getTime() - new Date(item.published_at || item.created_at).getTime()) / (1000 * 3600 * 24))
                                                        * Number(item.daily_cost || 0)
                                                    ).toLocaleString()} DH
                                                </span>
                                            </span>
                                        </div>

                                        <span className={styles.cardPrice}>
                                            {item.price} DH
                                            <span className={styles.priceUnit}>/{item.price_unit || 'day'}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            {(() => {
                                const isPaused = item.status === 'paused';
                                const isActive = item.status === 'active';
                                const isActionable = isActive || isPaused;

                                return (
                                    <div className={styles.cardActions}>
                                        <Link href={`/tableau-de-bord/annonces/edit/${item.id}` as any} className={styles.actionBtn}>
                                            <Edit2 size={16} />
                                            Edit
                                        </Link>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleToggleStatus(item.id, item.status || 'pending')}
                                            disabled={processingId === item.id || !isActionable}
                                            style={{ opacity: !isActionable ? 0.5 : 1, cursor: !isActionable ? 'not-allowed' : 'pointer' }}
                                            title={!isActionable ? "Can only pause active listings" : ""}
                                        >
                                            {processingId === item.id ? (
                                                <Loader2 size={16} className={styles.spinner} />
                                            ) : isPaused ? (
                                                <>
                                                    <Play size={16} />
                                                    Resume
                                                </>
                                            ) : isActive ? (
                                                <>
                                                    <Pause size={16} />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <Pause size={16} />
                                                    Pause
                                                </>
                                            )}
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    ))}

                    {/* Add New Card */}
                    <Link href="/create" className={styles.addCard}>
                        <div className={styles.addCardIcon}>
                            <Plus size={32} />
                        </div>
                        <span>Add a new listing</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
