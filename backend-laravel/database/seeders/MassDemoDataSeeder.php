<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MassDemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Get or Create Users
        $users = User::whereIn('email', ['mohammed@example.com', 'fatima@example.com', 'ahmed@example.com', 'youssef@example.com'])->get();
        if ($users->isEmpty()) {
            $this->command->info('Running DemoDataSeeder first to create users...');
            $this->call(DemoDataSeeder::class);
            $users = User::whereIn('role', ['user', 'ADMIN'])->get();
        }

        // 2. Ensure Categories and Cities
        $categories = Category::all();
        $cities = City::all();
        $cityIds = $cities->pluck('id')->toArray();

        // 3. Define templates per category
        $templates = [
            'car-rental' => [
                ['title' => 'Dacia Logan 2023', 'price' => 250, 'img' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'],
                ['title' => 'Renault Clio 5', 'price' => 300, 'img' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'],
                ['title' => 'Hyundai Tucson', 'price' => 550, 'img' => 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb'],
                ['title' => 'Volkswagen Golf 8', 'price' => 450, 'img' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'],
                ['title' => 'Peugeot 208', 'price' => 350, 'img' => 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d']
            ],
            'heavy-machinery' => [
                ['title' => 'Pelle CAT 320', 'price' => 3500, 'img' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837'],
                ['title' => 'Bulldozer D6', 'price' => 4500, 'img' => 'https://images.unsplash.com/photo-1579315044485-282424bca978'],
                ['title' => 'JCB 4CX', 'price' => 2800, 'img' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'],
                ['title' => 'Niveleuse 140K', 'price' => 5000, 'img' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837'],
                ['title' => 'Compacteur Bomag', 'price' => 2200, 'img' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd']
            ],
            'transport-logistics' => [
                ['title' => 'Camion Benne 20T', 'price' => 1800, 'img' => 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7'],
                ['title' => 'Semi-remorque 40T', 'price' => 3500, 'img' => 'https://images.unsplash.com/photo-1586191582066-bdb898e906bd'],
                ['title' => 'Camion Frigo', 'price' => 2500, 'img' => 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7'],
                ['title' => 'Plateau Porte-engin', 'price' => 3000, 'img' => 'https://images.unsplash.com/photo-1586191582066-bdb898e906bd'],
                ['title' => 'Fourgon Master', 'price' => 800, 'img' => 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a']
            ],
            'lifting-equipment' => [
                ['title' => 'Chariot Elevateur 3T', 'price' => 1200, 'img' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'],
                ['title' => 'Nacelle 18m', 'price' => 2000, 'img' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837'],
                ['title' => 'Grue Mobile 50T', 'price' => 8000, 'img' => 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d'],
                ['title' => 'Telescopique JCB', 'price' => 2500, 'img' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'],
                ['title' => 'Manitou 7m', 'price' => 1800, 'img' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837']
            ],
            'tourist-transport' => [
                ['title' => 'Autocar 50 places', 'price' => 4500, 'img' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'],
                ['title' => 'Minibus 15 places', 'price' => 1800, 'img' => 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e'],
                ['title' => 'Mercedes Classe V', 'price' => 1500, 'img' => 'https://images.unsplash.com/photo-1609521263047-f8f205293f24'],
                ['title' => 'Bus de Luxe', 'price' => 6000, 'img' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'],
                ['title' => 'Van Touristique', 'price' => 1200, 'img' => 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e']
            ],
            'personnel-transport' => [
                ['title' => 'Transport Ouvrier 20 places', 'price' => 800, 'img' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'],
                ['title' => 'Bus Scolaire', 'price' => 1000, 'img' => 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e'],
                ['title' => 'Navette Entreprise', 'price' => 900, 'img' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'],
                ['title' => 'Bus Inter-ville', 'price' => 1500, 'img' => 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e']
            ],
            'professional-drivers' => [
                ['title' => 'Sائق Poids Lourd', 'price' => 450, 'img' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d'],
                ['title' => 'السائق Engins BTP', 'price' => 600, 'img' => 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d'],
                ['title' => 'Chauffeur VIP', 'price' => 500, 'img' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e']
            ],
            'heavy-machinery-sales' => [
                ['title' => 'Vente Pelle Volvo', 'price' => 850000, 'img' => 'https://images.unsplash.com/photo-1581092160562-40aa08e78837'],
                ['title' => 'Vente Chargeuse CAT', 'price' => 720000, 'img' => 'https://images.unsplash.com/photo-1504307651254-35680f356dfd'],
                ['title' => 'Vente Bulldozer Kamatsu', 'price' => 950000, 'img' => 'https://images.unsplash.com/photo-1579315044485-282424bca978']
            ],
            'commercial-vehicles' => [
                ['title' => 'Vente Camion Volvo FH', 'price' => 580000, 'img' => 'https://images.unsplash.com/photo-1586191582066-bdb898e906bd'],
                ['title' => 'Vente Master 2019', 'price' => 180000, 'img' => 'https://images.unsplash.com/photo-1591768575198-88dac53fbd0a'],
                ['title' => 'Vente IVECO 35C15', 'price' => 220000, 'img' => 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7']
            ],
            'business-licenses' => [
                ['title' => 'Agrément Transport Marchandise', 'price' => 150000, 'img' => 'https://images.unsplash.com/photo-1586191582066-bdb898e906bd'],
                ['title' => 'Société de Transport Touristique', 'price' => 500000, 'img' => 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957']
            ],
        ];

        foreach ($categories as $category) {
            $catTemplates = $templates[$category->slug] ?? $templates['car-rental'];
            
            for ($i = 1; $i <= 10; $i++) {
                $template = $catTemplates[array_rand($catTemplates)];
                $user = $users->random();
                $city = $cities->random();
                
                $title = $template['title'] . " - Demo " . $i;
                $slug = Str::slug($title . "-" . uniqid());
                
                Listing::create([
                    'user_id' => $user->id,
                    'category_id' => $category->id,
                    'city_id' => $city->id,
                    'title' => $title,
                    'title_fr' => $title,
                    'title_ar' => "تجريبي " . $i . " - " . $template['title'],
                    'slug' => $slug,
                    'description' => "Description de démo pour " . $title . ". Equipement en excellent état.",
                    'description_fr' => "Description de démo pour " . $title . ". Equipement en excellent état.",
                    'description_ar' => "وصف تجريبي لـ " . $title . ". المعدات في حالة ممتازة.",
                    'price' => $template['price'],
                    'price_unit' => $category->type === 'rent' ? 'DH/jour' : 'DH',
                    'price_type' => $category->type === 'rent' ? 'daily' : 'fixed',
                    'image_hero' => $template['img'],
                    'images' => [
                        $template['img'],
                        'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
                        'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'
                    ],
                    'is_available' => true,
                    'status' => 'active',
                    'views' => rand(10, 500),
                    'is_featured' => rand(0, 10) > 8,
                    'published_at' => now()->subDays(rand(0, 30)),
                    'daily_cost' => $category->daily_cost ?? 5,
                ]);
            }
        }

        $this->command->info('✅ Successfully seeded 10 listings for each category!');
    }
}
