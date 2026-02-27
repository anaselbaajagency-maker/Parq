'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../../navigation';
import CategoryBar from '@/components/CategoryBar';
import ListingCard from '../../../components/ListingCard';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { fetchListings, fetchCities, Listing as ApiListing, City } from '@/lib/api';
import { routes } from '@/lib/routes';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import styles from './buy.module.css';
import { useLocale } from 'next-intl';

export default function BuyPage() {
    const params = useParams();
    const locale = params.locale as string;
    const t = useTranslations('HomePage');
    const lang = useLocale();

    // Price ranges for buy (higher amounts)
    const priceRanges = [
        { label: t('all_prices'), min: 0, max: Infinity },
        { label: '0 - 100,000 DH', min: 0, max: 100000 },
        { label: '100,000 - 500,000 DH', min: 100000, max: 500000 },
        { label: '500,000 - 1,000,000 DH', min: 500000, max: 1000000 },
        { label: '1,000,000 - 5,000,000 DH', min: 1000000, max: 5000000 },
        { label: '5,000,000+ DH', min: 5000000, max: Infinity },
    ];

    const [listings, setListings] = useState<ApiListing[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [filteredListings, setFilteredListings] = useState<ApiListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const ITEMS_PER_PAGE = 20;
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    // Filter states
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch listings filtered by type=buy
                const promises: Promise<any>[] = [
                    fetchListings({ type: 'buy', limit: ITEMS_PER_PAGE, page: 1 }),
                    fetchCities(true) // activeOnly
                ];
                const [listingsData, citiesData] = await Promise.all(promises);
                const buyItems = Array.isArray(listingsData) ? listingsData : (listingsData?.data || []);
                setListings(buyItems);
                setFilteredListings(buyItems);
                setCities(citiesData);
                setPage(1);
                setHasMore(buyItems.length >= ITEMS_PER_PAGE);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const nextPage = page + 1;
            const listingsData: any = await fetchListings({ type: 'buy', limit: ITEMS_PER_PAGE, page: nextPage });
            const newListings: ApiListing[] = Array.isArray(listingsData) ? listingsData : (listingsData?.data || []);

            if (newListings && newListings.length > 0) {
                setListings(prev => {
                    const existingIds = new Set(prev.map(l => l.id));
                    const uniqueNew = newListings.filter(l => !existingIds.has(l.id));
                    return [...prev, ...uniqueNew];
                });
                setPage(nextPage);
                setHasMore(newListings.length >= ITEMS_PER_PAGE);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingMore(false);
        }
    };

    const loadMoreRef = useRef(loadMore);
    useEffect(() => {
        loadMoreRef.current = loadMore;
    }, [loadMore]);

    const observer = useRef<IntersectionObserver | null>(null);
    const lastElementRef = useCallback((node: HTMLAnchorElement | null) => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMoreRef.current();
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    const getCityName = (city: City) => {
        if (lang === 'ar' && city.name_ar) return city.name_ar;
        if (lang === 'fr' && city.name_fr) return city.name_fr;
        return city.name;
    };

    // Apply filters
    useEffect(() => {
        let result = [...listings];
        let count = 0;

        // Filter by search query
        if (searchQuery) {
            result = result.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (selectedCity) {
            // Using loose match for now for safety.
            result = result.filter((l: any) => String(l.city_id) === selectedCity || String(l.city?.id) === selectedCity || l.location === selectedCity);
            count++;
        }

        if (selectedPriceRange > 0) {
            const range = priceRanges[selectedPriceRange];
            result = result.filter(l => l.price >= range.min && l.price < range.max);
            count++;
        }

        if (availableOnly) {
            result = result.filter(l => l.is_available);
            count++;
        }

        setFilteredListings(result);
        setActiveFiltersCount(count);
    }, [listings, selectedCity, selectedPriceRange, availableOnly, searchQuery]);

    const clearFilters = () => {
        setSelectedCity('');
        setSelectedPriceRange(0);
        setAvailableOnly(false);
        setSearchQuery('');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Sticky Header */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    {/* Page Title */}
                    <div className={styles.pageTitle}>
                        <h1>{t('buy_page_title')}</h1>
                        <p>{t('buy_page_subtitle')}</p>
                    </div>

                    {/* Category Bar */}
                    <CategoryBar type="buy" />

                    {/* Filter Bar */}
                    <div className={styles.filterBar}>
                        {/* Search Input */}
                        <div className={styles.searchWrapper}>
                            <div className={styles.searchIconWrapper}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder={t('search_placeholder')}
                                className={styles.searchInput}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className={styles.filterPills}>
                            {/* City Filter */}
                            <div className={styles.filterDropdown}>
                                <select
                                    className={`${styles.filterSelect} ${selectedCity ? styles.active : ''}`}
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                >
                                    <option value="">{t('all_cities')}</option>
                                    {cities.map(city => (
                                        <option key={city.id} value={city.id}>{getCityName(city)}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className={styles.selectIcon} />
                            </div>

                            {/* Price Filter */}
                            <div className={styles.filterDropdown}>
                                <select
                                    className={`${styles.filterSelect} ${selectedPriceRange > 0 ? styles.active : ''}`}
                                    value={selectedPriceRange}
                                    onChange={(e) => setSelectedPriceRange(Number(e.target.value))}
                                >
                                    {priceRanges.map((range, idx) => (
                                        <option key={idx} value={idx}>{range.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className={styles.selectIcon} />
                            </div>

                            {/* Availability Toggle */}
                            <button
                                className={`${styles.filterPill} ${availableOnly ? styles.active : ''}`}
                                onClick={() => setAvailableOnly(!availableOnly)}
                            >
                                {t('available_now')}
                            </button>
                        </div>

                        {/* Filters Button */}
                        <button
                            className={`${styles.filtersButton} ${activeFiltersCount > 0 ? styles.active : ''}`}
                            onClick={() => setShowFilters(true)}
                        >
                            <SlidersHorizontal size={16} strokeWidth={2} />
                            <span>{t('filters')}</span>
                            {activeFiltersCount > 0 && (
                                <span className={styles.filterBadge}>{activeFiltersCount}</span>
                            )}
                        </button>
                    </div>

                    {/* Results Count */}
                    <p className={styles.resultsCount}>
                        {t('machines_available', { count: filteredListings.length })}
                        {activeFiltersCount > 0 && (
                            <button className={styles.clearFilters} onClick={clearFilters}>
                                {t('clear_filters')}
                            </button>
                        )}
                    </p>
                </div>
            </div>

            {/* Listings Grid */}
            <div className={styles.listingsSection}>
                <div className={styles.listingsGrid}>
                    {filteredListings.map((item, index) => {
                        const city = cities.find(c => c.id === (item as any).city_id);
                        const location = city ? getCityName(city) : (item.city?.name || 'Maroc');

                        // Pass full item with resolved location
                        const enhancedItem = {
                            ...item,
                            location
                        };

                        const isLast = index === filteredListings.length - 1;

                        return (
                            <Link
                                ref={isLast ? (lastElementRef as any) : undefined}
                                key={item.id}
                                href={routes.listing(item.slug || item.id.toString()) as any}
                                className={styles.cardLink}
                            >
                                <ListingCard item={enhancedItem as any} />
                            </Link>
                        );
                    })}
                </div>

                {loadingMore && (
                    <div style={{ textAlign: 'center', padding: '2rem 0', gridColumn: '1 / -1' }}>
                        <div className={styles.loadingSpinner} style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: '#FF385C', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    </div>
                )}

                {filteredListings.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>{t('no_listings_found_filters')}</p>
                        <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                            {t('clear_all_filters')}
                        </button>
                    </div>
                )}
            </div>

            {/* Filter Modal */}
            {showFilters && (
                <div className={styles.filterModal}>
                    <div className={styles.filterModalBackdrop} onClick={() => setShowFilters(false)} />
                    <div className={styles.filterModalContent}>
                        <div className={styles.filterModalHeader}>
                            <h2>{t('filters')}</h2>
                            <button className={styles.closeBtn} onClick={() => setShowFilters(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.filterModalBody}>
                            <div className={styles.filterSection}>
                                <h3>{t('location')}</h3>
                                <div className={styles.filterOptions}>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="city"
                                            checked={selectedCity === ''}
                                            onChange={() => setSelectedCity('')}
                                        />
                                        <span>{t('all_cities')}</span>
                                    </label>
                                    {cities.map(city => (
                                        <label key={city.id} className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="city"
                                                checked={selectedCity === city.id.toString()}
                                                onChange={() => setSelectedCity(city.id.toString())}
                                            />
                                            <span>{getCityName(city)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <h3>{t('price_per_day')}</h3>
                                <div className={styles.filterOptions}>
                                    {priceRanges.map((range, idx) => (
                                        <label key={idx} className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="price"
                                                checked={selectedPriceRange === idx}
                                                onChange={() => setSelectedPriceRange(idx)}
                                            />
                                            <span>{range.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.filterSection}>
                                <h3>{t('availability')}</h3>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={availableOnly}
                                        onChange={(e) => setAvailableOnly(e.target.checked)}
                                    />
                                    <span>{t('available_now')}</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.filterModalFooter}>
                            <button className={styles.clearBtn} onClick={clearFilters}>
                                {t('clear_all')}
                            </button>
                            <button className={styles.applyBtn} onClick={() => setShowFilters(false)}>
                                {t('show_results', { count: filteredListings.length })}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
