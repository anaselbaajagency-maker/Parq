import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from './DashboardLayoutClient';
import { getServerAuthState } from '@/lib/server-auth';

export default async function DashboardLayout({
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

    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
