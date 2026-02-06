import { notFound } from 'next/navigation';
import { Link } from '../../../../navigation';
import { setRequestLocale } from 'next-intl/server';
import { fetchUserProfile } from '@/lib/api';
import styles from './profile.module.css';
import { Phone, MessageSquare, ShieldCheck, User, Calendar, CheckCircle2 } from 'lucide-react';
import ListingCard from '../../../../components/ListingCard';
import { routes } from '@/lib/routes';
import ProfileActions from './ProfileActions';

export default async function ProfilePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
    const { locale, id } = await params;
    setRequestLocale(locale);

    const profileData = await fetchUserProfile(id);

    if (!profileData || !profileData.user) {
        notFound();
    }

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
                            <User size={18} />
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
