export interface City {
    id: string;
    name: string;
    lat?: number;
    lng?: number;
}

export const cities: City[] = [
    { id: 'casablanca', name: 'Casablanca' },
    { id: 'rabat', name: 'Rabat' },
    { id: 'marrakech', name: 'Marrakech' },
    { id: 'tangier', name: 'Tangier' },
    { id: 'agadir', name: 'Agadir' },
    { id: 'fes', name: 'Fes' },
    { id: 'oujda', name: 'Oujda' },
];
