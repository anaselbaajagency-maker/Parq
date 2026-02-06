'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCategories, fetchCities, createListing, Category, City } from '@/lib/api';
import styles from './create.module.css';

export default function CreateListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [cities, setCities] = useState<City[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        price_unit: 'DH/day',
        type: 'rent',
        category_id: '',
        city_id: '',
        image: '',
        is_available: true
    });

    useEffect(() => {
        Promise.all([
            fetchCategories(),
            fetchCities()
        ]).then(([cats, cities]) => {
            setCategories(cats);
            setCities(cities);
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createListing({
                ...formData,
                price: Number(formData.price),
                // Map category_id to category for legacy support if needed, but backend uses category_id now
            });
            alert('Listing created successfully!');
            router.push('/admin'); // Redirect to admin dashboard
        } catch (error) {
            alert('Failed to create listing');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Listing</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Type</label>
                    <select name="type" value={formData.type} onChange={handleChange} className={styles.select}>
                        <option value="rent">Rent</option>
                        <option value="buy">Buy</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Category</label>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} required className={styles.select}>
                        <option value="">Select Category</option>
                        {categories.filter(c => c.type === formData.type).map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>City</label>
                    <select name="city_id" value={formData.city_id} onChange={handleChange} required className={styles.select}>
                        <option value="">Select City</option>
                        {cities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Unit</label>
                        <input
                            type="text"
                            name="price_unit"
                            value={formData.price_unit}
                            onChange={handleChange}
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Image URL</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        required
                        className={styles.input}
                    />
                </div>

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Creating...' : 'Create Listing'}
                </button>
            </form>
        </div>
    );
}
