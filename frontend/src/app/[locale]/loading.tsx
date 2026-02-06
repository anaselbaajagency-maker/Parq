export default function Loading() {
    return (
        <div className="max-w-[1280px] mx-auto px-6 py-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-8"></div>

            {/* Hero/Upper Section Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="col-span-2 h-[400px] bg-gray-200 rounded-2xl"></div>
                <div className="col-span-1 h-[400px] bg-gray-200 rounded-2xl hidden md:block"></div>
            </div>

            {/* Content Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-3">
                        <div className="aspect-[4/3] bg-gray-200 rounded-xl w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
