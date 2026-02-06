import { notFound } from 'next/navigation';
import { Link } from '../../../../navigation';
// ... existing imports

// ...


import { setRequestLocale } from 'next-intl/server';
import {
    MapPin,
    Star,
    Share,
    Heart,
    ShieldCheck,
    Truck,
    CheckCircle2,
    MessageSquare,
    Globe,
    Award,
    Calendar,
    Phone,
    Fuel,
    Gauge,
    Cog,
    Image as ImageIcon,
    Grid3X3,
    Settings as SettingsIcon,
} from 'lucide-react';
import { fetchListings, fetchListingBySlug } from '@/lib/api';
import ViewTracker from './ViewTracker';
import styles from './listing.module.css';
import InactiveListingGuard from '@/components/InactiveListingGuard';
import ListingActions from './ListingActions';

// Enable dynamic routes even if not in generateStaticParams
export const dynamicParams = true;

export async function generateStaticParams() {
    let allListings: any[] = [];
    const locales = ['ar', 'fr'];

    try {
        allListings = await fetchListings();
    } catch (error) {
        console.warn('Failed to fetch listings from API during generation');
    }

    // If we got listings, generate params for them
    // If not, return empty array and rely on dynamicParams=true
    const params = [];
    for (const locale of locales) {
        for (const listing of allListings) {
            if (listing.slug) {
                params.push({ locale, slug: listing.slug });
            }
        }
    }
    return params;
}

