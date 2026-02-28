'use client';

import { useState, useEffect } from 'react';

import { useTranslations, useLocale } from 'next-intl';
import { fetchCategories, fetchCities, createListing, Category, City, api } from '@/lib/api';
import { WalletBalance } from '@/types/wallet';
import { useAuthStore } from '@/lib/auth-store';
import { X, UploadCloud, Grid3X3, MapPin } from 'lucide-react';
import styles from './create.module.css';
import LowBalanceAlert from '@/components/wallet/LowBalanceAlert';
import { Link, useRouter } from '@/navigation';

export default function CreateListingPage() {
    const t = useTranslations('Header.create_listing');
    const tCommon = useTranslations('Header');
    const tWallet = useTranslations('Wallet');
    const locale = useLocale();
    // ...
    const [wallet, setWallet] = useState<WalletBalance | null>(null);
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    // Drag & Drop State
    const [isDragging, setIsDragging] = useState(false);
    // images now stores File objects, not URL strings
    // Image State
    // images now stores File objects, not URL strings
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [heroImage, setHeroImage] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        title_ar: '',
        description: '',
        description_ar: '',
        price: '',
        price_unit: 'DH/day',
        type: 'rent',
        category_id: '',
        city_id: '',
        is_available: true
    });

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router, locale]);

    useEffect(() => {
        if (!isAuthenticated) return; // Don't fetch if not logged in

        Promise.all([
            fetchCategories(undefined, true), // activeOnly
            fetchCities(true), // activeOnly
            api.wallet.getBalance()
        ]).then(([cats, cities, walletData]) => {
            setCategories(cats);
            setCities(cities);
            setWallet(walletData);
        });

        // Cleanup object URLs on unmount
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [isAuthenticated]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle File Selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            processFiles(Array.from(e.target.files));
        }
    };

    // Handle Drag & Drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processFiles(Array.from(e.dataTransfer.files));
        }
    };

    const processFiles = (files: File[]) => {
        const remainingSlots = 5 - selectedFiles.length;
        if (remainingSlots <= 0) {
            alert(t('max_photos') || "Max 5 photos allowed.");
            return;
        }

        const newFiles = files.slice(0, remainingSlots);

        // Generate previews
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));

        setSelectedFiles(prev => [...prev, ...newFiles]);
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        // Revoke URL to avoid memory leaks
        URL.revokeObjectURL(previewUrls[index]);

        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!heroImage) {
            setError(t('label_image') + " (Hero) " + t('required_field'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Validate File Sizes (Client-side check to prevent PostTooLargeException)
        const MAX_TOTAL_SIZE_MB = 10; // Increased to match backend
        const MAX_TOTAL_SIZE_BYTES = MAX_TOTAL_SIZE_MB * 1024 * 1024;

        let totalSize = heroImage.size;
        selectedFiles.forEach(file => totalSize += file.size);

        if (totalSize > MAX_TOTAL_SIZE_BYTES) {
            setError(`La taille totale des images (${(totalSize / 1024 / 1024).toFixed(2)} MB) dépasse la limite de ${MAX_TOTAL_SIZE_MB} MB. Veuillez réduire la taille ou le nombre d'images.`);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('title_ar', formData.title_ar);
            data.append('description', formData.description);
            data.append('description_ar', formData.description_ar);
            data.append('price', formData.price);
            data.append('price_unit', formData.price_unit);
            data.append('type', formData.type);
            data.append('category_id', formData.category_id);
            data.append('city_id', formData.city_id);
            data.append('is_available', '1');
            data.append('user_id', user?.id?.toString() || '1');

            // Merge images where images[0] is hero
            const allImages = [heroImage, ...selectedFiles];
            allImages.forEach((file) => {
                data.append('images[]', file);
            });

            const newListing = await createListing(data);

            alert(t('success_pending'));
            if (newListing && newListing.id) {
                // @ts-ignore
                router.push(`/tableau-de-bord/annonces/edit/${newListing.id}`);
            } else {
                router.push('/tableau-de-bord/annonces');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || t('error'));
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    };

    // Filter categories by selected type
    const filteredCategories = categories.filter(c => c.type === formData.type);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1 className={styles.title}>{t('title')}</h1>
                    <p className={styles.subtitle}>{tCommon('list_item')}</p>
                    {/* DEV ONLY: Demo Fill Button */}
                    <button
                        type="button"
                        onClick={() => setFormData({
                            title: 'Tracteur Caterpillar D6',
                            title_ar: 'جرافة كاتربيلر D6',
                            description: 'Tracteur en excellent état, peu servi. Idéal pour travaux agricoles.',
                            description_ar: 'جرافة في حالة ممتازة، مسخ دمة قليلاً. مثالية للأعمال الزراعية.',
                            price: '1500',
                            price_unit: 'DH/jour',
                            type: 'rent',
                            category_id: categories.length > 0 ? categories[0].id.toString() : '',
                            city_id: cities.length > 0 ? cities[0].id.toString() : '',
                            is_available: true
                        })}
                        className="mt-2 text-xs text-gray-400 underline hover:text-gray-600"
                    >
                        [DEV] Remplir Demo
                    </button>
                </div>

                {wallet && wallet.days_remaining <= 5 && (
                    <div className="mb-6">
                        <LowBalanceAlert
                            daysRemaining={wallet.days_remaining}
                            balance={wallet.balance}
                            isCritical={wallet.critical_balance_warning}
                        />
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {error && (
                        <div className={styles.errorAlert}>
                            {error}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_title')}</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder={t('placeholder_title')}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_title_ar')}</label>
                        <input
                            type="text"
                            name="title_ar"
                            value={formData.title_ar}
                            onChange={handleChange}
                            className={styles.input}
                            placeholder={t('placeholder_title_ar')}
                            dir="rtl"
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={`${styles.col} ${styles.formGroup}`}>
                            <label className={styles.label}>{t('label_type')}</label>
                            <select name="type" value={formData.type} onChange={handleChange} className={styles.select}>
                                <option value="rent">{tCommon('rent')}</option>
                                <option value="buy">{tCommon('buy')}</option>
                            </select>
                        </div>
                        <div className={`${styles.col} ${styles.formGroup}`}>
                            <label className={styles.label}>{t('label_category')}</label>
                            <div className={styles.selectWrapper}>
                                <Grid3X3 className={styles.selectIcon} />
                                <select name="category_id" value={formData.category_id} onChange={handleChange} required className={`${styles.select} ${styles.selectWithIcon}`}>
                                    <option value="">{t('select_category')}</option>
                                    {filteredCategories.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {locale === 'ar' && c.name_ar ? c.name_ar
                                                : locale === 'fr' && c.name_fr ? c.name_fr
                                                    : c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_city')}</label>
                        <div className={styles.selectWrapper}>
                            <MapPin className={styles.selectIcon} />
                            <select name="city_id" value={formData.city_id} onChange={handleChange} required className={`${styles.select} ${styles.selectWithIcon}`}>
                                <option value="">{t('select_city')}</option>
                                {cities.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {locale === 'ar' && c.name_ar ? c.name_ar
                                            : locale === 'fr' && c.name_fr ? c.name_fr
                                                : c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_price')} (DH/jour)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className={styles.input}
                            placeholder={t('placeholder_price') || "0"}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_description')}</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_description_ar')}</label>
                        <textarea
                            name="description_ar"
                            value={formData.description_ar}
                            onChange={handleChange}
                            rows={4}
                            className={styles.textarea}
                            dir="rtl"
                        />
                    </div>

                    {/* Hero Image Upload */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Image Principale (Hero) {t('required_field')}</label>
                        <div className={styles.imageUploadArea}>
                            {heroPreview ? (
                                <div className={styles.imagePreviewContainer}>
                                    <img src={heroPreview} alt="Hero preview" className={styles.imagePreview} />
                                    <button type="button" onClick={() => { setHeroImage(null); setHeroPreview(null); }} className={styles.removeImageBtn}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className={styles.uploadLabel}>
                                    <UploadCloud size={24} />
                                    <span>Cliquez pour télécharger l&apos;image principale</span>
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setHeroImage(file);
                                            setHeroPreview(URL.createObjectURL(file));
                                        }
                                    }} style={{ display: 'none' }} required />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Additional Images Upload */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_image')} (Galerie)</label>

                        <div className={styles.imagesGrid}>
                            {/* New images */}
                            {previewUrls.map((url, index) => (
                                <div key={index} className={styles.imagePreviewContainer}>
                                    <img src={url} alt={`Preview ${index + 1}`} className={styles.imagePreview} />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className={styles.removeImageBtn}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            {/* Add more button */}
                            {selectedFiles.length < 5 && (
                                <label className={styles.addImageLabel}>
                                    <Grid3X3 size={24} />
                                    <span>+ Ajouter</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileSelect}
                                        style={{ display: 'none' }}
                                        disabled={selectedFiles.length >= 5}
                                    />
                                </label>
                            )}
                        </div>
                        <p className={styles.helperText}>{selectedFiles.length}/5 photos supplémentaires</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || (wallet ? wallet.days_remaining <= 0 : false)}
                        className={`${styles.submitBtn} ${(wallet && wallet.days_remaining <= 0) ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                    >
                        {loading ? t('btn_creating') : t('btn_create')}
                    </button>

                    {wallet && wallet.days_remaining <= 0 && (
                        <p className="mt-4 text-center text-sm font-bold text-red-600 animate-pulse">
                            {tWallet('alerts.exhausted')}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
}
