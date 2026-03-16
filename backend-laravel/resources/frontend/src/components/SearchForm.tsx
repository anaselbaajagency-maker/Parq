"use client";

import styles from './SearchForm.module.css';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { fetchCities, City } from '@/lib/api';

export default function SearchForm() {
    const t = useTranslations('HomePage');
    const locale = useLocale();
    const [cities, setCities] = useState<City[]>([]);

    useEffect(() => {
        async function loadCities() {
            const data = await fetchCities();
            setCities(data);
        }
        loadCities();
    }, []);

    const getCityName = (city: City) => {
        if (locale === 'ar' && city.name_ar) return city.name_ar;
        if (locale === 'fr' && city.name_fr) return city.name_fr;
        return city.name;
    };

    return (
        <div className={styles.searchContainer}>
            <form className={styles.form}>
                {/* 1. Category */}
                <div className={styles.field}>
                    <label className={styles.label}>{t('category_label')}</label>
                    <select className={styles.select} defaultValue="">
                        <option value="" disabled>{t('category_label')}</option>
                        <option value="construction">{t('cat_btp')}</option>
                        <option value="tourist">{t('cat_tourist')}</option>
                        <option value="staff">{t('cat_staff')}</option>
                        <option value="driver">{t('cat_drivers')}</option>
                    </select>
                </div>

                {/* 2. City */}
                <div className={styles.field}>
                    <label className={styles.label}>{t('city_label')}</label>
                    <select className={styles.select} defaultValue="">
                        <option value="" disabled>{t('city_label')}</option>
                        {cities.map((city) => (
                            <option key={city.id} value={city.id}>
                                {getCityName(city)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 3. Keywords */}
                <div className={styles.field}>
                    <label className={styles.label}>Search</label>
                    <input type="text" placeholder={t('search_placeholder')} className={styles.input} />
                </div>

                {/* 4. Button */}
                <div className={styles.buttonContainer}>
                    <button type="submit" className={styles.button}>
                        <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <span className={styles.buttonText}>{t('search_btn')}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
