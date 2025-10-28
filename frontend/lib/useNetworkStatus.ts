import { useState, useEffect } from 'react';

interface NetworkStatus {
    isOnline: boolean;
    connectionType?: string;
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
}

export function useNetworkStatus(): NetworkStatus {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
    });

    useEffect(() => {
        if (typeof navigator === 'undefined') return;

        const updateNetworkStatus = () => {
            const connection = (navigator as any).connection ||
                (navigator as any).mozConnection ||
                (navigator as any).webkitConnection;

            setNetworkStatus({
                isOnline: navigator.onLine,
                connectionType: connection?.type,
                effectiveType: connection?.effectiveType,
                downlink: connection?.downlink,
                rtt: connection?.rtt
            });
        };

        // Initial check
        updateNetworkStatus();

        // Listen for online/offline events
        window.addEventListener('online', updateNetworkStatus);
        window.addEventListener('offline', updateNetworkStatus);

        // Listen for connection changes (if supported)
        if ((navigator as any).connection) {
            (navigator as any).connection.addEventListener('change', updateNetworkStatus);
        }

        return () => {
            window.removeEventListener('online', updateNetworkStatus);
            window.removeEventListener('offline', updateNetworkStatus);

            if ((navigator as any).connection) {
                (navigator as any).connection.removeEventListener('change', updateNetworkStatus);
            }
        };
    }, []);

    return networkStatus;
}

export function useSlowConnection(): boolean {
    const networkStatus = useNetworkStatus();

    // Consider connection slow if:
    // - Offline
    // - Effective type is 2g or slow-2g
    // - Downlink is less than 1 Mbps
    // - RTT is greater than 1000ms
    return !networkStatus.isOnline ||
        networkStatus.effectiveType === '2g' ||
        networkStatus.effectiveType === 'slow-2g' ||
        (networkStatus.downlink !== undefined && networkStatus.downlink < 1) ||
        (networkStatus.rtt !== undefined && networkStatus.rtt > 1000);
}
