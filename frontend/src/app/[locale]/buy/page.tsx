'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../../navigation';
import CategoryBar from '@/components/CategoryBar';
import ListingCard from '../../../components/ListingCard';
import { useEffect, useState } from 'react';
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
    const ITEMS_PER_PAGE = 12;
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // Filter states
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    useEffect(() => {
        async function loadData() {
            try {
                const [listingsData, citiesData] = await Promise.all([
                    fetchListings(),
                    fetchCities(true) // activeOnly
                ]);
                const buyItems = listingsData.filter((l: any) => l.type === 'buy');
                setListings(buyItems);
                setFilteredListings(buyItems);
                setCities(citiesData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

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
        setVisibleCount(ITEMS_PER_PAGE);
    }, [listings, selectedCity, selectedPriceRange, availableOnly, searchQuery]);

    const clearFilters = () => {
        setSelectedCity('');
        setSelectedPriceRange(0);
        setAvailableOnly(false);
        setSearchQuery('');
    };

    const loadMore = () => {
        setVisibleCount(prev => prev + ITEMS_PER_PAGE);
    };

    const visibleListings = filteredListings.slice(0, visibleCount);
    const hasMore = visibleCount < filteredListings.length;

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
                    {visibleListings.map((item) => {
                        const city = cities.find(c => c.id === (item as any).city_id);
                        const location = city ? getCityName(city) : (item.city?.name || 'Maroc');

                        // Pass full item with resolved location
                        const enhancedItem = {
                            ...item,
                            location
                        };

                        return (
                            <Link key={item.id} href={routes.listing(item.slug || item.id.toString()) as any} className={styles.cardLink}>
                                <ListingCard item={enhancedItem as any} />
                            </Link>
                        );
                    })}
                </div>

                {filteredListings.length === 0 && (
                    <div className={styles.emptyState}>
                        <p>{t('no_listings_found_filters')}</p>
                        <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                            {t('clear_all_filters')}
                        </button>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && filteredListings.length > 0 && (
                    <div className={styles.loadMoreContainer}>
                        <button className={styles.loadMoreBtn} onClick={loadMore}>
                            {t('show_more')} ({filteredListings.length - visibleCount})
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
