'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { fetchCategories, fetchCities, fetchListing, updateListing, Category, City, Listing } from '@/lib/api';
import { Grid3X3, MapPin, Loader2, ArrowLeft, Upload, X, ImageIcon } from 'lucide-react';
import styles from './edit.module.css';
import { Link, useRouter } from '../../../../../../navigation';
import Image from 'next/image';

export default function EditListingClient({ id }: { id: string }) {
    const t = useTranslations('Header.create_listing'); // Reuse create translations
    const tCommon = useTranslations('Header');
    const locale = useLocale();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [listing, setListing] = useState<Listing | null>(null);

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

    // Image State
    const [heroImage, setHeroImage] = useState<File | null>(null);
    const [heroPreview, setHeroPreview] = useState<string | null>(null);
    const [additionalImages, setAdditionalImages] = useState<File[]>([]);
    const [additionalPreviews, setAdditionalPreviews] = useState<string[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cats, citiesData, listingData] = await Promise.all([
                    fetchCategories(),
                    fetchCities(),
                    fetchListing(id)
                ]);

                setCategories(cats);
                setCities(citiesData);

                if (listingData) {
                    setListing(listingData);
                    setFormData({
                        title: listingData.title || '',
                        description: listingData.description || '',
                        price: listingData.price?.toString() || '',
                        price_unit: listingData.price_unit || 'DH/day',
                        type: listingData.type as 'rent' | 'buy' || 'rent',
                        category_id: listingData.category_id?.toString() || '',
                        city_id: listingData.city_id?.toString() || '',
                        is_available: !!listingData.is_available
                    });
                    // Set existing hero image preview
                    const heroUrl = listingData.image_hero || listingData.main_image;
                    if (heroUrl) {
                        setHeroPreview(heroUrl);
                    }
                    // Set existing gallery images
                    if (listingData.images && listingData.images.length > 0) {
                        const imgPaths = listingData.images.map((img: any) => img.image_path || img);
                        setExistingImages(imgPaths);
                    }
                }
            } catch (error) {
                console.error('Failed to load listing data', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('price_unit', formData.price_unit);
            data.append('type', formData.type);
            data.append('category_id', formData.category_id);
            data.append('city_id', formData.city_id);
            data.append('is_available', formData.is_available ? '1' : '0');
            data.append('_method', 'PUT'); // Laravel method spoofing for FormData

            if (heroImage) {
                data.append('image_hero', heroImage);
            }

            additionalImages.forEach((file, index) => {
                data.append(`images[${index}]`, file);
            });

            const updated = await updateListing(id, data);
            if (updated) {
                alert(t('success_pending') || 'Listing updated successfully');
                router.push('/tableau-de-bord/annonces');
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            alert(t('error') || 'An error occurred');
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const handleHeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setHeroImage(file);
            setHeroPreview(URL.createObjectURL(file));
        }
    };

    const handleAdditionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            setAdditionalImages(prev => [...prev, ...files]);
            const newPreviews = files.map(f => URL.createObjectURL(f));
            setAdditionalPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeAdditionalImage = (index: number) => {
        setAdditionalImages(prev => prev.filter((_, i) => i !== index));
        setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
    };

    if (loading) {
        return (
            <div className={styles.container} style={{ height: '50vh', alignItems: 'center' }}>
                <Loader2 className="animate-spin" size={32} />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className={styles.container}>
                <div className={styles.card} style={{ textAlign: 'center' }}>
                    <h3>Listing not found</h3>
                    <Link href="/tableau-de-bord/annonces">Back to Listings</Link>
                </div>
            </div>
        );
    }

    // Filter categories by selected type
    const filteredCategories = categories.filter(c => c.type === formData.type);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.backLinkWrapper}>
                        <Link href="/tableau-de-bord/annonces" className={styles.backLink}>
                            <ArrowLeft size={20} /> Back
                        </Link>
                    </div>
                    <h1 className={styles.title}>Edit Listing</h1>
                    <p className={styles.subtitle}>{listing.title}</p>
                </div>

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
                        <label className={styles.label}>{t('label_price')} (DH)</label>
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
                        <label className={styles.label}>Image Principale (Hero)</label>
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
                                    <Upload size={24} />
                                    <span>Cliquez pour télécharger l'image principale</span>
                                    <input type="file" accept="image/*" onChange={handleHeroChange} className={styles.hiddenInput} />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Additional Images Upload */}
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Images Additionnelles</label>
                        <div className={styles.imagesGrid}>
                            {/* Existing images */}
                            {existingImages.map((img, idx) => (
                                <div key={`existing-${idx}`} className={styles.imagePreviewContainer}>
                                    <img src={img} alt={`Existing ${idx + 1}`} className={styles.imagePreview} />
                                </div>
                            ))}
                            {/* New images */}
                            {additionalPreviews.map((preview, idx) => (
                                <div key={idx} className={styles.imagePreviewContainer}>
                                    <img src={preview} alt={`Preview ${idx + 1}`} className={styles.imagePreview} />
                                    <button type="button" onClick={() => removeAdditionalImage(idx)} className={styles.removeImageBtn}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            {/* Add more button */}
                            <label className={styles.addImageLabel}>
                                <ImageIcon size={24} />
                                <span>+ Ajouter</span>
                                <input type="file" accept="image/*" multiple onChange={handleAdditionalChange} className={styles.hiddenInput} />
                            </label>
                        </div>
                    </div>

                    <button type="submit" disabled={saving} className={styles.submitBtn}>
                        {saving ? t('saving') || 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
