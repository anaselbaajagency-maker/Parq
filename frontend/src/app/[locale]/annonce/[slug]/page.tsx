import { setRequestLocale } from 'next-intl/server';
import ListingClient from './ListingClient';

export async function generateStaticParams() {
    return [{ slug: 'default' }];
}

export default async function ListingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    return <ListingClient slug={slug} />;
}
