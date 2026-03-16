import { setRequestLocale } from 'next-intl/server';
import MaintenanceClient from './MaintenanceClient';

export default async function MaintenancePage({ params }: { params: Promise<{ locale: string }> }) {
    // If params are passed (optional for top level pages sometimes but here it is [locale] layout child)
    // Actually maintenance page might not receive params if it is not dynamic?
    // It is under [locale] folder, so it receives locale.
    const { locale } = await params;
    setRequestLocale(locale);

    return <MaintenanceClient />;
}
