import { setRequestLocale } from 'next-intl/server';
import { fetchCategories } from '@/lib/api';
import { notFound } from 'next/navigation';
import BuyCategoryClient from './BuyCategoryClient';



export default async function BuyCategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    return <BuyCategoryClient categoryId={slug} />
}
