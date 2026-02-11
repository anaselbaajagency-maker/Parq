'use client';

import { useEffect, useState } from 'react';
import { Link } from '../../navigation';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';
import heroStyles from './Hero.module.css';
import ListingsCarousel from '../../components/ListingsCarousel';
import { ArrowRight, Key, Tag } from 'lucide-react';
import {
    fetchSettings,
    fetchCategories,
    fetchListingsByCategory,
    fetchHomepageCategories,
    fetchCities,
    Settings,
    Category,
    Listing
} from '@/lib/api';
import { routes } from '@/lib/routes';

export default function HomeClient({ locale }: { locale: string }) {
    const t = useTranslations('HomePage');

    const [settings, setSettings] = useState<Settings | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [listingsByCategory, setListingsByCategory] = useState<Record<string, Listing[]>>({});
    const [orderedCategoryIds, setOrderedCategoryIds] = useState<string[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper for City translation
    const getCityName = (city: any) => {
        if (locale === 'ar' && city.name_ar) return city.name_ar;
        if (locale === 'fr' && city.name_fr) return city.name_fr;
        return city.name;
    };

    useEffect(() => {
        async function loadData() {
            try {
                const [settingsData, categoriesData, citiesData, homepageCats] = await Promise.all([
                    fetchSettings(),
                    fetchCategories(undefined, true),
                    fetchCities(),
                    fetchHomepageCategories()
                ]);

                setSettings(settingsData);
                setCategories(categoriesData);
                setCities(citiesData);

                const categoriesToShow = homepageCats.length > 0
                    ? homepageCats.map((c: any) => c.slug || c.id) // Use slug or id
                    : [];

                // Ensure limit is parsed as integer
                let limit = 6;
                if (settingsData && settingsData.homepage_listings_count) {
                    limit = parseInt(String(settingsData.homepage_listings_count), 10);
                }

                const listingsPromises = categoriesToShow.map((catId: string) =>
                    fetchListingsByCategory(catId, limit).then(listings => ({ catId, listings }))
                );

                const results = await Promise.all(listingsPromises);
                const listingsMap: Record<string, Listing[]> = {};
                results.forEach(({ catId, listings }) => {
                    listingsMap[catId] = listings;
                });

                setListingsByCategory(listingsMap);
                // Store the ordered category IDs to render
                setOrderedCategoryIds(categoriesToShow);
            } catch (error) {
                console.error('Failed to load homepage data:', error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const formatListings = (listings: Listing[]) => {
        if (!Array.isArray(listings)) return [];

        return listings
            .filter(l => l && l.id && l.title) // valid listings only
            .map(l => {
                const city = cities.find((c: any) => c.id === (l as any).city_id);
                const location = city ? getCityName(city) : (l as any).city?.name;

                return {
                    ...l, // Spread all original properties including image_hero
                    location: location,
                    price: `${l.price} ${t('currency_symbol')}`,
                    rating: l.rating || 4.5,
                    tag: undefined,
                };
            });
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
            </div>
        );
    }



    return (
        <div className={styles.container}>
            {/* New Premium Hero Section */}
            <section className={heroStyles.hero}>


                <div className={heroStyles.content}>
                    <div className={heroStyles.label}>
                        <Tag size={14} />
                        <span>{t('hero_tagline')}</span>
                    </div>

                    <h1 className={heroStyles.title}>
                        {locale === 'ar' ? (settings?.hero_title_ar || t('title')) : (settings?.hero_title_fr || t('title'))}{' '}
                        <br />
                        <span className={heroStyles.highlight}>
                            {locale === 'ar' ? (settings?.hero_highlight_ar || t('highlight')) : (settings?.hero_highlight_fr || t('highlight'))}
                        </span>
                    </h1>

                    <p className={heroStyles.subtitle}>
                        {locale === 'ar' ? (settings?.hero_subtitle_ar || t('subtitle')) : (settings?.hero_subtitle_fr || t('subtitle'))}
                    </p>

                    <div className={heroStyles.actions}>
                        <Link href="/rent" className={heroStyles.primaryBtn}>
                            {t('btn_rent')}
                            <ArrowRight size={20} />
                        </Link>
                        <Link href="/buy" className={heroStyles.secondaryBtn}>
                            {t('btn_buy')}
                            <Tag size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {orderedCategoryIds.map(categoryId => {
                const category = categories.find(c => c.id.toString() === categoryId || c.slug === categoryId);
                const listings = listingsByCategory[categoryId] || [];

                // Filter out if category is missing, has no listings, OR is inactive
                if (!category) return null;
                if (listings.length === 0) return null;
                if (category.is_active !== undefined && (Number(category.is_active) === 0 || category.is_active === false)) return null;

                const catType = (category.type as 'rent' | 'buy') || 'rent';
                const viewAllHref = routes.category(catType as any, categoryId);

                // Localized name helper
                const getLocalizedCategoryName = (cat: Category) => {
                    if (locale === 'ar' && cat.name_ar) return cat.name_ar;
                    if (locale === 'fr' && cat.name_fr) return cat.name_fr;
                    return cat.name;
                };

                return (
                    <ListingsCarousel
                        key={categoryId}
                        title={getLocalizedCategoryName(category)}
                        listings={formatListings(listings) as any}
                        viewAllHref={viewAllHref}
                    />
                );
            })}
        </div>
    );
}
