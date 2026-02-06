import PaymentMethodsClient from './PaymentMethodsClient';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params: { locale } }: any) {
    return { title: "Méthodes de Paiement" };
}

export default function AdminPaymentMethodsPage() {
    return <PaymentMethodsClient />;
}
