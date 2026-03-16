'use client';

import { useEffect, useState } from 'react';
import { fetchSettings, Settings } from '@/lib/api';
import { ShieldAlert, Hammer, Wrench } from 'lucide-react';
import styles from './maintenance.module.css';

export default function MaintenanceClient() {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        fetchSettings().then(setSettings).catch(console.error);
    }, []);

    const maintenanceTitle = (settings as any)?.maintenance_title || 'Site en Maintenance';
    const maintenanceMessage = (settings as any)?.maintenance_message || 'Nous effectuons actuellement des mises à jour pour améliorer votre expérience. Nous serons de retour très bientôt.';

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.iconWrapper}>
                    <Wrench size={64} className={styles.icon} />
                    <div className={styles.iconBadge}>
                        <Hammer size={24} />
                    </div>
                </div>

                <h1 className={styles.title}>{maintenanceTitle}</h1>

                <p className={styles.message}>
                    {maintenanceMessage}
                </p>

                <div className={styles.status}>
                    <div className={styles.statusDot}></div>
                    <span>Maintenance en cours</span>
                </div>

                <div className={styles.footer}>
                    <p>© {new Date().getFullYear()} Parq via Jaspe rs. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
