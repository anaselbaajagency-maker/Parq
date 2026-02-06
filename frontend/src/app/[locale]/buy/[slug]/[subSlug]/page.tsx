import { setRequestLocale } from 'next-intl/server';
import { fetchCategories } from '@/lib/api';
import { notFound } from 'next/navigation';
import BuyCategoryClient from '../../[slug]/BuyCategoryClient';

// Using server-side params based on Next.js App Router rules
export default async function BuyCityCategoryPage({ params }: { params: Promise<{ locale: string; slug: string; subSlug: string }> }) {
    const { locale, slug: city, subSlug: categorySlug } = await params;
    setRequestLocale(locale);

    // Fetch categories to validate and get details for the category slug
    const categories = await fetchCategories('buy');

    // Resolve category by ID or any slug (since backend does this, frontend strictly checking ID might fail if we don't have full map.
    // However, fetchCategories returns array. We can try to find by ID or Slug.
    const category = categories.find(c =>
        c.id === categorySlug ||
        c.slug === categorySlug ||
        c.slug_fr === categorySlug ||
        c.slug_ar === categorySlug
    );

    if (!category) {
        // Option: If not found in fetched list, maybe it exists but wasn't fetched? 
        // For now, 404 is safe.
        notFound();
    }

    return (
        <BuyCategoryClient
            categoryId={categorySlug}
            citySlug={city}
            category={category as any}
        />
    );
}
