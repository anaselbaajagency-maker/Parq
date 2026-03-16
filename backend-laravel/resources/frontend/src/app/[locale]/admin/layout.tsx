import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';
import { getServerAuthState } from '@/lib/server-auth';

export default async function AdminLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const auth = getServerAuthState(await cookies());

    if (!auth.isAuthenticated) {
        redirect(`/${locale}/connexion`);
    }

    if (auth.role !== 'ADMIN') {
        redirect(`/${locale}/tableau-de-bord`);
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
