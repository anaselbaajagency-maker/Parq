import { setRequestLocale } from 'next-intl/server';
import ProfileClient from './ProfileClient';

export const dynamicParams = true;

export default async function ProfilePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    return <ProfileClient id={id} />;
}
