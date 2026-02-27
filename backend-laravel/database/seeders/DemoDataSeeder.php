<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
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
                        'title_ar' => 'داسيا لوجان 2023',
                        'description' => 'Voiture économique idéale pour la ville. Climatisation, direction assistée. Kilométrage illimité. Disponible immédiatement.',
                        'description_ar' => 'سيارة اقتصادية مثالية للمدينة. تكييف، مقود معزز. عدد كيلومترات غير محدود. متاحة فورا.',
                        'price' => 250,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800'],
                    ],
                    [
                        'title' => 'Renault Clio V',
                        'title_ar' => 'رينو كليو 5',
                        'description' => 'Citadine moderne et confortable. Parfaite pour vos déplacements quotidiens. Faible consommation.',
                        'description_ar' => 'سيارة مدينة حديثة ومريحة. مثالية لتنقلاتك اليومية. استهلاك منخفض للوقود.',
                        'price' => 300,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800'],
                    ],
                    [
                        'title' => 'Hyundai Tucson 2024',
                        'title_ar' => 'هيونداي توكسون 2024',
                        'description' => 'SUV familial spacieux. Idéal pour les voyages et les vacances. Boîte automatique, GPS intégré.',
                        'description_ar' => 'سيارة عائلية رباعية الدفع واسعة. مثالية للسفر والعطلات. ناقل حركة أوتوماتيكي، نظام تحديد المواقع مدمج.',
                        'price' => 550,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1606611013016-969c19ba27bb?q=80&w=800'],
                    ],
                    [
                        'title' => 'Mercedes Classe C',
                        'title_ar' => 'مرسيدس الفئة C',
                        'description' => 'Berline de luxe pour vos événements. Intérieur cuir, toit ouvrant. Service chauffeur disponible.',
                        'description_ar' => 'سيارة سيدان فاخرة لمناسباتكم. مقاعد جلدية، فتحة سقف. خدمة السائق متاحة.',
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
                        'title_ar' => 'حفارة هيدروليكية CAT 320',
                        'description' => 'Excavatrice 20 tonnes. Parfaite pour travaux de terrassement et fondations. Opérateur expérimenté disponible.',
                        'description_ar' => 'حفارة بوزن 20 طن. مثالية لأعمال الحفر والأساسات. سائق ذو خبرة متاح.',
                        'price' => 3500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800'],
                    ],
                    [
                        'title' => 'Bulldozer Komatsu D65',
                        'title_ar' => 'جرافة كوماتسو D65',
                        'description' => 'Bulldozer puissant pour nivellement et défrichage. Lame 3.8m. Maintenance à jour.',
                        'description_ar' => 'جرافة قوية للتسوية وإزالة الأشجار. شفرة 3.8 متر. الصيانة محدثة.',
                        'price' => 4500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1579315044485-282424bca978?q=80&w=800'],
                    ],
                    [
                        'title' => 'Chargeuse sur Pneus JCB 456',
                        'title_ar' => 'جرافة عجلات JCB 456',
                        'description' => 'Chargeuse frontale 4 tonnes. Idéale pour le chargement et le transport de matériaux.',
                        'description_ar' => 'جرافة أمامية 4 طن. مثالية لتعمير ونقل المواد.',
                        'price' => 2800,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800'],
                    ],
                    [
                        'title' => 'Compacteur Vibrant BOMAG',
                        'title_ar' => 'محدلة اهتزازية BOMAG',
                        'description' => 'Rouleau compacteur pour travaux routiers. Largeur de travail 2.1m. Parfait état.',
                        'description_ar' => 'محدلة لأعمال الطرق. عرض العمل 2.1 متر. حالة ممتازة.',
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
                        'title_ar' => 'شاحنة قلابة 20 طن',
                        'description' => 'Camion benne pour transport de matériaux. Capacité 20 tonnes. Chauffeur inclus sur demande.',
                        'description_ar' => 'شاحنة قلابة لنقل المواد. سعة 20 طن. السائق مشمول عند الطلب.',
                        'price' => 1800,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800'],
                    ],
                    [
                        'title' => 'Semi-Remorque 40T',
                        'title_ar' => 'نصف مقطورة 40 طن',
                        'description' => 'Transport longue distance. Plateau 13.6m. Idéal pour fret international Maroc-Europe.',
                        'description_ar' => 'نقل لمسافات طويلة. منصة 13.6 متر. مثالي للشحن الدولي بين المغرب وأوروبا.',
                        'price' => 3500,
                        'price_unit' => 'DH/trajet',
                        'images' => ['https://images.unsplash.com/photo-1586191582066-bdb898e906bd?q=80&w=800'],
                    ],
                    [
                        'title' => 'Fourgon Renault Master',
                        'title_ar' => 'رينو ماستر فان',
                        'description' => 'Utilitaire 14m³ pour déménagement et livraisons. Hayon élévateur disponible.',
                        'description_ar' => 'مركبة نفعية 14 متر مكعب للرحيل والتوصيل. رافعة خلفية متاحة.',
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
                        'title_ar' => 'حافلة سياحية 55 مقعد',
                        'description' => 'Bus grand tourisme climatisé. Sièges inclinables, WiFi, écrans LCD. Idéal excursions et événements.',
                        'description_ar' => 'حافلة سياحية مكيفة. مقاعد قابلة للإمالة، واي فاي، شاشات LCD. مثالية للرحلات والمناسبات.',
                        'price' => 4500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800'],
                    ],
                    [
                        'title' => 'Minibus Mercedes 19 Places',
                        'title_ar' => 'ميني باص مرسيدس 19 مقعد',
                        'description' => 'Minibus confortable pour groupes. Climatisation, bagages. Chauffeur professionnel.',
                        'description_ar' => 'ميني باص مريح للمجموعات. تكييف، مكان للأمتعة. سائق محترف.',
                        'price' => 2000,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=800'],
                    ],
                    [
                        'title' => 'VTC Mercedes Classe V',
                        'title_ar' => 'مرسيدس الفئة V (VTC)',
                        'description' => 'Van de luxe 7 places. Transferts aéroport, mariages, VIP. Service premium.',
                        'description_ar' => 'فان فاخر 7 مقاعد. نقل للمطار، أعراس، كبار الشخصيات. خدمة مميزة.',
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
                        'title_ar' => 'سائق شاحنة ثقيلة - رخصة EC',
                        'description' => '15 ans d\'expérience. Transport national et international. Disponible immédiatement pour missions longues.',
                        'description_ar' => '15 سنة من الخبرة. نقل وطني ودولي. متاح فورا للمهمات الطويلة.',
                        'price' => 500,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800'],
                    ],
                    [
                        'title' => 'Opérateur Grue Mobile',
                        'title_ar' => 'مشغل رافعة متحركة',
                        'description' => 'Certifié CACES. Expérience chantiers BTP et industrie. Rigueur et sécurité.',
                        'description_ar' => 'معتمد بشهادة CACES. خبرة في ورش البناء والصناعة. دقة وسلامة.',
                        'price' => 700,
                        'price_unit' => 'DH/jour',
                        'images' => ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800'],
                    ],
                    [
                        'title' => 'Conducteur d\'Engins BTP',
                        'title_ar' => 'سائق آليات الأشغال',
                        'description' => 'Spécialiste pelles et chargeuses. 10 ans d\'expérience. Références disponibles.',
                        'description_ar' => 'متخصص في الحفارات والجرافات. 10 سنوات خبرة. مراجع متاحة.',
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
                        'title_ar' => 'حفارة فولفو EC210 - مستعملة',
                        'description' => 'Année 2019, 5000h. Entretien complet chez concessionnaire. Prête à travailler.',
                        'description_ar' => 'سنة 2019، 5000 ساعة. صيانة كاملة عند الوكيل. جاهزة للعمل.',
                        'price' => 850000,
                        'price_unit' => 'DH',
                        'images' => ['https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800'],
                    ],
                    [
                        'title' => 'Chargeuse Caterpillar 950H',
                        'title_ar' => 'جرافة كاتربيلر 950H',
                        'description' => 'Année 2017, 7500h. Godet 3m³. Pneus neufs. Excellent état général.',
                        'description_ar' => 'سنة 2017، 7500 ساعة. دلو 3 متر مكعب. إطارات جديدة. حالة عامة ممتازة.',
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
                        'title_ar' => 'شاحنة رينو بريميوم 380',
                        'description' => 'Année 2018, 450 000 km. Porteur 19T. Idéal pour transport régional.',
                        'description_ar' => 'سنة 2018، 450,000 كم. حمولة 19 طن. مثالية للنقل الجهوي.',
                        'price' => 320000,
                        'price_unit' => 'DH',
                        'images' => ['https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=800'],
                    ],
                    [
                        'title' => 'Tracteur Routier Volvo FH',
                        'title_ar' => 'جرار طرقي فولفو FH',
                        'description' => 'Année 2020, 280 000 km. Boîte auto I-Shift. Cabine XL. Excellent état.',
                        'description_ar' => 'سنة 2020، 280,000 كم. ناقل حركة I-Shift. مقصورة XL. حالة ممتازة.',
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

            if (! $category) {
                $this->command->warn("Category {$categoryListings['category_slug']} not found, skipping...");

                continue;
            }

            foreach ($categoryListings['listings'] as $index => $listingData) {
                // Specific assignment: Give Heavy Machinery (index 1 in demoListings) to User 2 (Mohammed Khalidi)
                if ($categoryListings['category_slug'] === 'heavy-machinery') {
                    $user = User::find(2); // Mohammed Khalidi
                } else {
                    $user = $createdUsers[$index % count($createdUsers)];
                }

                if (!$user) $user = $createdUsers[0]; // Fallback

                Listing::updateOrCreate(
                    ['slug' => Str::slug($listingData['title'])],
                    [
                        'user_id' => $user->id,
                        'category_id' => $category->id,
                        'city_id' => $cityIds[array_rand($cityIds)],
                        'title' => $listingData['title'],
                        'title_ar' => $listingData['title_ar'] ?? null,
                        'title_fr' => $listingData['title'], // Default fr to title
                        'slug' => Str::slug($listingData['title']),
                        'description' => $listingData['description'],
                        'description_ar' => $listingData['description_ar'] ?? null,
                        'description_fr' => $listingData['description'], // Default fr to description
                        'price' => $listingData['price'],
                        'price_unit' => $listingData['price_unit'],
                        'price_type' => $category->type === 'rent' ? 'daily' : 'fixed',
                        // 'location' => $moroccanLocations[array_rand($moroccanLocations)], // Dropped column
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
        $this->command->info('   - '.count($users).' users created');
        $this->command->info('   - Multiple listings created across categories');
    }
}
