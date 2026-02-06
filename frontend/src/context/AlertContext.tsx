'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import Alert, { AlertType } from '../components/ui/Alert';

interface AlertItem {
    id: string;
    type: AlertType;
    message: string;
    title?: string;
}

interface AlertContextType {
    showAlert: (type: AlertType, message: string, title?: string, duration?: number) => void;
    removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
    const [alerts, setAlerts] = useState<AlertItem[]>([]);

    const removeAlert = useCallback((id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, []);

    const showAlert = useCallback((type: AlertType, message: string, title?: string, duration = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newAlert = { id, type, message, title };

        setAlerts(prev => [...prev, newAlert]);

        if (duration > 0) {
            setTimeout(() => {
                removeAlert(id);
            }, duration);
        }
    }, [removeAlert]);

    return (
        <AlertContext.Provider value={{ showAlert, removeAlert }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: '400px',
                width: '100%'
            }}>
                {alerts.map(alert => (
                    <Alert
                        key={alert.id}
                        type={alert.type}
                        title={alert.title}
                        message={alert.message}
                        onClose={() => removeAlert(alert.id)}
                    />
                ))}
            </div>
        </AlertContext.Provider>
    );
}

export function useAlert() {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
}
