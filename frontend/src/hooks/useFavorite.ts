import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from '@/navigation';

export function useFavorite(listingId: number | string, initialStatus: boolean = false) {
    const [isFavorited, setIsFavorited] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const router = useRouter();

    const toggleFavorite = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!isAuthenticated) {
            router.push('/login');
            return false;
        }

        setIsLoading(true);
        // Optimistic update
        const previousState = isFavorited;
        setIsFavorited(!isFavorited);

        try {
            const res = await api.listings.toggleFavorite(listingId);
            setIsFavorited(res.is_favorited);
            // Optional: Success feedback
        } catch (error) {
            // Revert on error
            setIsFavorited(previousState);
            console.error("Erreur lors de la mise à jour des favoris", error);
            alert("Une erreur est survenue");
        } finally {
            setIsLoading(false);
        }
    };

    return { isFavorited, toggleFavorite, isLoading };
}
