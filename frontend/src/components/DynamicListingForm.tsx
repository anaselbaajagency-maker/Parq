"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useTranslations } from 'next-intl';
import WalletWarning from './WalletWarning';

// Simplified category definitions (fetch from API in prod)
const CATEGORIES = [
    { id: 1, name: 'Voitures', type: 'car_rental', daily_cost: 10 },
    { id: 2, name: 'Engins BTP', type: 'machinery', daily_cost: 20 },
    { id: 3, name: 'Transport', type: 'transport', daily_cost: 15 },
    { id: 4, name: 'Chauffeurs', type: 'driver', daily_cost: 5 },
];

export default function DynamicListingForm({ initialData, isEdit }: { initialData?: any, isEdit?: boolean }) {
    const t = useTranslations('Listings');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Auth & Wallet Mock
    const [walletBalance, setWalletBalance] = useState(15);

    const [categoryId, setCategoryId] = useState<number | string>(initialData?.category_id || '');
    const [categoryType, setCategoryType] = useState<string>(initialData?.category?.type || '');
    const [dailyCost, setDailyCost] = useState(0);

    useEffect(() => {
        if (categoryId) {
            const cat = CATEGORIES.find(c => c.id == categoryId);
            if (cat) {
                setCategoryType(cat.type);
                setDailyCost(cat.daily_cost);
            }
        }
    }, [categoryId]);

    const canPublish = isEdit || (dailyCost === 0) || (walletBalance >= dailyCost);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canPublish) return;

        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());

        // Basic conversions
        if (data.price) data.price = parseFloat(data.price);
        if (categoryId) data.category_id = parseInt(categoryId as string);

        // Image handling (simple URL for now)
        if (data.image_url) {
            data.images = [data.image_url];
        }

        try {
            const token = localStorage.getItem('token') || 'dummy_token';
            if (isEdit) {
                await api.listings.update(initialData.id, data, token);
            } else {
                await api.listings.create(data, token);
            }
            router.push('/tableau-de-bord/annonces');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl border space-y-4">
                <h3 className="text-lg font-semibold">Informations générales</h3>

                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Titre de l'annonce</label>
                        <input name="title" required defaultValue={initialData?.title} className="w-full border rounded-lg p-2" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Catégorie</label>
                        <select
                            name="category_id"
                            required
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full border rounded-lg p-2"
                            disabled={isEdit}
                        >
                            <option value="">Sélectionner...</option>
                            {CATEGORIES.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.daily_cost} crédits/j)</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Prix</label>
                        <div className="flex gap-2">
                            <input name="price" type="number" required defaultValue={initialData?.price} className="w-full border rounded-lg p-2" placeholder="0.00" />
                            <select name="price_unit" defaultValue="DH" className="border rounded-lg p-2 w-24">
                                <option value="DH">DH</option>
                                <option value="EUR">EUR</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Type de prix</label>
                        <select name="price_type" defaultValue={initialData?.price_type || 'daily'} className="w-full border rounded-lg p-2">
                            <option value="daily">Par jour</option>
                            <option value="hourly">Par heure</option>
                            <option value="mission">Par mission</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Ville</label>
                        <input name="location" defaultValue={initialData?.location} className="w-full border rounded-lg p-2" placeholder="Ex: Casablanca" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" rows={4} defaultValue={initialData?.description} className="w-full border rounded-lg p-2" />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">URL Image (Temp)</label>
                    <input name="image_url" defaultValue={initialData?.main_image} className="w-full border rounded-lg p-2" placeholder="https://..." />
                </div>
            </div>

            {/* Dynamic Category Fields */}
            {categoryType && (
                <div className="bg-white p-6 rounded-xl border space-y-4">
                    <h3 className="text-lg font-semibold">Détails spécifiques</h3>

                    {categoryType === 'car_rental' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Carburant</label>
                                <select name="fuel_type" defaultValue={initialData?.car?.fuel_type} className="w-full border rounded-lg p-2">
                                    <option value="">Sélectionner...</option>
                                    <option value="Essence">Essence</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Hybride">Hybride</option>
                                    <option value="Electrique">Électrique</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Boîte</label>
                                <select name="gearbox" defaultValue={initialData?.car?.gearbox} className="w-full border rounded-lg p-2">
                                    <option value="">Sélectionner...</option>
                                    <option value="Manuelle">Manuelle</option>
                                    <option value="Automatique">Automatique</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {categoryType === 'machinery' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Marque</label>
                                <input name="brand" defaultValue={initialData?.machinery?.brand} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Modèle</label>
                                <input name="model" defaultValue={initialData?.machinery?.model} className="w-full border rounded-lg p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tonnage</label>
                                <input name="tonnage" defaultValue={initialData?.machinery?.tonnage} className="w-full border rounded-lg p-2" />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Wallet Warning Logic */}
            {!isEdit && categoryId && (
                <WalletWarning
                    currentBalance={walletBalance}
                    dailyCost={dailyCost}
                    canPublish={canPublish}
                />
            )}

            <button
                type="submit"
                disabled={loading || !canPublish}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
                {loading ? 'Enregistrement...' : (isEdit ? 'Mettre à jour l\'annonce' : 'Publier l\'annonce')}
            </button>
        </form>
    );
}
