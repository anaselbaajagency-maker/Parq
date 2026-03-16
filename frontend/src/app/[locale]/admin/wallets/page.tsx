import WalletAdminClient from './WalletAdminClient';

export async function generateMetadata() {
    return { title: "Gestion des Portefeuilles" };
}

export default function AdminWalletsPage() {
    return <WalletAdminClient />;
}
