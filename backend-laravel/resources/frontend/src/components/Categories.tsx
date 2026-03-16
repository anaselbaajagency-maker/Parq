"use client";

import styles from './Categories.module.css';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// Simple Icons Components
const IconConstruction = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
        <path d="M10 22c-1.1 0-2-.9-2-2h4c0 1.1-.9 2-2 2z" />
        <path d="M2 12h20" />
        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
        <rect x="4" y="2" width="16" height="10" rx="2" />
        <path d="M8 2v10" />
        <path d="M16 2v10" />
    </svg>
); // Placeholder for Excavator -> Using a generic construction-like shape or stick to "Truck"
// Actually let's use a Truck/Tractor shape
const IconExcavator = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
        <path d="M2 17h16" />
        <path d="M4 17l0-6h11l0 6" />
        <path d="M12 11v6" />
        <path d="M15 11l4-4l-3-3" />
        <circle cx="5.5" cy="17.5" r="2.5" />
        <circle cx="15.5" cy="17.5" r="2.5" />
    </svg>
);

const IconBus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
        <rect x="2" y="6" width="20" height="11" rx="2" />
        <path d="M4 17v4" />
        <path d="M20 17v4" />
        <path d="M2 11h20" />
        <path d="M7 11v-5" />
        <path d="M12 11v-5" />
        <path d="M17 11v-5" />
    </svg>
);

const IconStaff = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const IconSteering = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v10" />
        <path d="M12 12l8.5 5" />
        <path d="M12 12l-8.5 5" />
    </svg>
);

const IconMarket = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
        <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
    </svg>
);

const IconBusiness = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.svgIcon}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);

export default function Categories({ locale, displayMode = 'all' }: { locale: string; displayMode?: 'rent' | 'buy' | 'all' }) {
    const t = useTranslations('HomePage');

    const rentalCategories = [
        { id: 'construction', label: 'cat_construction', desc: 'cat_construction_desc', icon: <IconExcavator /> },
        { id: 'tourist', label: 'cat_tourist', desc: 'cat_tourist_desc', icon: <IconBus /> },
        { id: 'staff', label: 'cat_staff', desc: 'cat_staff_desc', icon: <IconStaff /> },
        { id: 'driver', label: 'cat_driver', desc: 'cat_driver_desc', icon: <IconSteering /> },
    ];

    const salesCategories = [
        { id: 'machinery', label: 'cat_sales_machinery', desc: 'cat_sales_machinery_desc', icon: <IconMarket /> },
        { id: 'business', label: 'cat_sales_business', desc: 'cat_sales_business_desc', icon: <IconBusiness /> },
    ];

    return (
        <section className={styles.section}>
            {(displayMode === 'all' || displayMode === 'rent') && (
                <div className={styles.group}>
                    <h3 className={styles.groupTitle}>{t('group_rental')}</h3>
                    <div className={styles.grid}>
                        {rentalCategories.map((cat) => (
                            <Link href={`/rent/${cat.id}`} key={cat.id} className={`${styles.card} ${styles.rentalCard}`}>
                                <div className={styles.iconWrapper}>
                                    {cat.icon}
                                </div>
                                <div className={styles.textWrapper}>
                                    <span className={styles.label}>{t(cat.label)}</span>
                                    <span className={styles.desc}>{t(cat.desc)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {(displayMode === 'all' || displayMode === 'buy') && (
                <div className={styles.group}>
                    <h3 className={styles.groupTitle}>{t('group_sales')}</h3>
                    <div className={styles.grid}>
                        {salesCategories.map((cat) => (
                            <Link href={`/buy/${cat.id}`} key={cat.id} className={`${styles.card} ${styles.salesCard}`}>
                                <div className={styles.iconWrapper}>
                                    {cat.icon}
                                </div>
                                <div className={styles.textWrapper}>
                                    <span className={styles.label}>{t(cat.label)}</span>
                                    <span className={styles.desc}>{t(cat.desc)}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
