'use client';

import styles from './CategoryBar.module.css';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '../navigation';
import {
    LayoutGrid, HardHat, Truck, Bus, Users, Car, Wrench, Building,
    ChevronLeft, ChevronRight
} from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchCategories, Category } from '@/lib/api';
import { routes } from '@/lib/routes';

// Icon mapping
const iconMap: Record<string, any> = {
    LayoutGrid, HardHat, Truck, Bus, Users, Car, Wrench, Building
};

interface CategoryBarProps {
    type: 'rent' | 'buy' | 'all';
}

export default function CategoryBar({ type }: CategoryBarProps) {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const pathname = usePathname();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Dynamic categories state
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const params = useParams();
    const currentSlug = params?.slug as string;

    const checkIsActive = (catSlug: string, catType: string) => {
        // For "All" category, check if we're on the base rent/buy page
        if (catSlug === 'all') {
            const basePaths = catType === 'rent'
                ? ['/rent', '/location', '/kira']
                : ['/buy', '/achat', '/chira'];
            return basePaths.some(base => pathname === base);
        }

        // For specific categories, match the slug param or check pathname
        if (currentSlug && catSlug === currentSlug) return true;

        return pathname.includes(`/${catSlug}`);
    };

    // Load categories from API
    useEffect(() => {
        async function loadCategories() {
            try {
                // Fetch based on requested type
                const data = await fetchCategories(type === 'all' ? undefined : type, true);

                // Add "All" category manually
                const allCategory: Category = {
                    id: 'all',
                    name: 'All',
                    slug: 'all',
                    type: type === 'all' ? 'rent' : type,
                    icon: 'LayoutGrid',
                    order: 0,
                    is_active: true
                };

                setCategories([allCategory, ...data]);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            } finally {
                setLoading(false);
            }
        }
        loadCategories();
    }, [type]);

    const checkScrollPosition = () => {
        const el = scrollRef.current;
        if (!el) return;
        setShowLeftArrow(el.scrollLeft > 0);
        setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    useEffect(() => {
        checkScrollPosition();
        window.addEventListener('resize', checkScrollPosition);
        return () => window.removeEventListener('resize', checkScrollPosition);
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;
        const scrollAmount = 200;
        el.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
        setTimeout(checkScrollPosition, 300);
    };

    if (loading && categories.length === 0) return (
        <nav className={styles.categoryBar}>
            <div className={styles.loadingPulse} />
        </nav>
    );


    const filteredCategories = categories.filter(cat => {
        const label = (locale === 'ar' && cat.name_ar) ? cat.name_ar
            : (locale === 'fr' && cat.name_fr) ? cat.name_fr
                : cat.name;
        return label.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className={styles.container}>

            <nav className={styles.categoryBar}>
                {showLeftArrow && (
                    <button
                        className={`${styles.scrollArrow} ${styles.leftArrow}`}
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={16} />
                    </button>
                )}

                <div
                    className={styles.categoryList}
                    ref={scrollRef}
                    onScroll={checkScrollPosition}
                >
                    {filteredCategories.map((cat) => {
                        const Icon = iconMap[cat.icon as string] || LayoutGrid;
                        const catType = cat.id === 'all' ? (type === 'all' ? 'rent' : type) : cat.type;
                        const slug = (cat.slug || cat.id).toString();
                        if (!slug) return null; // Safeguard against missing slug/id
                        const href = routes.category(catType, slug);
                        const active = checkIsActive(slug, catType);

                        // Use localized name from database
                        let label: string;
                        if (cat.id === 'all') {
                            label = t('all');
                        } else if (locale === 'ar' && cat.name_ar) {
                            label = cat.name_ar;
                        } else if (locale === 'fr' && cat.name_fr) {
                            label = cat.name_fr;
                        } else {
                            label = cat.name;
                        }

                        return (
                            <Link
                                key={`${cat.id}-${cat.type}`}
                                href={href as any}
                                className={`${styles.categoryItem} ${active ? styles.active : ''}`}
                            >
                                {/* Icon removed per user request */}
                                {/* <div className={styles.iconWrapper}>
                                    <Icon
                                        size={32}
                                        strokeWidth={active ? 2 : 1.5}
                                        className={styles.icon}
                                    />
                                </div> */}
                                <span className={`${styles.label} ${active ? styles.active : ''}`}>
                                    {label}
                                </span>
                                {active && <div className={styles.activeIndicator} />}
                            </Link>
                        );
                    })}
                </div>

                {showRightArrow && (
                    <button
                        className={`${styles.scrollArrow} ${styles.rightArrow}`}
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={16} />
                    </button>
                )}
            </nav>
        </div>
    );
}
