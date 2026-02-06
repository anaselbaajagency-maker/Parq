'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from '@/navigation';
import { fetchSettings } from '@/lib/api';

/**
 * MaintenanceGuard - Client-side companion to the middleware
 * 
 * The middleware handles the main blocking logic (server-side, before render).
 * This component handles the edge case where:
 * - User is on /maintenance page
 * - Admin turns OFF maintenance mode
 * - User should be redirected back to homepage
 */
export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isReady, setIsReady] = useState(false);

    // Check if we're on a maintenance-related path
    const isMaintenancePath = pathname === '/maintenance' || pathname.includes('maintenance') || pathname.includes('siyana');

    useEffect(() => {
        const checkMaintenanceStatus = async () => {
            // Only check if we're on the maintenance page
            if (isMaintenancePath) {
                try {
                    const settings = await fetchSettings();
                    const mode = settings?.maintenance_mode;
                    const isMaintenance = mode === true || mode === 'true' || mode === '1';

                    // If maintenance is OFF but user is on maintenance page, redirect home
                    if (!isMaintenance) {
                        router.push('/');
                        return;
                    }
                } catch (error) {
                    console.error('[MaintenanceGuard] Error checking status:', error);
                }
            }

            setIsReady(true);
        };

        checkMaintenanceStatus();
    }, [pathname, router]);

    // Show children immediately - middleware handles blocking
    // The isReady state is only for the maintenance page edge case
    if (isMaintenancePath) {
        return isReady ? <>{children}</> : null;
    }

    // For all other pages, render immediately (middleware already checked)
    return <>{children}</>;
}
