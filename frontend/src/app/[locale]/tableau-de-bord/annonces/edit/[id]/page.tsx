import { setRequestLocale } from 'next-intl/server';
import EditListingClient from './EditListingClient';

export function generateStaticParams() {
    return [{ id: 'default' }];
}

export default async function EditListingPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    return <EditListingClient id={id} />;
}
