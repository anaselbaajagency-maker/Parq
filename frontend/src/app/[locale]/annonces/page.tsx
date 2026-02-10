import { Suspense } from 'react';
import AnnoncesClient from './AnnoncesClient';

export default function AnnoncesPage() {
    return (
        <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
            <AnnoncesClient />
        </Suspense>
    );
}
