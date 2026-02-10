'use client';

import { useEffect, useState } from 'react';
import { fetchUserProfile } from '@/lib/api';
import styles from './profile.module.css';
import { Phone, MessageSquare, ShieldCheck, User as UserIcon, Calendar, CheckCircle2 } from 'lucide-react';
import ListingCard from '../../../../components/ListingCard';
import { routes } from '@/lib/routes';
import ProfileActions from './ProfileActions';
import { Link } from '../../../../navigation';

interface ProfileClientProps {
    id: string;
}

export default function ProfileClient({ id }: ProfileClientProps) {
    const [profileData, setProfileData] = useState<{ user: any, listings: any[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);
            try {
                const data = await fetchUserProfile(id);
                setProfileData(data);
            } catch (err) {
                console.error(err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        loadProfile();

    }, [id]);

    if (loading) return <div className="p-8 text-center">Chargement...</div>;
    if (error || !profileData || !profileData.user) return <div className="p-8 text-center">Profil introuvable</div>;

    const { user, listings } = profileData;

    return (
        <div className={styles.container}>
            {/* User Header Card */}
            <div className={styles.profileHeader}>
                <div className={styles.avatarLarge}>
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.full_name} className={styles.avatarImg} />
                    ) : (
                        <div className={styles.avatarPlaceholderLarge}>
                            {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    )}
                </div>

                <div className={styles.userInfo}>
                    <h1 className={styles.userName}>
                        {user.full_name}
                        {user.role === 'ADMIN' && <ShieldCheck size={24} className="text-blue-600 ml-2" />}
                    </h1>
                    <div className={styles.userMeta}>
                        <div className={styles.metaItem}>
                            <UserIcon size={18} />
                            <span>{user.role === 'PROVIDER' ? 'Prestataire' : (user.role === 'ADMIN' ? 'Administrateur' : user.role)}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <Calendar size={18} />
                            <span>Membre depuis {new Date(user.created_at).getFullYear()}</span>
                        </div>
                        {listings.length > 0 && (
                            <div className={styles.metaItem}>
                                <CheckCircle2 size={18} />
                                <span>{listings.length} annonces actives</span>
                            </div>
                        )}
                    </div>
                </div>
                <ProfileActions phone={user.phone} />
            </div>

            {/* Listings Grid */}
            <div className={styles.listingsSection}>
                <h2 className={styles.sectionTitle}>Annonces publiées ({listings.length})</h2>

                {listings.length === 0 ? (
                    <div className="text-gray-500 py-10 text-center bg-gray-50 rounded-xl">
                        Aucune annonce active pour le moment.
                    </div>
                ) : (
                    <div className={styles.listingsGrid}>
                        {listings.map((listing: any) => {
                            return (
                                <Link
                                    href={routes.listing(listing.slug || listing.id) as any}
                                    key={listing.id}
                                    className={styles.cardLink}
                                >
                                    <ListingCard item={listing} />
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
