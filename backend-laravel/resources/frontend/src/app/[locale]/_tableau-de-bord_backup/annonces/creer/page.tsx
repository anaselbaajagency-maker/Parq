import DynamicListingForm from '@/components/DynamicListingForm';
import { getTranslations } from 'next-intl/server';

export default async function CreateListingPage() {
    const t = await getTranslations('Listings');

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Créer une nouvelle annonce</h1>
            <DynamicListingForm />
        </div>
    );
}
