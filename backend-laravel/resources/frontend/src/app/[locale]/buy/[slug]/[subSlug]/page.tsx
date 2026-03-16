import { setRequestLocale } from 'next-intl/server';
import BuyCategoryClient from '../../[slug]/BuyCategoryClient';


export const dynamicParams = false;

export default async function BuyCityCategoryPage({ params }: { params: Promise<{ locale: string; slug: string; subSlug: string }> }) {
    const { locale, slug: city, subSlug: categorySlug } = await params;
    setRequestLocale(locale);

    return <BuyCategoryClient categoryId={categorySlug} citySlug={city} />
}
