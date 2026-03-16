import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import CreateListingClient from './CreateListingClient';
import { getServerAuthState } from '@/lib/server-auth';

export default async function CreatePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const auth = getServerAuthState(await cookies());

    if (!auth.isAuthenticated) {
        redirect(`/${locale}/connexion`);
    }

    return <CreateListingClient />;
}
