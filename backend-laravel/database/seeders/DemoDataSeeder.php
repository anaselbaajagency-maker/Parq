<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Listing;
use App\Models\Category;
use App\Models\City;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Create Demo Users
        $users = [
            [
                'full_name' => 'Anas Admin',
                'email' => 'anas@parq.ma',
                'password' => Hash::make('password'),
                'phone' => '+212 6 00 00 00 01',
                'role' => 'ADMIN',
                'email_verified_at' => now(),
            ],
            [
                'full_name' => 'Mohammed Khalidi',
                'email' => 'mohammed@example.com',
                'password' => Hash::make('password'),
                'phone' => '+212 6 12 34 56 78',
                'role' => 'user',
                'email_verified_at' => now(),
            ],
            [
                'full_name' => 'Fatima Zahra',
                'email' => 'fatima@example.com',
                'password' => Hash::make('password'),
                'phone' => '+212 6 98 76 54 32',
                'role' => 'user',
                'email_verified_at' => now(),
            ],
            [
                'full_name' => 'Ahmed Bennani',
                'email' => 'ahmed@example.com',
                'password' => Hash::make('password'),
                'phone' => '+212 6 55 44 33 22',
                'role' => 'user',
                'email_verified_at' => now(),
            ],
            [
                'full_name' => 'Youssef Transport',
                'email' => 'youssef@example.com',
                'password' => Hash::make('password'),
                'phone' => '+212 6 11 22 33 44',
                'role' => 'user',
                'email_verified_at' => now(),
            ],
        ];

        $createdUsers = [];
        foreach ($users as $userData) {
            $createdUsers[] = User::updateOrCreate(
                ['email' => $userData['email']],
                $userData
            );
        }

        // 2. Ensure Categories are seeded
        $this->call(CategorySeeder::class);
        $this->call(CitySeeder::class);

        // 3. Get all categories and cities
        $categories = Category::all();
        $cities = City::all();

        if ($categories->isEmpty() || $cities->isEmpty()) {
            $this->command->info('No categories or cities found. Please run CategorySeeder and CitySeeder first.');
            return;
        }

        // 4. Define demo listings for each category type
        $demoListings = [
            // Car Rental
            [
                'category_slug' => 'car-rental',
                'listings' => [
                    [
                        'title' => 'Dacia Logan 2023',
                        'description' => 'Voiture économique idéale pour la ville. Climatisation, direction assistée. Kilométrage illimité. Disponible immédiatement.',
                        'price' => 250,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800'],
                    ],
                    [
                        'title' => 'Renault Clio V',
                        'description' => 'Citadine moderne et confortable. Parfaite pour vos déplacements quotidiens. Faible consommation.',
                        'price' => 300,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800'],
                    ],
                    [
                        'title' => 'Hyundai Tucson 2024',
                        'description' => 'SUV familial spacieux. Idéal pour les voyages et les vacances. Boîte automatique, GPS intégré.',
                        'price' => 550,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=800'],
                    ],
                    [
                        'title' => 'Mercedes Classe C',
                        'description' => 'Berline de luxe pour vos événements. Intérieur cuir, toit ouvrant. Service chauffeur disponible.',
                        'price' => 900,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800'],
                    ],
                ],
            ],
            // Heavy Machinery
            [
                'category_slug' => 'heavy-machinery',
                'listings' => [
                    [
                        'title' => 'Pelle Hydraulique CAT 320',
                        'description' => 'Excavatrice 20 tonnes. Parfaite pour travaux de terrassement et fondations. Opérateur expérimenté disponible.',
                        'price' => 3500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800'],
                    ],
                    [
                        'title' => 'Bulldozer Komatsu D65',
                        'description' => 'Bulldozer puissant pour nivellement et défrichage. Lame 3.8m. Maintenance à jour.',
                        'price' => 4500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1579315044485-282424bca978?q=80&w=800'],
                    ],
                    [
                        'title' => 'Chargeuse sur Pneus JCB 456',
                        'description' => 'Chargeuse frontale 4 tonnes. Idéale pour le chargement et le transport de matériaux.',
                        'price' => 2800,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'],
                    ],
                    [
                        'title' => 'Compacteur Vibrant BOMAG',
                        'description' => 'Rouleau compacteur pour travaux routiers. Largeur de travail 2.1m. Parfait état.',
                        'price' => 2200,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'],
                    ],
                ],
            ],
            // Transport & Logistics
            [
                'category_slug' => 'transport-logistics',
                'listings' => [
                    [
                        'title' => 'Camion Benne 20T',
                        'description' => 'Camion benne pour transport de matériaux. Capacité 20 tonnes. Chauffeur inclus sur demande.',
                        'price' => 1800,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800'],
                    ],
                    [
                        'title' => 'Semi-Remorque 40T',
                        'description' => 'Transport longue distance. Plateau 13.6m. Idéal pour fret international Maroc-Europe.',
                        'price' => 3500,
                        'price_unit' => 'DH/trajet',
                        'images' => ['https://images.unsplash.com/photo-1586191582066-bdb898e906bd?q=80&w=800'],
                    ],
                    [
                        'title' => 'Fourgon Renault Master',
                        'description' => 'Utilitaire 14m³ pour déménagement et livraisons. Hayon élévateur disponible.',
                        'price' => 600,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1591768575198-88dac53fbd0a?q=80&w=800'],
                    ],
                ],
            ],
            // Tourist Transport
            [
                'category_slug' => 'tourist-transport',
                'listings' => [
                    [
                        'title' => 'Autocar Tourisme 55 Places',
                        'description' => 'Bus grand tourisme climatisé. Sièges inclinables, WiFi, écrans LCD. Idéal excursions et événements.',
                        'price' => 4500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800'],
                    ],
                    [
                        'title' => 'Minibus Mercedes 19 Places',
                        'description' => 'Minibus confortable pour groupes. Climatisation, bagages. Chauffeur professionnel.',
                        'price' => 2000,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800'],
                    ],
                    [
                        'title' => 'VTC Mercedes Classe V',
                        'description' => 'Van de luxe 7 places. Transferts aéroport, mariages, VIP. Service premium.',
                        'price' => 1500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1609521263047-f8f205293f24?q=80&w=800'],
                    ],
                ],
            ],
            // Professional Drivers
            [
                'category_slug' => 'professional-drivers',
                'listings' => [
                    [
                        'title' => 'Chauffeur Poids Lourd - Permis EC',
                        'description' => '15 ans d\'expérience. Transport national et international. Disponible immédiatement pour missions longues.',
                        'price' => 500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800'],
                    ],
                    [
                        'title' => 'Opérateur Grue Mobile',
                        'description' => 'Certifié CACES. Expérience chantiers BTP et industrie. Rigueur et sécurité.',
                        'price' => 700,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800'],
                    ],
                    [
                        'title' => 'Conducteur d\'Engins BTP',
                        'description' => 'Spécialiste pelles et chargeuses. 10 ans d\'expérience. Références disponibles.',
                        'price' => 600,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800'],
                    ],
                ],
            ],
            // Heavy Machinery Sales
            [
                'category_slug' => 'heavy-machinery-sales',
                'listings' => [
                    [
                        'title' => 'Excavatrice Volvo EC210 - Occasion',
                        'description' => 'Année 2019, 5000h. Entretien complet chez concessionnaire. Prête à travailler.',
                        'price' => 850000,
                        'price_unit' => 'DH',
                        'images' => ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800'],
                    ],
                    [
                        'title' => 'Chargeuse Caterpillar 950H',
                        'description' => 'Année 2017, 7500h. Godet 3m³. Pneus neufs. Excellent état général.',
                        'price' => 680000,
                        'price_unit' => 'DH',
                        'images' => ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'],
                    ],
                ],
            ],
            // Commercial Vehicles
            [
                'category_slug' => 'commercial-vehicles',
                'listings' => [
                    [
                        'title' => 'Camion Renault Premium 380',
                        'description' => 'Année 2018, 450 000 km. Porteur 19T. Idéal pour transport régional.',
                        'price' => 320000,
                        'price_unit' => 'DH',
                        'images' => ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800'],
                    ],
                    [
                        'title' => 'Tracteur Routier Volvo FH',
                        'description' => 'Année 2020, 280 000 km. Boîte auto I-Shift. Cabine XL. Excellent état.',
                        'price' => 580000,
                        'price_unit' => 'DH',
                        'images' => ['https://images.unsplash.com/photo-1586191582066-bdb898e906bd?q=80&w=800'],
                    ],
                ],
            ],
        ];

        // 5. Create listings
        $cityIds = $cities->pluck('id')->toArray();
        $moroccanLocations = [
            'Casablanca, Zone Industrielle Ain Sebaa',
            'Rabat, Hay Riad',
            'Marrakech, Zone Industrielle Sidi Ghanem',
            'Tanger, Zone Franche',
            'Agadir, Ait Melloul',
            'Fès, Zone Industrielle Ben Souda',
            'Kenitra, Zone Industrielle',
            'Oujda, Zone d\'Activités',
        ];

        foreach ($demoListings as $categoryListings) {
            $category = Category::where('slug', $categoryListings['category_slug'])->first();
            
            if (!$category) {
                $this->command->warn("Category {$categoryListings['category_slug']} not found, skipping...");
                continue;
            }

            foreach ($categoryListings['listings'] as $index => $listingData) {
                // Rotate through users
                $user = $createdUsers[$index % count($createdUsers)];
                
                Listing::updateOrCreate(
                    ['slug' => Str::slug($listingData['title'])],
                    [
                        'user_id' => $user->id,
                        'category_id' => $category->id,
                        'city_id' => $cityIds[array_rand($cityIds)],
                        'title' => $listingData['title'],
                        'slug' => Str::slug($listingData['title']),
                        'description' => $listingData['description'],
                        'price' => $listingData['price'],
                        'price_unit' => $listingData['price_unit'],
                        'price_type' => $category->type === 'rent' ? 'daily' : 'fixed',
                        'location' => $moroccanLocations[array_rand($moroccanLocations)],
                        'images' => $listingData['images'],
                        // Use a nice default hero image if one isn't available
                        'image_hero' => $listingData['images'][0] ?? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=1200',
                        'is_available' => true,
                        'status' => 'active',
                        'views' => rand(50, 1500),
                        'daily_cost' => $category->daily_cost ?? 5,
                        'is_featured' => rand(0, 1) === 1,
                        'published_at' => now()->subDays(rand(1, 30)),
                    ]
                );
            }
        }

        // Also mark some categories as featured on homepage
        Category::whereIn('slug', ['heavy-machinery', 'heavy-machinery-sales', 'commercial-vehicles'])
            ->update(['show_on_homepage' => true]);

        $this->command->info('✅ Demo data seeded successfully!');
        $this->command->info('   - ' . count($users) . ' users created');
        $this->command->info('   - Multiple listings created across categories');
    }
}
