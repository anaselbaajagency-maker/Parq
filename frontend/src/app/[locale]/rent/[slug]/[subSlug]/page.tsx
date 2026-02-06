import { setRequestLocale } from 'next-intl/server';
import { fetchCategories } from '@/lib/api';
import { notFound } from 'next/navigation';
import RentCategoryClient from '../../[slug]/RentCategoryClient';

// Using server-side params based on Next.js App Router rules
export default async function RentCityCategoryPage({ params }: { params: Promise<{ locale: string; slug: string; subSlug: string }> }) {
    const { locale, slug: city, subSlug: categorySlug } = await params;
    setRequestLocale(locale);

    // Fetch categories to validate and get details for the category slug
    const categories = await fetchCategories('rent');

    // Resolve category by ID or any slug
    const category = categories.find(c =>
        c.id === categorySlug ||
        c.slug === categorySlug ||
        c.slug_fr === categorySlug ||
        c.slug_ar === categorySlug
    );

    if (!category) {
        notFound();
    }

    return (
        <RentCategoryClient
            categoryId={categorySlug}
            citySlug={city}
            category={category as any}
        />
    );
}
