'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Category } from '@/lib/api';
import CategoryBar from '../../../../components/CategoryBar';
import ListingCard from '../../../../components/ListingCard';
import { Link } from '../../../../navigation';
import { ArrowLeft, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { fetchListingsByCategory, Listing as ApiListing, fetchCities, City, fetchCategories } from '@/lib/api';
import { routes } from '@/lib/routes';
import styles from './categoryPage.module.css';

interface Props {
    categoryId: string; // This acts as the category slug or ID
    citySlug?: string;
    category?: Category;
}

export default function RentCategoryClient({ categoryId, citySlug, category }: Props) {
    const tHome = useTranslations('HomePage');
    const locale = useLocale();

    // Price ranges for rent
    const priceRanges = [
        { label: tHome('all_prices'), min: 0, max: Infinity },
        { label: '0 - 500 DH', min: 0, max: 500 },
        { label: '500 - 1,000 DH', min: 500, max: 1000 },
        { label: '1,000 - 2,000 DH', min: 1000, max: 2000 },
        { label: '2,000 - 5,000 DH', min: 2000, max: 5000 },
        { label: '5,000+ DH', min: 5000, max: Infinity },
    ];

    const [listings, setListings] = useState<ApiListing[]>([]);
    const [filteredListings, setFilteredListings] = useState<ApiListing[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [availableOnly, setAvailableOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);

    const getCityName = (city: City) => {
        if (locale === 'ar' && city.name_ar) return city.name_ar;
        if (locale === 'fr' && city.name_fr) return city.name_fr;
        return city.name;
    };

    const formatPriceLabel = (range: { label: string, min: number, max: number }) => {
        if (range.label === 'all_prices' || range.label === 'HomePage.all_prices') return tHome('all_prices');
        return range.label;
    };

    const [currentCategory, setCurrentCategory] = useState<Category | null>(category || null);

    useEffect(() => {
        async function loadData() {
            try {
                const promises: Promise<any>[] = [
                    fetchListingsByCategory(categoryId, 50, citySlug),
                    fetchCities()
                ];

                if (!currentCategory) {
                    promises.push(fetchCategories('rent'));
                }

                const results = await Promise.all(promises);
                const categoryListings = results[0];
                const citiesData = results[1];

                if (!currentCategory && results[2]) {
                    const cats = results[2] as Category[];
                    const found = cats.find(c => c.slug === categoryId);
                    if (found) setCurrentCategory(found);
                }

                // Filter for 'rent' type just in case
                setListings(categoryListings);
                setFilteredListings(categoryListings);
                setCities(citiesData);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [categoryId, citySlug, currentCategory]);

    const getCategoryName = (cat: Category | null | undefined) => {
        if (!cat) return '';
        if (locale === 'ar' && cat.name_ar) return cat.name_ar;
        if (locale === 'fr' && cat.name_fr) return cat.name_fr;
        return cat.name;
    };

    // Apply filters
    useEffect(() => {
        let result = [...listings];
        let count = 0;

        if (searchQuery) {
            result = result.filter(l => l.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        if (selectedCity) {
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
            {/* Header Section (Static Back Link) */}
            {/* Header Section (Static Back Link) - Hidden
            <div className={styles.headerSection}>
                <Link href={routes.rent()} className={styles.backLink}>
                    <ArrowLeft size={20} strokeWidth={1.5} />
                    <span>Back to all categories</span>
                </Link>
            </div>
            */}

            {/* Sticky Header with Title, CategoryBar, and Filters */}
            <div className={styles.stickyHeader}>
                {/* Page Title */}
                <div className={styles.pageTitle}>
                    <h1>{currentCategory ? getCategoryName(currentCategory) : '...'}</h1>
                    <p>{(currentCategory?.description) || (currentCategory ? getCategoryName(currentCategory) : '')}</p>
                </div>

                {/* Category Bar */}
                <CategoryBar type="rent" />

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
                            placeholder={tHome('search_placeholder')}
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
                                <option value="">{tHome('all_cities')}</option>
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
                                    <option key={idx} value={idx}>{formatPriceLabel(range)}</option>
                                ))}
                            </select>
                            <ChevronDown size={14} className={styles.selectIcon} />
                        </div>

                        {/* Availability Toggle */}
                        <button
                            className={`${styles.filterPill} ${availableOnly ? styles.active : ''}`}
                            onClick={() => setAvailableOnly(!availableOnly)}
                        >
                            {tHome('available_now')}
                        </button>
                    </div>

                    {/* Filters Button (Mobile/Advanced) */}
                    <button
                        className={`${styles.filtersButton} ${activeFiltersCount > 0 ? styles.active : ''}`}
                        onClick={() => setShowFilters(true)}
                    >
                        <SlidersHorizontal size={16} strokeWidth={2} />
                        <span>{tHome('filters')}</span>
                        {activeFiltersCount > 0 && (
                            <span className={styles.filterBadge}>{activeFiltersCount}</span>
                        )}
                    </button>
                </div>

                {/* Results Count */}
                <p className={styles.resultsCount}>
                    {tHome('machines_available', { count: filteredListings.length })}
                    {activeFiltersCount > 0 && (
                        <button className={styles.clearFilters} onClick={clearFilters}>
                            {tHome('clear_filters')}
                        </button>
                    )}
                </p>
            </div>

            {/* Listings Grid */}
            <div className={styles.listingsSection}>
                <div className={styles.listingsGrid}>
                    {filteredListings.map((item) => {
                        const city = cities.find(c => c.id === (item as any).city_id);
                        const location = city ? getCityName(city) : (item as any).city?.name;


                        // Pass full item with resolved location
                        const enhancedItem = {
                            ...item,
                            location: location || ''
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
                        <p>{tHome('no_listings_found_filters')}</p>
                        <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                            {tHome('clear_all')}
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
                            <h2>{tHome('filters')}</h2>
                            <button className={styles.closeBtn} onClick={() => setShowFilters(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className={styles.filterModalBody}>
                            {/* City Section */}
                            <div className={styles.filterSection}>
                                <h3>{tHome('location')}</h3>
                                <div className={styles.filterOptions}>
                                    <label className={styles.radioLabel}>
                                        <input
                                            type="radio"
                                            name="city"
                                            checked={selectedCity === ''}
                                            onChange={() => setSelectedCity('')}
                                        />
                                        <span>{tHome('all_cities')}</span>
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

                            {/* Price Section */}
                            <div className={styles.filterSection}>
                                <h3>{tHome('price_per_day')}</h3>
                                <div className={styles.filterOptions}>
                                    {priceRanges.map((range, idx) => (
                                        <label key={idx} className={styles.radioLabel}>
                                            <input
                                                type="radio"
                                                name="price"
                                                checked={selectedPriceRange === idx}
                                                onChange={() => setSelectedPriceRange(idx)}
                                            />
                                            <span>{formatPriceLabel(range)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Availability Section */}
                            <div className={styles.filterSection}>
                                <h3>{tHome('availability')}</h3>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={availableOnly}
                                        onChange={(e) => setAvailableOnly(e.target.checked)}
                                    />
                                    <span>{tHome('available_now')}</span>
                                </label>
                            </div>
                        </div>

                        <div className={styles.filterModalFooter}>
                            <button className={styles.clearBtn} onClick={clearFilters}>
                                {tHome('clear_all')}
                            </button>
                            <button className={styles.applyBtn} onClick={() => setShowFilters(false)}>
                                {tHome('show_results', { count: filteredListings.length })}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
