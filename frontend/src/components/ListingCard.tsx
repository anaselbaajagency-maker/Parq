"use client";

import { useState } from 'react';
import { Star, Heart, ImageOff } from 'lucide-react';
import styles from './ListingCard.module.css';
import { useTranslations, useLocale } from 'next-intl';
import { Listing } from '@/types/listing';
import { useRouter } from 'next/navigation';
import { useFavorite } from '@/hooks/useFavorite';

export default function ListingCard({ item }: { item: Listing }) {
    const t = useTranslations('Header');
    const locale = useLocale();
    const [hasError, setHasError] = useState(false);

    // Initialize with is_favorited from item if available
    const { isFavorited, toggleFavorite } = useFavorite(item.id, item.is_favorited);

    // Derived display values
    const displayImage = item.image_hero || item.main_image || (item.images && item.images.length > 0 ? item.images[0].image_path : null);
    const displayPrice = `${item.price}`;

    const getCategoryName = () => {
        if (!item.category) return undefined;
        if (locale === 'ar' && item.category.name_ar) return item.category.name_ar;
        if (locale === 'fr' && item.category.name_fr) return item.category.name_fr;
        return item.category.name;
    };
    const tag = getCategoryName();

    // Get localized title
    const getLocalizedTitle = () => {
        if (locale === 'ar' && item.title_ar) return item.title_ar;
        if (locale === 'fr' && item.title_fr) return item.title_fr;
        return item.title;
    };
    const displayTitle = getLocalizedTitle();

    // Get localized city name
    const getLocalizedCity = () => {
        if (!item.city) return null;
        if (locale === 'ar' && item.city.name_ar) return item.city.name_ar;
        if (locale === 'fr' && item.city.name_fr) return item.city.name_fr;
        return item.city.name;
    };

    return (
        <article className={styles.card}>
            {/* Image Section */}
            <div className={styles.imageWrapper}>
                {!hasError && displayImage ? (
                    <img
                        src={displayImage}
                        alt={displayTitle}
                        className={styles.image}
                        onError={() => setHasError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className={styles.placeholder}>
                        <ImageOff size={40} strokeWidth={1.5} />
                    </div>
                )}

                {/* Favorite Button */}
                <button
                    className={styles.favoriteBtn}
                    onClick={(e) => {
                        e.preventDefault(); // Prevent link navigation
                        e.stopPropagation();
                        toggleFavorite();
                    }}
                >
                    <Heart
                        size={22}
                        strokeWidth={2}
                        fill={isFavorited ? '#FF385C' : 'rgba(0,0,0,0.5)'}
                        color={isFavorited ? '#FF385C' : 'white'}
                    />
                </button>

                {/* Tag */}
                {tag && <span className={styles.tag}>{tag}</span>}
            </div>

            {/* Content Section */}
            <div className={styles.content}>
                <div className={styles.header}>
                    <h3 className={styles.title}>{displayTitle}</h3>
                </div>
                <p className={styles.location}>{getLocalizedCity() || item.city?.name}</p>
                <p className={styles.price}>
                    <span className={styles.priceValue}>{displayPrice} {item.price_unit}</span>
                    <span className={styles.priceUnit}> {item.price_type === 'daily' ? t('per_day') : ''}</span>
                </p>
            </div>
        </article>
    );
}
