import { setRequestLocale } from 'next-intl/server';
import WalletClient from './WalletClient';

export default async function WalletPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <WalletClient />;
}
