"use client";

import { useState } from 'react';
import { ListingImage } from '@/types/listing';
import { ImageOff } from 'lucide-react';

interface ListingGalleryProps {
    images?: ListingImage[];
    title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
    // Find main image or default to first
    const mainImage = images?.find(img => img.is_main) || (images && images.length > 0 ? images[0] : null);

    const [selectedImage, setSelectedImage] = useState<string | null>(
        mainImage ? mainImage.image_path : null
    );

    if (!images || images.length === 0) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl aspect-video flex flex-col items-center justify-center text-gray-400 border border-gray-200 shadow-inner relative overflow-hidden">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                <div className="bg-white p-6 rounded-full shadow-sm mb-4 relative z-10">
                    <ImageOff size={48} className="text-gray-300" />
                </div>
                <p className="font-semibold text-gray-500 relative z-10">Aucune image disponible</p>
                <p className="text-xs text-gray-400 mt-1 relative z-10">Cette annonce n'a pas de photos</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                {selectedImage ? (
                    <img
                        src={selectedImage}
                        alt={title}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement?.classList.add('fallback-active');
                        }}
                    />
                ) : null}

                {/* Fallback that sits behind the image (or shows if image is hidden/null) */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gray-50 -z-10 fallback-content border-2 border-dashed border-gray-200 m-2 rounded-lg`}>
                    <ImageOff className="text-gray-300 mb-2" size={32} />
                    <span className="text-xs text-gray-400 font-medium">Image non disponible</span>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img) => (
                        <button
                            key={img.id}
                            onClick={() => setSelectedImage(img.image_path)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${selectedImage === img.image_path ? 'border-primary' : 'border-transparent'
                                }`}
                        >
                            <img
                                src={img.image_path}
                                alt={`${title} thumbnail`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
