import PaymentMethodsClient from './PaymentMethodsClient';

export async function generateMetadata() {
    return { title: "Méthodes de Paiement" };
}

export default function AdminPaymentMethodsPage() {
    return <PaymentMethodsClient />;
}
