'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/lib/api';
import { X, LayoutGrid, HardHat, Truck, Bus, Users, Car, Wrench, Building } from 'lucide-react';
import styles from './admin-categories.module.css';

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Category>) => Promise<void>;
    category?: Category;
}

const ICONS: Record<string, any> = {
    LayoutGrid, HardHat, Truck, Bus, Users, Car, Wrench, Building
};

const ICON_NAMES = Object.keys(ICONS);

export default function CategoryDialog({ isOpen, onClose, onSave, category }: CategoryDialogProps) {
    const [formData, setFormData] = useState<Partial<Category>>({
        slug: '',
        name: '',
        name_fr: '',
        name_ar: '',
        type: 'rent',
        icon: 'LayoutGrid',
        description: '',
        daily_cost: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (category) {
                setFormData(category);
            } else {
                setFormData({
                    slug: '',
                    name: '',
                    name_fr: '',
                    name_ar: '',
                    type: 'rent',
                    icon: 'LayoutGrid',
                    description: '',
                    daily_cost: 0
                });
            }
            setError('');
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to save category. Make sure the ID is unique.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const SelectedIcon = ICONS[formData.icon || 'LayoutGrid'] || LayoutGrid;

    return (
        <div className={styles.dialogOverlay} onClick={onClose}>
            <div className={styles.dialogContent} onClick={e => e.stopPropagation()}>
                <div className={styles.dialogHeader}>
                    <h2 className={styles.dialogTitle}>
                        {category ? 'Edit Category' : 'Create New Category'}
                    </h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.dialogBody}>
                        {error && (
                            <div className={styles.errorAlert}>
                                {error}
                            </div>
                        )}

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Unique Slug</label>
                                <input
                                    type="text"
                                    required
                                    disabled={!!category}
                                    value={formData.slug || ''}
                                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                    className={`${styles.input} ${category ? styles.inputDisabled : ''}`}
                                    placeholder="e.g. construction"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Operation Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value as 'rent' | 'buy' })}
                                    className={styles.select}
                                >
                                    <option value="rent">Rental Service</option>
                                    <option value="buy">Sales / Purchase</option>
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name (French)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name_fr}
                                    onChange={e => {
                                        // Auto-fill internal name/slug from French name if empty
                                        const val = e.target.value;
                                        const updates: any = { name_fr: val };
                                        if (!formData.name) updates.name = val;
                                        setFormData({ ...formData, ...updates });
                                    }}
                                    className={styles.input}
                                    placeholder="e.g. Engins Lourds"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name (Arabic)</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name_ar}
                                    onChange={e => setFormData({ ...formData, name_ar: e.target.value })}
                                    className={`${styles.input} ${styles.textRight}`}
                                    placeholder="مثال: الآلات الثقيلة"
                                />
                            </div>
                        </div>

                        {/* SEO / Slugs */}
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>URL Slug (French)</label>
                                <input
                                    type="text"
                                    value={formData.slug_fr || ''}
                                    onChange={e => setFormData({ ...formData, slug_fr: e.target.value })}
                                    className={`${styles.input} ${styles.textSm}`}
                                    placeholder="e.g. engins-lourds"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>URL Slug (Arabic)</label>
                                <input
                                    type="text"
                                    value={formData.slug_ar || ''}
                                    onChange={e => setFormData({ ...formData, slug_ar: e.target.value })}
                                    className={`${styles.input} ${styles.textRight} ${styles.textSm}`}
                                    placeholder="مثال: alat-thaqila"
                                />
                            </div>
                        </div>

                        {/* Hidden/Internal English Name (synced with French for fallback) */}
                        <div className={styles.formGroup} style={{ display: 'none' }}>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Daily Cost (DH)</label>
                            <input
                                type="number"
                                min="0"
                                step="any"
                                value={formData.daily_cost || 0}
                                onChange={e => setFormData({ ...formData, daily_cost: parseFloat(e.target.value) })}
                                className={styles.input}
                                placeholder="Cost per day (e.g. 10.00)"
                            />
                            <p className={styles.textSm} style={{ marginTop: '4px', color: '#666' }}>Amount deducted from balance per day for active listings.</p>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category Icon</label>
                            <div className={`${styles.flex} ${styles.itemsCenter} ${styles.gap2}`}>
                                <div className={styles.iconPreview}>
                                    <SelectedIcon size={24} />
                                </div>
                                <select
                                    value={formData.icon}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    className={`${styles.select} ${styles.flex1}`}
                                >
                                    {ICON_NAMES.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description (French)</label>
                            <textarea
                                value={formData.description_fr}
                                onChange={e => setFormData({ ...formData, description_fr: e.target.value })}
                                className={styles.textarea}
                                placeholder="Description en Français..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Description (Arabic)</label>
                            <textarea
                                value={formData.description_ar}
                                onChange={e => setFormData({ ...formData, description_ar: e.target.value })}
                                className={`${styles.textarea} ${styles.textRight}`}
                                placeholder="وصف بالعربية..."
                            />
                        </div>

                        {/* Fallback/Internal Description (Hidden or Optional) */}
                        <div className={styles.formGroup} style={{ display: 'none' }}>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className={styles.dialogFooter}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.btnCancel}
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={styles.btnSave}
                        >
                            {isSubmitting ? 'Saving changes...' : (category ? 'Update Category' : 'Create Category')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
