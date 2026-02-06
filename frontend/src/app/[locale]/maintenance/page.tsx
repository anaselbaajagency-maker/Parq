import { fetchSettings } from '@/lib/api';
import { ShieldAlert, Hammer, Wrench } from 'lucide-react';
import styles from './maintenance.module.css';

export const dynamic = 'force-dynamic';

export default async function MaintenancePage() {
    const settings = await fetchSettings();
    const message = settings?.maintenance_message || "We are currently improving our platform to serve you better. We'll be back shortly.";

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <Wrench size={40} strokeWidth={2.5} />
                </div>

                <h1 className={styles.title}>
                    Maintenance
                </h1>

                <p className={styles.message}>
                    {message}
                </p>

                <div className={styles.brand}>PARQ</div>
            </div>
        </div>
    );
}
