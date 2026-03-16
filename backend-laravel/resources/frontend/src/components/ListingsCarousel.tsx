'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './ListingsCarousel.module.css';
import { Link } from '../navigation';
import ListingCard from './ListingCard';
import { Listing } from '@/types/listing';
import { routes } from '@/lib/routes';

interface ListingsCarouselProps {
    title: string;
    listings: Listing[];
    viewAllHref?: string;
}

export default function ListingsCarousel({ title, listings, viewAllHref }: ListingsCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {viewAllHref ? (
                    <Link href={viewAllHref as any} className={styles.titleLink}>
                        <h2 className={styles.title}>{title} ›</h2>
                    </Link>
                ) : (
                    <h2 className={styles.title}>{title} ›</h2>
                )}

                <div className={styles.controls}>
                    <button onClick={() => scroll('left')} className={styles.controlBtn}>
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.controlBtn}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className={styles.carousel} ref={scrollRef}>
                {/* Valid Listings */}
                {listings.map((item) => {
                    if (!item || !item.id || !item.title) return null;
                    return (
                        <Link key={item.id} href={routes.listing(item.slug || item.id.toString()) as any} className={styles.cardLink}>
                            <ListingCard item={item} />
                        </Link>
                    );
                })}

                {/* Empty Placeholders (Fill up to 6) */}
                {Array.from({ length: Math.max(0, 6 - listings.filter(l => l && l.id && l.title).length) }).map((_, index) => (
                    <div key={`placeholder-${index}`} className={styles.placeholderCard} aria-hidden="true" />
                ))}
            </div>
        </div>
    );
}
