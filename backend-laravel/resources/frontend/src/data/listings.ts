export interface Listing {
    id: number;
    title: string;
    location: string;
    price: string;
    rating: number;
    image?: string | null;
    tag?: string;
    categoryId: string;
    type: 'rent' | 'buy';
}

export const listings: Listing[] = [
    // Construction (Rent)
    { id: 1, title: 'CAT 320 Excavator', location: 'Casablanca', price: '2,500 DH', rating: 4.8, image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800', tag: 'Top Rated', categoryId: 'construction', type: 'rent' },
    { id: 2, title: 'JCB Backhoe Loader', location: 'Rabat', price: '1,800 DH', rating: 4.6, image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800', categoryId: 'construction', type: 'rent' },
    { id: 3, title: 'Bobcat Skid Steer', location: 'Tangier', price: '1,200 DH', rating: 4.9, image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800', tag: 'New', categoryId: 'construction', type: 'rent' },
    { id: 4, title: 'Tower Crane', location: 'Marrakech', price: '5,000 DH', rating: 5.0, image: 'https://images.unsplash.com/photo-1599933393960-a22fb1428256?auto=format&fit=crop&q=80&w=800', categoryId: 'construction', type: 'rent' },
    { id: 101, title: 'Bulldozer D8', location: 'Agadir', price: '3,500 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1579601057639-65565bb919a2?auto=format&fit=crop&q=80&w=800', categoryId: 'construction', type: 'rent' },
    { id: 102, title: 'Concrete Mixer', location: 'Fes', price: '1,500 DH', rating: 4.5, image: 'https://images.unsplash.com/photo-1616790937662-75ca46261c47?auto=format&fit=crop&q=80&w=800', categoryId: 'construction', type: 'rent' },

    // Transport (Rent)
    { id: 5, title: 'Mercedes Actros', location: 'Agadir', price: '3,000 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', categoryId: 'transport', type: 'rent' },
    { id: 6, title: 'Volvo FH16', location: 'Fes', price: '3,200 DH', rating: 4.9, image: 'https://images.unsplash.com/photo-1586154684947-2cb6394bf342?auto=format&fit=crop&q=80&w=800', tag: 'Premium', categoryId: 'transport', type: 'rent' },
    { id: 7, title: 'Scania R-Series', location: 'Oujda', price: '2,800 DH', rating: 4.5, image: 'https://images.unsplash.com/photo-1565514020176-db711978d30e?auto=format&fit=crop&q=80&w=800', categoryId: 'transport', type: 'rent' },
    { id: 103, title: 'MAN TGX', location: 'Casablanca', price: '2,900 DH', rating: 4.6, image: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&q=80&w=800', categoryId: 'transport', type: 'rent' },
    { id: 104, title: 'DAF XF', location: 'Tangier', price: '2,700 DH', rating: 4.4, image: 'https://images.unsplash.com/photo-1605218427306-6354db696fc9?auto=format&fit=crop&q=80&w=800', categoryId: 'transport', type: 'rent' },
    { id: 105, title: 'Renault T-Range', location: 'Rabat', price: '2,600 DH', rating: 4.3, image: 'https://images.unsplash.com/photo-1596898822582-84950e38605c?auto=format&fit=crop&q=80&w=800', categoryId: 'transport', type: 'rent' },

    // Tourist (Rent)
    { id: 8, title: 'Luxury Coach Bus', location: 'Marrakech', price: '4,000 DH', rating: 4.9, image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800', tag: 'Luxury', categoryId: 'tourist', type: 'rent' },
    { id: 9, title: 'Mercedes Sprinter', location: 'Casablanca', price: '1,500 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&q=80&w=800', categoryId: 'tourist', type: 'rent' },
    { id: 10, title: 'Toyota Coaster', location: 'Agadir', price: '1,200 DH', rating: 4.5, image: 'https://images.unsplash.com/photo-1620882103348-7711d95ee7fa?auto=format&fit=crop&q=80&w=800', categoryId: 'tourist', type: 'rent' },
    { id: 106, title: 'VIP Van', location: 'Rabat', price: '2,000 DH', rating: 4.8, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=800', categoryId: 'tourist', type: 'rent' },
    { id: 107, title: 'Tourist Minibus', location: 'Tangier', price: '1,100 DH', rating: 4.4, image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800', categoryId: 'tourist', type: 'rent' },
    { id: 108, title: 'Safari Jeep', location: 'Merzouga', price: '1,800 DH', rating: 5.0, image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&q=80&w=800', categoryId: 'tourist', type: 'rent' },

    // Staff (Rent)
    { id: 11, title: 'Certified Electrician', location: 'Casablanca', price: '300 DH', rating: 4.8, image: 'https://images.unsplash.com/photo-1621905476407-5b2a25950ba6?auto=format&fit=crop&q=80&w=800', tag: 'Certified', categoryId: 'staff', type: 'rent' },
    { id: 12, title: 'Professional Plumber', location: 'Rabat', price: '250 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=800', categoryId: 'staff', type: 'rent' },
    { id: 13, title: 'Site Supervisor', location: 'Tangier', price: '800 DH', rating: 4.9, image: 'https://images.unsplash.com/photo-1504381270273-05b630113c1c?auto=format&fit=crop&q=80&w=800', categoryId: 'staff', type: 'rent' },
    { id: 109, title: 'Mason Team', location: 'Marrakech', price: '1,000 DH', rating: 4.6, image: 'https://images.unsplash.com/photo-1590579491624-9f2d152a537f?auto=format&fit=crop&q=80&w=800', categoryId: 'staff', type: 'rent' },
    { id: 110, title: 'Carpenter', location: 'Fes', price: '400 DH', rating: 4.5, image: 'https://images.unsplash.com/photo-1601625983796-0393c20040be?auto=format&fit=crop&q=80&w=800', categoryId: 'staff', type: 'rent' },
    { id: 111, title: 'Welder', location: 'Agadir', price: '350 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800', categoryId: 'staff', type: 'rent' },

    // Driver (Rent)
    { id: 14, title: 'Private Chauffeur', location: 'Casablanca', price: '500 DH', rating: 4.9, image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800', tag: 'Elite', categoryId: 'driver', type: 'rent' },
    { id: 15, title: 'Truck Driver', location: 'Tangier', price: '400 DH', rating: 4.6, image: 'https://images.unsplash.com/photo-1504547900898-333e387c6742?auto=format&fit=crop&q=80&w=800', categoryId: 'driver', type: 'rent' },
    { id: 16, title: 'Delivery Driver', location: 'Rabat', price: '300 DH', rating: 4.5, image: 'https://images.unsplash.com/photo-1618218167385-d6c95333554e?auto=format&fit=crop&q=80&w=800', categoryId: 'driver', type: 'rent' },
    { id: 112, title: 'Personal Driver', location: 'Marrakech', price: '450 DH', rating: 4.8, image: 'https://images.unsplash.com/photo-1594911765851-bcfa03ce8909?auto=format&fit=crop&q=80&w=800', categoryId: 'driver', type: 'rent' },
    { id: 113, title: 'Heavy Machinery Operator', location: 'Agadir', price: '600 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1535732759880-bbd5c7265e3f?auto=format&fit=crop&q=80&w=800', categoryId: 'driver', type: 'rent' },
    { id: 114, title: 'Bus Driver', location: 'Fes', price: '350 DH', rating: 4.6, image: 'https://images.unsplash.com/photo-1570126618953-d437136e8c03?auto=format&fit=crop&q=80&w=800', categoryId: 'driver', type: 'rent' },

    // Machinery (Buy)
    { id: 201, title: 'Used CAT 320', location: 'Casablanca', price: '450,000 DH', rating: 4.8, image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&q=80&w=800', tag: 'Great Deal', categoryId: 'machinery', type: 'buy' },
    { id: 202, title: 'Komatsu D155', location: 'Rabat', price: '600,000 DH', rating: 4.6, image: 'https://images.unsplash.com/photo-1579601057639-65565bb919a2?auto=format&fit=crop&q=80&w=800', categoryId: 'machinery', type: 'buy' },
    { id: 203, title: 'Hitachi Zaxis', location: 'Tangier', price: '350,000 DH', rating: 4.5, image: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?auto=format&fit=crop&q=80&w=800', categoryId: 'machinery', type: 'buy' },
    { id: 204, title: 'Liebherr Crane', location: 'Marrakech', price: '1,200,000 DH', rating: 4.9, image: 'https://images.unsplash.com/photo-1599933393960-a22fb1428256?auto=format&fit=crop&q=80&w=800', categoryId: 'machinery', type: 'buy' },
    { id: 205, title: 'Used Forklift', location: 'Agadir', price: '80,000 DH', rating: 4.4, image: 'https://images.unsplash.com/photo-1586154684947-2cb6394bf342?auto=format&fit=crop&q=80&w=800', categoryId: 'machinery', type: 'buy' },
    { id: 206, title: 'Generator Set', location: 'Fes', price: '45,000 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1456428127993-4e1fddd3e68e?auto=format&fit=crop&q=80&w=800', categoryId: 'machinery', type: 'buy' },

    // Business (Buy)
    { id: 301, title: 'Transport License', location: 'Casablanca', price: '150,000 DH', rating: 4.9, image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800', tag: 'Gréagrément', categoryId: 'business', type: 'buy' },
    { id: 302, title: 'Logistics Company', location: 'Tangier', price: '2,500,000 DH', rating: 4.8, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', categoryId: 'business', type: 'buy' },
    { id: 303, title: 'Warehouse Space', location: 'Rabat', price: '15,000 DH/mo', rating: 4.5, image: 'https://images.unsplash.com/photo-1586528116493-a029325540fa?auto=format&fit=crop&q=80&w=800', categoryId: 'business', type: 'buy' },
    { id: 304, title: 'Truck Fleet (5 Units)', location: 'Agadir', price: '1,800,000 DH', rating: 4.7, image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=800', categoryId: 'business', type: 'buy' },
    { id: 305, title: 'Car Rental License', location: 'Marrakech', price: '300,000 DH', rating: 4.6, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=800', categoryId: 'business', type: 'buy' },
    { id: 306, title: 'Construction Firm', location: 'Fes', price: '5,000,000 DH', rating: 5.0, image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800', categoryId: 'business', type: 'buy' },
];
