import { api } from '@/lib/api';
import ListingGallery from '@/components/ListingGallery';
import ListingMap from '@/components/ListingMap';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { MapPin, Calendar, Tag, Info } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ListingPage({
    params,
}: {
    params: Promise<{ slug: string; locale: string }>;
}) {
    const { slug } = await params;
    const t = await getTranslations('Listings');

    let listing;
    try {
        if (!slug) notFound();
        listing = await api.listings.getOne(slug);
    } catch (error) {
        console.error("Listing fetch error:", error);
        notFound();
    }

    if (!listing) notFound();

    return (
        <div className="bg-[#FAFAFA] min-h-screen pb-20 font-sans selection:bg-black selection:text-white">
            {/* Breadcrumb / Top Bar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 py-4 sticky top-0 z-20 transition-all">
                <div className="container mx-auto px-4 max-w-7xl flex items-center gap-2 text-xs font-medium tracking-wide text-gray-500 uppercase">
                    <span className="hover:text-black cursor-pointer transition-colors">Accueil</span>
                    <span className="text-gray-300">/</span>
                    <span className="hover:text-black cursor-pointer transition-colors">Annonces</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-black truncate max-w-[200px]">{listing.title}</span>
                </div>
            </div>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left Column: Gallery & Description (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-10">
                        {/* Title Section (Mobile Only) */}
                        <div className="lg:hidden">
                            <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight tracking-tight">{listing.title}</h1>
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                                <MapPin size={16} />
                                <span>{listing.location || listing.city?.name}</span>
                            </div>
                        </div>

                        {/* Gallery Section - Immersive */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative group">
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black shadow-sm">
                                    {listing.category?.name}
                                </span>
                            </div>
                            {/* Removed padding p-2 wrapper for immersive look */}
                            <ListingGallery images={listing.images} title={listing.title} />
                        </div>

                        {/* Description Section */}
                        <div className="flex flex-col gap-6">
                            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                Description
                                <div className="h-px w-full bg-gray-100 flex-1 ml-4"></div>
                            </h2>
                            <div className="prose prose-lg prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {listing.description}
                            </div>
                        </div>

                        {/* Specs Grid */}
                        {(listing.car || listing.machinery) && (
                            <div className="flex flex-col gap-6">
                                <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                                    Caractéristiques
                                    <div className="h-px w-full bg-gray-100 flex-1 ml-4"></div>
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {listing.car?.fuel_type && (
                                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-gray-200 transition-colors">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Carburant</span>
                                            <span className="font-bold text-gray-900 text-lg">{listing.car.fuel_type}</span>
                                        </div>
                                    )}
                                    {listing.car?.gearbox && (
                                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-gray-200 transition-colors">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Boîte</span>
                                            <span className="font-bold text-gray-900 text-lg">{listing.car.gearbox}</span>
                                        </div>
                                    )}
                                    {listing.machinery?.brand && (
                                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2 hover:border-gray-200 transition-colors">
                                            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Marque</span>
                                            <span className="font-bold text-gray-900 text-lg">{listing.machinery.brand}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Map Section */}
                        <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100">
                            <div className="rounded-[1.5rem] overflow-hidden h-[400px] relative z-0">
                                <ListingMap location={listing.location || listing.city?.name || 'Casablanca'} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Sidebar (4 cols) */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-24 flex flex-col gap-6">

                            {/* Main Info Card - Glass Effect */}
                            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20">

                                <div className="hidden lg:block mb-6">
                                    <h1 className="text-3xl font-black text-gray-900 leading-tight tracking-tight mb-2">{listing.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                        <MapPin size={16} className="text-gray-400" />
                                        <span>{listing.location || listing.city?.name}</span>
                                    </div>
                                </div>

                                <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">{t('price_label', { defaultMessage: 'Prix' })}</p>
                                    <div className="flex items-center justify-center gap-1 text-gray-900">
                                        <span className="text-5xl font-black tracking-tighter">
                                            {listing.price !== undefined ? Math.floor(Number(listing.price)).toLocaleString() : '---'}
                                        </span>
                                        <span className="text-xl font-bold self-start mt-2">DH</span>
                                    </div>
                                    {listing.price_type === 'daily' && <div className="text-sm text-gray-400 font-medium mt-1">par jour</div>}
                                </div>

                                {/* CTAs */}
                                <div className="flex flex-col gap-3">
                                    <button className="group w-full bg-[#25D366] hover:bg-[#1dbf5a] text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-500/30 active:translate-y-[0px]">
                                        <span>WhatsApp</span>
                                    </button>
                                    <button className="group w-full bg-gray-900 hover:bg-black text-white py-4 px-6 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/20 active:translate-y-[0px]">
                                        <span>Appeler</span>
                                    </button>
                                </div>

                                {/* Safety Tip - Minimal */}
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <div className="flex gap-3">
                                        <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-gray-400 leading-relaxed">
                                            <strong>Conseil de sécurité:</strong> Ne jamais envoyer d'argent à l'avance. Rencontrez le vendeur dans un lieu public.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
