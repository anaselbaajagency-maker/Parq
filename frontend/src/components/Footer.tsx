'use client';

import { useTranslations } from 'next-intl';
import styles from './Footer.module.css';
import { Link, usePathname } from '../navigation';
import { useEffect, useState } from 'react';
import { fetchSettings, Settings } from '@/lib/api';

export default function Footer({ locale }: { locale?: string }) {
    const t = useTranslations('Footer');
    const pathname = usePathname();
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        let isMounted = true;

        fetchSettings()
            .then((data) => {
                if (isMounted) {
                    setSettings(data);
                }
            })
            .catch((error) => {
                console.warn('[Footer] settings fetch failed:', error);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const isDashboard = pathname.includes('/tableau-de-bord');
    const isAdmin = pathname.startsWith('/admin');
    const isAuthPage = pathname.includes('/login') || pathname.includes('/connexion') || pathname.includes('/dukhul') ||
        pathname.includes('/register') || pathname.includes('/inscription') || pathname.includes('/tasjil') ||
        pathname.includes('/forgot-password') || pathname.includes('/mot-de-passe-oublie') || pathname.includes('/nisyan-kalimat-sir');

    const shouldShowFooter = !(isAdmin || isDashboard || isAuthPage);

    // Default or dynamic
    const defaultCopyright = `© ${new Date().getFullYear()} Parq. ${t('rights')}`;
    const copyright = settings?.footer_copyright_text || defaultCopyright;

    return (
        <>
            {shouldShowFooter && (
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
                                <Link href="/" locale="fr" className={styles.langLink}>Français</Link>
                                <span className={styles.separator}>|</span>
                                <Link href="/" locale="ar" className={styles.langLink}>العربية</Link>
                            </div>
                        </div>
                    </div>
                </footer>
            )}
        </>
    );
}
