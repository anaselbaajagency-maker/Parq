import { api } from '@/lib/api';
import ListingGrid from '@/components/ListingGrid';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

// Force dynamic rendering if using searchParams without generic 'dynamic' config
export const dynamic = 'force-dynamic';

export default async function AnnoncesPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const t = await getTranslations('Listings');
    const params = await searchParams;

    // Normalize params for API
    const apiParams: Record<string, string | number | boolean> = {};

    if (params.category_id) apiParams.category_id = params.category_id as string;
    if (params.city_id) apiParams.city_id = params.city_id as string;
    if (params.price_min) apiParams.price_min = params.price_min as string;
    if (params.price_max) apiParams.price_max = params.price_max as string;
    if (params.sort) apiParams.sort = params.sort as string;

    let listings = [];
    try {
        const response = await api.listings.getAll(apiParams);
        listings = response.data;
    } catch (error) {
        console.error("Failed to fetch listings:", error);
        // In production, handle error UI gracefully
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">
                    {t('page_title', { defaultMessage: 'Annonces' })}
                </h1>
                {/* Placeholder for Sort/Filter Controls */}
                <div className="flex gap-2">
                    {/* Simple Sort Select Placeholder */}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Placeholder */}
                <aside className="hidden lg:block w-1/4">
                    <div className="bg-white p-4 rounded-lg border">
                        <h3 className="font-semibold mb-4">Filtres</h3>
                        <p className="text-sm text-gray-500">Composant filtres à venir...</p>
                    </div>
                </aside>

                <main className="flex-1">
                    <Suspense fallback={<ListingGrid listings={[]} isLoading={true} />}>
                        <ListingGrid listings={listings} />
                    </Suspense>
                </main>
            </div>
        </div>
    );
}
