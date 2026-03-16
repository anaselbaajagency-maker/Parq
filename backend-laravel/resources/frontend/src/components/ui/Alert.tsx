import React from 'react';
import styles from './Alert.module.css';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
    type: AlertType;
    title?: string;
    message: string;
    onClose: () => void;
}

const icons = {
    success: <CheckCircle size={24} />,
    error: <AlertCircle size={24} />,
    warning: <AlertTriangle size={24} />,
    info: <Info size={24} />
};

const defaultTitles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
};

export default function Alert({ type, title, message, onClose }: AlertProps) {
    return (
        <div className={`${styles.alertContainer} ${styles[type]}`}>
            <div className={styles.icon}>
                {icons[type]}
            </div>
            <div className={styles.alertContent}>
                <h4 className={styles.alertTitle}>{title || defaultTitles[type]}</h4>
                <p className={styles.alertMessage}>{message}</p>
            </div>
            <button onClick={onClose} className={styles.closeButton}>
                <X size={18} />
            </button>
        </div>
    );
}
