import AdminWalletsClient from './AdminWalletsClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
    const t = await getTranslations({ locale, namespace: 'Admin' });
    return { title: "Gestion des Portefeuilles" };
}

export default function AdminWalletsPage() {
    return <AdminWalletsClient />;
}