export default async function ListingPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const listing = await fetchListingBySlug(slug);

    if (!listing) {
        notFound();
    }

    const isRent = listing.type === 'rent';
    const priceUnit = listing.price_unit || (isRent ? 'DH/jour' : 'DH');
    const numericPrice = parseInt(listing.price.toString().replace(/[^0-9]/g, '')) || 0;

    // Parse images: handle if it's a JSON string or array, or fallback to single image
    let galleryImages: string[] = [];
    if (Array.isArray(listing.images)) {
        galleryImages = listing.images.map((img: any) => typeof img === 'string' ? img : img.image_path);
    } else if (typeof listing.images === 'string' && (listing.images as string).startsWith('[')) {
        try {
            galleryImages = JSON.parse(listing.images);
        } catch (e) {
            galleryImages = [listing.images];
        }
    } else if (listing.image) {
        galleryImages = [listing.image];
    }

    // Prioritize hero image if exists and not already in gallery
    if (listing.image_hero) {
        if (!galleryImages.includes(listing.image_hero)) {
            galleryImages.unshift(listing.image_hero);
        }
    }

    const mainImage = galleryImages[0];
    const sideImages = galleryImages.slice(1, 3);
    const remainingCount = Math.max(0, galleryImages.length - 3);

    return (
        <InactiveListingGuard listing={listing}>
            <div className={styles.container}>
                <ViewTracker slug={slug} />

                {/* Header: Title and Breadcrumbs */}
                <header className={styles.header}>
                    <div className={styles.metaHeader}>
                        <div className={styles.titleSection}>
                            <h1 className={styles.title}>{listing.title}</h1>
                            <div className={styles.metaLeft}>
                                <div className="flex items-center gap-1 font-medium bg-gray-100 px-2 py-1 rounded-full text-xs">
                                    <Star size={14} className="fill-black" />
                                    <span>{listing.rating || 'Nouveau'}</span>
                                </div>
                                <span className={styles.metaDot}>•</span>
                                <span className={styles.location}>
                                    <MapPin size={16} className="inline mr-1" />
                                    {listing.city?.name || 'Maroc'}
                                </span>
                                <span className={styles.metaDot}>•</span>
                                <span className="text-gray-500">Ref: #{listing.id}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Immersive Gallery */}
                <div className={styles.gallery}>
                    {/* Main Image */}
                    <div className={styles.mainImageWrapper}>
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={listing.title}
                                className={styles.mainImage}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                <ImageIcon size={48} />
                            </div>
                        )}
                    </div>

                    {/* Side Images (Desktop) */}
                    <div className={styles.sideImages}>
                        {sideImages.map((img, idx) => (
                            <div key={idx} className={styles.subImageWrapper}>
                                <img
                                    src={img}
                                    alt={`${listing.title} - ${idx + 2}`}
                                    className={styles.subImage}
                                />
                            </div>
                        ))}
                        {/* Placeholder logic for empty slots if needed, or just fill space */}
                        {sideImages.length < 2 && Array.from({ length: 2 - sideImages.length }).map((_, idx) => (
                            <div key={`empty-${idx}`} className={styles.subImageWrapper} style={{ background: '#f3f4f6' }}></div>
                        ))}
                    </div>

                    <button className={styles.showAllBtn}>
                        <Grid3X3 size={18} />
                        Afficher toutes les photos
                        {remainingCount > 0 && <span className="bg-gray-100 px-1.5 py-0.5 rounded-md text-xs ml-1">+{remainingCount}</span>}
                    </button>
                </div>

                {/* Main Layout: Left Content + Sticky Sidebar */}
                <div className={styles.layoutGrid}>
                    {/* Left Column */}
                    <div className={styles.mainContent}>

                        {/* Description */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>À propos de ce véhicule</div>
                            <p className={styles.description}>
                                {listing.description || `Découvrez ce ${listing.title} exceptionnel, idéal pour vos chantiers. Entretien régulier et performances garanties.`}
                            </p>
                        </div>

                        {/* Critères (Attributes) Grid */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Caractéristiques Techniques</div>
                            <div className={styles.specsGrid}>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}><CheckCircle2 size={14} /> Type</span>
                                    <span className={styles.specValue}>{isRent ? 'Location' : 'Vente'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}><Gauge size={14} /> Catégorie</span>
                                    <span className={styles.specValue}>{listing.category_name || listing.category_slug || 'Standard'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}><Award size={14} /> Marque</span>
                                    <span className={styles.specValue}>{listing.brand || 'N/A'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}><Calendar size={14} /> Année</span>
                                    <span className={styles.specValue}>{listing.year || '2022'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}><Fuel size={14} /> Carburant</span>
                                    <span className={styles.specValue}>{listing.fuel || 'Diesel'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}><Gauge size={14} /> Puissance</span>
                                    <span className={styles.specValue}>{listing.power || 'N/A'}</span>
                                </div>
                                <div className={styles.specItem}>
                                    <span className={styles.specLabel}><ShieldCheck size={14} /> État</span>
                                    <span className={styles.specValue}>{listing.condition || 'Occasion vérifiée'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Features / Equipments */}
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Équipements & Options</div>
                            <div className={styles.featuresGrid}>
                                {listing.features ? (
                                    (() => {
                                        try {
                                            // Handle both array and string (JSON) cases
                                            const features = typeof listing.features === 'string'
                                                ? JSON.parse(listing.features)
                                                : listing.features;

                                            return Array.isArray(features) && features.map((feature: string, idx: number) => (
                                                <div key={idx} className={styles.featureItem}>
                                                    <CheckCircle2 size={20} className={styles.featureIcon} />
                                                    <div className={styles.featureText}>{feature}</div>
                                                </div>
                                            ));
                                        } catch (e) {
                                            return <div className="text-gray-500 italic">Information non disponible</div>;
                                        }
                                    })()
                                ) : (
                                    <>
                                        <div className={styles.featureItem}>
                                            <Truck size={20} className={styles.featureIcon} />
                                            <div className={styles.featureText}>Transport inclus disponible</div>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <ShieldCheck size={20} className={styles.featureIcon} />
                                            <div className={styles.featureText}>Assurance tous risques</div>
                                        </div>
                                        <div className={styles.featureItem}>
                                            <SettingsIcon size={20} className={styles.featureIcon} />
                                            <div className={styles.featureText}>Maintenance incluse</div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Map (Placeholder) - Hidden as requested
                        <div className={styles.section}>
                            <div className={styles.sectionTitle}>Emplacement</div>
                            <div className={styles.mapPlaceholder}>
                                <div className="absolute inset-0 flex items-center justify-center flex-col z-10">
                                    <div className="bg-white p-4 rounded-full shadow-lg mb-4">
                                        <MapPin size={32} className="text-orange-500" />
                                    </div>
                                    <p className="font-bold text-lg text-gray-800">{listing.location}, Maroc</p>
                                    <p className="text-sm bg-white/80 px-3 py-1 rounded-full mt-2 backdrop-blur-sm">L'adresse exacte est communiquée après réservation</p>
                                </div>
                            </div>
                        </div>
                        */}
                    </div>

                    {/* Right Column (Sticky Sidebar) */}
                    <aside className={styles.sidebar}>
                        <div className={styles.stickyCard}>
                            {/* Price Header */}
                            <div className={styles.priceCardHeader}>
                                <div className={styles.priceDisplay}>
                                    {numericPrice.toLocaleString()}
                                    <span className={styles.priceUnit}>{priceUnit}</span>
                                </div>
                                <div className={styles.badges}>
                                    <span className={styles.badgeAvailable}>
                                        <CheckCircle2 size={14} />
                                        Disponible immédiatement
                                    </span>
                                </div>
                            </div>

                            {/* Seller Profile */}
                            <div className={styles.sellerSection}>
                                <Link href={`/profil/${listing.user_id}` as any} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className={styles.sellerProfile}>
                                        <div className={styles.avatar}>
                                            {listing.user?.avatar ? (
                                                <img src={listing.user.avatar} alt={listing.user.full_name || 'User'} />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}>
                                                    {(listing.user?.full_name || listing.user_name || '?').charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.sellerInfo}>
                                            <h3 className="hover:text-orange-600 transition-colors">{listing.user?.full_name || listing.user_name || 'Utilisateur Parq'}</h3>
                                            <div className={styles.memberSince}>
                                                Membre depuis {listing.user?.created_at ? new Date(listing.user.created_at).getFullYear() : (listing.user_since ? new Date(listing.user_since).getFullYear() : '2023')}
                                            </div>
                                            {listing.user?.role === 'admin' && (
                                                <div className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-1 bg-blue-50 px-2 py-0.5 rounded w-fit">
                                                    <ShieldCheck size={12} />
                                                    <span>Officiel Parq</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Actions */}
                            <ListingActions
                                phone={listing.user?.phone || null}
                                whatsapp={listing.user?.phone || null}
                                sellerId={listing.user?.id || listing.user_id}
                                listingId={listing.id}
                                messagesPath={`/${locale}/tableau-de-bord/messages`}
                                recipientName={listing.user?.full_name || listing.user_name}
                                listingTitle={listing.title}
                            />

                            {/* Security Note */}
                            <div className={styles.securityNote}>
                                <ShieldCheck size={16} className="text-green-600" />
                                <span>Paiement 100% sécurisé et garantie Parq</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </InactiveListingGuard>
    );
}
