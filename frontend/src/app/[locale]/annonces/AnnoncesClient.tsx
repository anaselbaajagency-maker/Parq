'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { api, Listing } from '@/lib/api';
import ListingGrid from '@/components/ListingGrid';
import { useTranslations } from 'next-intl';

export default function AnnoncesClient() {
    const t = useTranslations('Listings');
    const searchParams = useSearchParams();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchListings() {
            setLoading(true);
            const apiParams: Record<string, string | number | boolean> = {};

            if (searchParams.get('category_id')) apiParams.category_id = searchParams.get('category_id')!;
            if (searchParams.get('city_id')) apiParams.city_id = searchParams.get('city_id')!;
            if (searchParams.get('price_min')) apiParams.price_min = searchParams.get('price_min')!;
            if (searchParams.get('price_max')) apiParams.price_max = searchParams.get('price_max')!;
            if (searchParams.get('sort')) apiParams.sort = searchParams.get('sort')!;

            try {
                const response = await api.listings.getAll(apiParams);
                setListings(response.data);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchListings();
    }, [searchParams]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">
                    {t('page_title')}
                </h1>
                <div className="flex gap-2">
                    {/* Placeholder for Sort/Filter Controls */}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="hidden lg:block w-1/4">
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="font-semibold mb-4">Filtres</h3>
                        <p className="text-sm text-gray-500">Composant filtres à venir...</p>
                    </div>
                </aside>

                <main className="flex-1">
                    <ListingGrid listings={listings} isLoading={loading} />
                </main>
            </div>
        </div>
    );
}
