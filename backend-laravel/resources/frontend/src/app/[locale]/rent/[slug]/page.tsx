import { setRequestLocale } from 'next-intl/server';
import { fetchCategories } from '@/lib/api';
import { notFound } from 'next/navigation';
import RentCategoryClient from './RentCategoryClient';



export default async function RentCategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    return <RentCategoryClient categoryId={slug} />;
}
