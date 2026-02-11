import { setRequestLocale } from 'next-intl/server';
import ProfileClient from './ProfileClient';

export function generateStaticParams() {
    return [{ id: 'default' }];
}
export const dynamicParams = false;

export default async function ProfilePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    return <ProfileClient id={id} />;
}
