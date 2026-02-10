'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { fetchCategories, fetchCities, createListing, Category, City, api } from '@/lib/api';
import { WalletBalance } from '@/types/wallet';
import { useAuthStore } from '@/lib/auth-store';
import { X, UploadCloud, Grid3X3, MapPin } from 'lucide-react';
import styles from './create.module.css';
import LowBalanceAlert from '@/components/wallet/LowBalanceAlert';
import { Link } from '@/navigation';

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

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
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
            router.push(`/${locale}/login`);
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

        if (!heroImage) {
            alert(t('label_image') + " (Hero) " + t('required_field'));
            return;
        }

        setLoading(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
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

            await createListing(data);

            alert(t('success_pending'));
            router.push('/tableau-de-bord/annonces');
        } catch (error) {
            alert(t('error'));
            console.error(error);
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
                                    <span>Cliquez pour télécharger l'image principale</span>
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setHeroImage(file);
                                            setHeroPreview(URL.createObjectURL(file));
                                        }
                                    }} className={styles.hiddenInput} required />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Additional Images Upload */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('label_image')}s (Galerie)</label>

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
                                        className={styles.hiddenInput}
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
