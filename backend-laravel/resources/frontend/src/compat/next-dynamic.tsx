import React from 'react';

type DynamicImport<TProps> = () => Promise<{ default: React.ComponentType<TProps> }>;

interface DynamicOptions {
    ssr?: boolean;
    loading?: React.ComponentType;
}

export default function dynamic<TProps extends object>(
    importer: DynamicImport<TProps>,
    options?: DynamicOptions,
): React.ComponentType<TProps> {
    const LazyComponent = React.lazy(importer);
    const Loading = options?.loading;

    return function DynamicComponent(props: TProps) {
        return (
            <React.Suspense fallback={Loading ? <Loading /> : null}>
                <LazyComponent {...props} />
            </React.Suspense>
        );
    };
}
