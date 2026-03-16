import { ReactNode } from 'react';

// We can't import React components (icons) directly into a pure data file effectively if we want to keep it serializable/clean
// But for now, let's keep it simple and maybe store icon keys or references.
// To avoid complex dependency cycles or issues, we'll store static data here.
// For icons, we might need a mapping in the component.

export interface Category {
    id: string;
    label: string;
    desc: string;
    type: 'rent' | 'buy';
}

export const rentalCategories: Category[] = [
    { id: 'construction', label: 'cat_construction', desc: 'cat_construction_desc', type: 'rent' },
    { id: 'transport', label: 'cat_transport', desc: 'cat_transport_desc', type: 'rent' }, // Added transport which was missing in Categories.tsx but present in Listings
    { id: 'tourist', label: 'cat_tourist', desc: 'cat_tourist_desc', type: 'rent' },
    { id: 'staff', label: 'cat_staff', desc: 'cat_staff_desc', type: 'rent' },
    { id: 'driver', label: 'cat_driver', desc: 'cat_driver_desc', type: 'rent' },
];

export const salesCategories: Category[] = [
    { id: 'machinery', label: 'cat_sales_machinery', desc: 'cat_sales_machinery_desc', type: 'buy' },
    { id: 'business', label: 'cat_sales_business', desc: 'cat_sales_business_desc', type: 'buy' },
];

export const allCategories = [...rentalCategories, ...salesCategories];
