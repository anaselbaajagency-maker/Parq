'use client';

import { useAuthStore } from '@/lib/auth-store';
import { Listing } from '@/lib/api';
import { AlertCircle, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

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
                            <span className="text-sm font-medium">
                                {isAdmin ? 'Mode Administrateur' : 'Mode Propriétaire'} :
                                Cette annonce est actuellement <span className="uppercase font-bold">{listing.status}</span>.
                                Elle n'est visible que par vous.
                            </span>
                        </div>
                    </div>
                </div>
                {children}
            </>
        );
    }

    // Unauthorized - Show "Not Found" / Inactive styling
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Annonce indisponible</h1>
            <p className="text-gray-500 max-w-md mb-8">
                Cette annonce n'est plus disponible ou a été désactivée.
                Essayez d'effectuer une nouvelle recherche pour trouver votre bonheur.
            </p>
            <Link
                href="/"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                replace
            >
                <ArrowLeft size={18} />
                Retour à l'accueil
            </Link>
        </div>
    );
}
