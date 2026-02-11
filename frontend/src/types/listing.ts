// Force deployment update
export type ListingStatus = 'active' | 'pending' | 'hidden' | 'expired' | 'rejected' | 'inactive' | 'paused';
export type ListingPriceType = 'daily' | 'hourly' | 'mission' | 'call';

export interface ListingImage {
    id: number;
    image_path: string;
    is_main: boolean;
    sort_order: number;
}

export interface Category {
    id: number;
    name: string;
    name_ar?: string;
    name_fr?: string;
    slug: string;
    slug_ar?: string;
    slug_fr?: string;
    type: string;
    icon: string;
    daily_cost: number;
    is_active?: boolean | number;
    description?: string;
    description_fr?: string;
    description_ar?: string;
    homepage_order?: number;
    show_on_homepage: boolean | number;
    listing_count?: number;
}

export interface City {
    id: number;
    name: string;
    name_ar?: string;
    name_fr?: string;
    slug: string;
    region?: string;
    is_active?: boolean | number;
}

export interface Settings {
    hero_title_ar?: string;
    hero_title_fr?: string;
    hero_highlight_ar?: string;
    hero_highlight_fr?: string;
    hero_subtitle_ar?: string;
    hero_subtitle_fr?: string;
    homepage_listings_count?: number | string;
    header_show_language_switcher?: boolean;
    header_show_login_button?: boolean;
    maintenance_mode?: boolean | string | number;
    maintenance_message?: string;
    footer_copyright_text?: string;
    footer_show_social_links?: boolean | string | number;
    homepage_categories?: any[];
}

export interface ListingCar {
    fuel_type?: string;
    gearbox?: string;
    seats?: number;
}

export interface ListingMachinery {
    brand?: string;
    model?: string;
    tonnage?: string;
    year?: number;
    with_driver?: boolean;
}

export interface ListingTransport {
    capacity?: number;
    air_conditioning?: boolean;
    usage_type?: string;
}

export interface ListingDriver {
    license_type?: string;
    experience_years?: number;
    is_available?: boolean;
}

export interface Listing {
    id: number;
    user_id: number;
    category_id: number;
    city_id: number;
    title: string;
    title_fr?: string;
    title_ar?: string;
    slug: string;
    description: string;
    description_fr?: string;
    description_ar?: string;
    price: number;
    price_unit: string;
    price_type: ListingPriceType;
    type?: 'rent' | 'buy';
    // location?: string; // Removed in favor of city relationship
    latitude?: number;
    longitude?: number;
    is_available: boolean;
    is_featured: boolean;
    status: ListingStatus;
    views: number;
    created_at: string;
    published_at?: string;
    daily_cost: number;

    // Relations
    category?: Category;
    city?: City;
    images?: ListingImage[];
    // Compatibility & Derived
    main_image?: string;
    image?: string; // Alias for main_image in older components
    image_hero?: string; // From backend
    rating?: number;
    is_favorited?: boolean;

    // Specifics
    car?: ListingCar;
    machinery?: ListingMachinery;
    transport?: ListingTransport;
    driver?: ListingDriver;

    // Expanded Fields (often joined from backend)
    user?: {
        id: number;
        full_name: string;
        avatar?: string;
        role?: string;
        phone?: string;
        email?: string;
        created_at?: string;
    };
    user_name?: string;
    user_avatar?: string;
    user_role?: string;
    user_since?: string;
    features?: string | string[]; // Can be JSON string or array

    // Flattened Attributes (sometimes returned directly)
    brand?: string;
    model?: string;
    year?: number;
    fuel?: string;
    power?: string;
    condition?: string;
    category_name?: string;
    category_slug?: string;
}

export interface DashboardStats {
    active_listings: number;
    listings_trend?: string;
    total_views: number;
    views_trend?: string;
    messages: number;
    messages_trend?: string;
    balance: number;
}

export interface DashboardActivity {
    id: number | string;
    title: string;
    time: string;
    type: 'view' | 'message' | 'listing' | 'wallet';
}

export interface PerformanceData {
    period: string;
    data: {
        day: string;
        views: number;
        percentage: number;
    }[];
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}
