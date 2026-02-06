import { setRequestLocale } from 'next-intl/server';
import { fetchCategories } from '@/lib/api';
import { notFound } from 'next/navigation';
import RentCategoryClient from './RentCategoryClient';

export async function generateStaticParams() {
    const locales = ['fr', 'ar'];
    let categories: any[] = [];

    try {
        categories = await fetchCategories('rent');
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

export default async function RentCategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const categories = await fetchCategories('rent');
    // Find category by slug
    const category = categories.find(c => c.slug === slug);

    if (!category) {
        notFound();
    }

    return <RentCategoryClient categoryId={slug} category={category as any} />;
}
