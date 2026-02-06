'use client';

import { useTranslations } from 'next-intl';
import { Link } from '../../../navigation';
import styles from './page.module.css';

export default function ListPage() {
    const t = useTranslations('Header');
    const tHome = useTranslations('HomePage');

    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>{t('list_item')} on Parq</h1>
                <p className={styles.subtitle}>
                    {tHome('subtitle')}
                </p>
                <div className={styles.actions}>
                    {/* For now, we redirect to home or a future create flow */}
                    <Link href="/create" className={styles.ctaButton}>
                        Start Listing Now
                    </Link>
                </div>
            </div>

            <div className={styles.features}>
                <div className={styles.featureCard}>
                    <h3>Reach more customers</h3>
                    <p>Connect with thousands of potential renters and buyers across Morocco.</p>
                </div>
                <div className={styles.featureCard}>
                    <h3>Secure Payments</h3>
                    <p>Guaranteed payouts and secure transaction handling.</p>
                </div>
                <div className={styles.featureCard}>
                    <h3>Manage Easily</h3>
                    <p>Professional dashboard to manage your fleet and bookings.</p>
                </div>
            </div>
        </div>
    );
}
