'use client';

import { ShieldCheck, ArrowLeft, Home, Search } from 'lucide-react';
import { Link } from '../navigation';
import { useLocale } from 'next-intl';

interface Props {
    status?: string;
}

export default function UnavailableListing({ status }: Props) {
    const locale = useLocale();
    const isAr = locale === 'ar';

    const content = {
        fr: {
            title: "Annonce indisponible",
            desc: status === 'pending'
                ? "Cette annonce est en cours de validation par notre équipe."
                : "Cette annonce a été mise en pause ou n'est plus disponible.",
            back: "Retour à l'accueil",
            browse: "Parcourir les annonces"
        },
        ar: {
            title: "الإعلان غير متاح حالياً",
            desc: status === 'pending'
                ? "هذا الإعلان قيد المراجعة من قبل فريقنا حالياً."
                : "هذا الإعلان تم إخفاؤه أو لم يعد متاحاً.",
            back: "العودة للرئيسية",
            browse: "تصفح الإعلانات"
        }
    };

    const t = isAr ? content.ar : content.fr;

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50/50 pt-32">
            <div className="max-w-md w-full bg-white rounded-[32px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 bg-orange-100 rounded-full animate-pulse opacity-50"></div>
                    <ShieldCheck size={48} className="text-orange-500 relative z-10" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
                    {t.title}
                </h1>

                <p className="text-gray-500 text-lg leading-relaxed mb-10">
                    {t.desc}
                </p>

                <div className="flex flex-col w-full gap-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
                    >
                        <Home size={20} />
                        {t.back}
                    </Link>

                    <Link
                        href="/buy"
                        className="flex items-center justify-center gap-3 bg-gray-100 text-gray-700 px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95"
                    >
                        <Search size={20} />
                        {t.browse}
                    </Link>
                </div>
            </div>
        </div>
    );
}
