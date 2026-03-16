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
import Image from 'next/image';

export default function ListingsClient() {
    const { user } = useAuthStore();
    const t = useTranslations('Dashboard');

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | string | null>(null);
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

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
        if (!confirm(t('listings_page.delete_confirm'))) return;

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

    const getImageUrl = (item: Listing): string | null => {
        if ((item as any).image_hero) return (item as any).image_hero;
        if ((item as any).main_image) return (item as any).main_image;
        if ((item as any).image) return (item as any).image;
        if ((item as any).images && Array.isArray((item as any).images) && (item as any).images.length > 0) {
            const first = (item as any).images[0];
            if (typeof first === 'string') return first;
            if (typeof first === 'object' && first.image_path) return first.image_path;
        }

        return null;
    };

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h1 className={dashStyles.dashTitle}>
                        {t('my_fleet')}
                        <span className={dashStyles.countBadge}>{listings.length}</span>
                    </h1>
                    <p className={dashStyles.dashSubtitle}>
                        {t('manage_fleet')}
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <div className={styles.filterDropdown}>
                        <button className={styles.filterBtn}>
                            <span>{t('listings_page.all_listings')}</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>
                    <Link href="/create" className={styles.addBtn}>
                        <Plus size={18} />
                        <span>{t('listings_page.add_listing')}</span>
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
                                {getImageUrl(item) && !imageErrors[String(item.id)] ? (
                                    <Image
                                        src={getImageUrl(item)!}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        className={styles.cardImageElement}
                                        onError={() => setImageErrors(prev => ({ ...prev, [String(item.id)]: true }))}
                                    />
                                ) : (
                                    <div className={styles.placeholderBg}>
                                        <ImageIcon size={32} className={styles.placeholderIcon} />
                                    </div>
                                )}
                                <div className={styles.placeholderBgHidden} aria-hidden="true">
                                    <ImageIcon size={32} className={styles.placeholderIcon} />
                                </div>
                                <div className={styles.cardStatus}>
                                    {item.status === 'pending' ? (
                                        <span className={`${styles.statusActive} ${styles.statusPending}`}>{t('listings_page.pending')}</span>
                                    ) : item.status === 'rejected' ? (
                                        <span className={`${styles.statusActive} ${styles.statusRejected}`}>{t('listings_page.rejected')}</span>
                                    ) : item.status === 'paused' ? (
                                        <span className={`${styles.statusActive} ${styles.statusPaused}`}>{t('listings_page.paused')}</span>
                                    ) : (
                                        <span className={styles.statusActive}>{t('listings_page.active')}</span>
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
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className={styles.statsRow}>
                                            <span className={styles.statItem} title={t('stats.total_views', { defaultMessage: 'Total Views' })}>
                                                <Eye size={14} className={styles.statIcon} />
                                                {item.views || 0}
                                            </span>

                                            <span className={styles.spentBadge} title={t('listings_page.spent', { defaultMessage: 'Total Spent' })}>
                                                <span className={styles.spentLabel}>{t('listings_page.spent')}</span>
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
                                            {t('listings_page.edit')}
                                        </Link>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleToggleStatus(item.id, item.status || 'pending')}
                                            disabled={processingId === item.id || !isActionable}
                                            style={{ opacity: !isActionable ? 0.5 : 1, cursor: !isActionable ? 'not-allowed' : 'pointer' }}
                                            title={!isActionable ? t('listings_page.pause_tooltip') : ""}
                                        >
                                            {processingId === item.id ? (
                                                <Loader2 size={16} className={styles.spinner} />
                                            ) : isPaused ? (
                                                <>
                                                    <Play size={16} />
                                                    {t('listings_page.resume')}
                                                </>
                                            ) : isActive ? (
                                                <>
                                                    <Pause size={16} />
                                                    {t('listings_page.pause')}
                                                </>
                                            ) : (
                                                <>
                                                    <Pause size={16} />
                                                    {t('listings_page.pause')}
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
                        <span>{t('listings_page.add_new_listing')}</span>
                    </Link>
                </div>
            )}
        </div>
    );
}
