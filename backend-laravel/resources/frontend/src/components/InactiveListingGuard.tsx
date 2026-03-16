'use client';

import { useAuthStore } from '@/lib/auth-store';
import { Listing } from '@/lib/api';
import { Lock } from 'lucide-react';
import UnavailableListing from './UnavailableListing';

interface Props {
    listing: Listing;
    children: React.ReactNode;
}

export default function InactiveListingGuard({ listing, children }: Props) {
    const { user } = useAuthStore();

    // If listing is active, allow access immediately
    if (listing.status === 'active' && listing.is_available) {
        return <>{children}</>;
    }

    // If listing is inactive/pending/rejected/hidden
    // Check permissions: Admin or Owner
    const isOwner = user && String(user.id) === String(listing.user_id);
    const isAdmin = user && user.role === 'ADMIN';

    if (isAdmin || isOwner) {
        // Show a warning banner but allow access
        return (
            <>
                <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 sticky top-0 z-50">
                    <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 text-yellow-800">
                            <Lock size={18} />
                            <span className="text-sm font-medium uppercase tracking-wider">
                                {isAdmin ? 'Mode Administrateur' : 'Mode Propriétaire'} :
                                <span className="ml-2 font-black">{listing.status}</span>
                            </span>
                        </div>
                    </div>
                </div>
                {children}
            </>
        );
    }

    // Unauthorized - Show Premium Unavailable Page
    return <UnavailableListing status={listing.status} />;
}
