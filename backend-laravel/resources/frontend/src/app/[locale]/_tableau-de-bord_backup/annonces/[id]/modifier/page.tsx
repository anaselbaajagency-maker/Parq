import DynamicListingForm from '@/components/DynamicListingForm';
import { api } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let listing;

    try {
        listing = await api.listings.getOne(id);
    } catch (error) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Modifier l'annonce</h1>
            <DynamicListingForm initialData={listing} isEdit={true} />
        </div>
    );
}
