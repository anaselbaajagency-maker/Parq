'use client';

import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';
import { usePathname } from '../navigation';
import { useEffect, useState } from 'react';
import { fetchSettings, Settings } from '@/lib/api';

export default function Footer({ locale }: { locale?: string }) {
    const t = useTranslations('Footer');
    const pathname = usePathname();
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        fetchSettings().then(setSettings);
    }, []);

    const isDashboard = pathname.includes('/dashboard') || pathname.includes('/tableau-de-bord');
    const isAdmin = pathname.startsWith('/admin');
    const isAuthPage = pathname.includes('/login') || pathname.includes('/connexion') || pathname.includes('/dukhul') ||
        pathname.includes('/register') || pathname.includes('/inscription') || pathname.includes('/tasjil') ||
        pathname.includes('/forgot-password') || pathname.includes('/mot-de-passe-oublie') || pathname.includes('/nisyan-kalimat-sir');

    if (isAdmin || isDashboard || isAuthPage) return null;

    // Default or dynamic
    const defaultCopyright = `© ${new Date().getFullYear()} Parq. ${t('rights')}`;
    // If settings has text, use it. If it's empty string, fall back to default? Or allow empty?
    // Usually admin wants to OVERRIDE.
    // settings?.footer_copyright_text might be undefined or string.
    const copyright = settings?.footer_copyright_text || defaultCopyright;

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.topRow}>
                    <div className={styles.copyright}>
                        {copyright}
                    </div>
                </div>

                <div className={styles.bottomRow}>
                    <div className={styles.links}>
                        <a href="#">{t('terms')}</a>
                        <a href="#">{t('privacy')}</a>
                        <a href="#">{t('sitemap')}</a>
                    </div>

                    <div className={styles.languageSelect}>
                        <a href="/en" className={styles.langLink}>English</a>
                        <span className={styles.separator}>|</span>
                        <a href="/fr" className={styles.langLink}>Français</a>
                        <span className={styles.separator}>|</span>
                        <a href="/ar" className={styles.langLink}>العربية</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
