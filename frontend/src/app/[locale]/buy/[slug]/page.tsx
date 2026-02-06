import { setRequestLocale } from 'next-intl/server';
import { fetchCategories } from '@/lib/api';
import { notFound } from 'next/navigation';
import BuyCategoryClient from './BuyCategoryClient';

export async function generateStaticParams() {
    const locales = ['fr', 'ar'];
    let categories: any[] = [];

    try {
        categories = await fetchCategories('buy');
    } catch (error) {
        console.warn('Failed to fetch categories during generation');
        return [];
    }

    const paths = [];
    for (const locale of locales) {
        for (const cat of categories) {
            paths.push({ locale, slug: cat.slug });
        }
    }
    return paths;
}

export default async function BuyCategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const categories = await fetchCategories('buy');
    // Find category by slug instead of id
    const category = categories.find(c => c.slug === slug);

    if (!category) {
        notFound();
    }

    return <BuyCategoryClient categorySlug={slug} category={category as any} locale={locale} />;
}
