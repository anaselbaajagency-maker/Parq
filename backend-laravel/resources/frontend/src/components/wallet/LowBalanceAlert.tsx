"use client";

import { AlertTriangle, Info, Zap } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '../../navigation';
import styles from './wallet.module.css';

interface LowBalanceAlertProps {
    daysRemaining: number;
    balance?: number;
    isCritical?: boolean;
}

export default function LowBalanceAlert({ daysRemaining, balance, isCritical }: LowBalanceAlertProps) {
    const t = useTranslations('Wallet');

    // Handle null/undefined values
    const days = daysRemaining ?? 0;

    // Strict check: If user has ANY positive balance (e.g. > 10 DH), hide critical alert
    // The user explicitly requested "if exest sold hide Solde critique"
    if (balance !== undefined && balance > 50) return null;

    // Fallback existing logic
    if (days > 5) return null;

    const severity = (days <= 1 || isCritical) ? 'critical' : 'warning';

    return (
        <div className={`${styles.alertContainer} ${severity === 'critical' ? styles.alertCritical : styles.alertWarning}`}>
            <div className={`${styles.alertIcon} ${severity === 'critical' ? styles.alertIconCritical : styles.alertIconWarning}`}>
                {severity === 'critical' ? <AlertTriangle size={22} /> : <Info size={22} />}
            </div>
            <div className={styles.alertContent}>
                <h4 className={`${styles.alertTitle} ${severity === 'critical' ? styles.alertTitleCritical : styles.alertTitleWarning}`}>
                    {severity === 'critical' ? t('alerts.critical_title') : t('alerts.low_title')}
                </h4>
                <p className={`${styles.alertText} ${severity === 'critical' ? styles.alertTextCritical : styles.alertTextWarning}`}>
                    {days <= 0
                        ? t('alerts.exhausted')
                        : t('alerts.remaining', { days: days })}
                </p>
                <Link
                    href="/tableau-de-bord/wallet"
                    className={`${styles.alertBtn} ${severity === 'critical' ? styles.alertBtnCritical : styles.alertBtnWarning}`}
                >
                    <Zap size={16} />
                    {t('actions.recharge_now')}
                </Link>
            </div>
        </div>
    );
}
