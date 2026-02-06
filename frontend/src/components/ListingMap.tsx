"use client";

import { MapPin } from 'lucide-react';

interface ListingMapProps {
    location: string;
    className?: string;
}

export default function ListingMap({ location, className = "" }: ListingMapProps) {
    // Fallback if no specific location
    const query = encodeURIComponent(location || "Morocco");

    return (
        <div className={`rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex flex-col ${className}`}>
            <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-white">
                <MapPin className="text-primary" size={20} />
                <h3 className="font-semibold text-gray-900">Emplacement</h3>
            </div>
            <div className="relative w-full h-[300px] bg-gray-200">
                <iframe
                    width="100%"
                    height="100%"
                    id="gmap_canvas"
                    src={`https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                    frameBorder="0"
                    scrolling="no"
                    marginHeight={0}
                    marginWidth={0}
                    title="Listing Location"
                    className="absolute inset-0 w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                />
            </div>
        </div>
    );
}
