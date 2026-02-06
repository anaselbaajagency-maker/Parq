import { setRequestLocale } from 'next-intl/server';
import ListingsClient from './ListingsClient';

export default async function ListingsPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ListingsClient />;
}
