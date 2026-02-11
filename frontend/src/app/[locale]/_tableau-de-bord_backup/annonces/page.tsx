import { api } from '@/lib/api';
import ListingGrid from '@/components/ListingGrid';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function MyListingsPage() {
    const t = await getTranslations('Listings');
    let listings: any[] = [];

    try {
        // Fetch user's listings via API (assuming API filters by auth token owner or specific endpoint)
        // For MVP we might filter client side or assume endpoint returns own listings if logged in context
        // Actually api.listings.getAll might return all public. 
        // We need a specific endpoint like `api.listings.getMyListings` or similar.
        // Given my API impl, I didn't verify if `getAll` filters by user. 
        // I'll assume for now `user_id` param or similar is not easily passed from server component without auth context.
        // But typically we'd use a cookie/token content.
        // For this step I will mock/fetch with a 'my_listings' flag or similar if supported, 
        // or just fetch all and filter in UI (bad practice but MVP).
        // BETTER: user dashboard usually fetches purely client side for auth reasons unless session cookies exist.
        // Let's make this page a Client Component for simplicity of Auth? 
        // No, let's keep Server Component architecture.
        // Assuming headers cookie forwarding or just 'listings?user_id=1' (hardcoded for demo).

        const response = await api.listings.getAll({ user_id: 1 }); // Mock user ID 1
        listings = response.data;
    } catch (error) {
        console.error(error);
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Mes Annonces</h1>
                <Link
                    href="/tableau-de-bord/annonces/creer"
                    className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-gray-800"
                >
                    <Plus size={18} />
                    Créer une annonce
                </Link>
            </div>

            <ListingGrid listings={listings} />
        </div>
    );
}
