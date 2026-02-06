"use client";

import { Listing } from '@/types/listing';
import ListingCard from './ListingCard';

interface ListingGridProps {
    listings: Listing[];
    isLoading?: boolean;
}

export default function ListingGrid({ listings, isLoading }: ListingGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                        <div className="bg-gray-200 rounded-lg aspect-[1/0.94] mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (listings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 text-lg">Aucune annonce trouvée.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
                <ListingCard key={listing.id} item={listing} />
            ))}
        </div>
    );
}
