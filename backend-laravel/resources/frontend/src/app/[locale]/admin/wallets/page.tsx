import AdminWalletsClient from './AdminWalletsClient';

export async function generateMetadata() {
    return { title: "Gestion des Portefeuilles" };
}

export default function AdminWalletsPage() {
    return <AdminWalletsClient />;
}
