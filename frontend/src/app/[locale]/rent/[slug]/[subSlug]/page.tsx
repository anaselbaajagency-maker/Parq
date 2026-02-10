import { setRequestLocale } from 'next-intl/server';
import RentCategoryClient from '../../[slug]/RentCategoryClient';

export function generateStaticParams() {
    return [{ slug: 'default', subSlug: 'default' }];
}
export const dynamicParams = false;

export default async function RentCityCategoryPage({ params }: { params: Promise<{ locale: string; slug: string; subSlug: string }> }) {
    const { locale, slug: city, subSlug: categorySlug } = await params;
    setRequestLocale(locale);

    return <RentCategoryClient categoryId={categorySlug} citySlug={city} />
}
