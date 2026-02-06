<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            // Rent Categories
            [
                'name' => 'Car Rental',
                'name_fr' => 'Location de Voitures',
                'name_ar' => 'كراء السيارات',
                'slug' => 'car-rental',
                'type' => 'rent',
                'icon' => 'car',
                'description' => 'Economy, Sedans, SUVs...',
                'description_fr' => 'Citadines, Berlines, SUV...',
                'description_ar' => 'سيارات اقتصادية، فاخرة، دفع رباعي...',
                'is_active' => true,
                'order' => 1,
                'daily_cost' => 5, // 5 SOLD DIRHAM/day for cars
            ],
            [
                'name' => 'Heavy Machinery',
                'name_fr' => 'Engins BTP',
                'name_ar' => 'آليات الأشغال',
                'slug' => 'heavy-machinery',
                'type' => 'rent',
                'icon' => 'tractor',
                'description' => 'Excavators, Cranes, Loaders...',
                'description_fr' => 'Trax, Poclain, Grue...',
                'description_ar' => 'تراكس، بوكلان، رافعات...',
                'is_active' => true,
                'order' => 2,
                'daily_cost' => 10, // 10 SOLD DIRHAM/day for heavy machinery
            ],
            [
                'name' => 'Transport & Logistics',
                'name_fr' => 'Transport & Logistique',
                'name_ar' => 'النقل واللوجستيك',
                'slug' => 'transport-logistics',
                'type' => 'rent',
                'icon' => 'truck',
                'description' => 'Trucks, Vans, Haulage...',
                'description_fr' => 'Camions, Fourgons, Fret...',
                'description_ar' => 'شاحنات، نقل البضائع...',
                'is_active' => true,
                'order' => 3,
                'daily_cost' => 7, // 7 SOLD DIRHAM/day for transport
            ],
            [
                'name' => 'Lifting Equipment',
                'name_fr' => 'Levage & Manutention',
                'name_ar' => 'معدات الرفع',
                'slug' => 'lifting-equipment',
                'type' => 'rent',
                'icon' => 'crane',
                'description' => 'Forklifts, Cranes, Hoists...',
                'description_fr' => 'Chariots, Grues...',
                'description_ar' => 'رافعات شوكية، أوناش...',
                'is_active' => true,
                'order' => 4,
                'daily_cost' => 10, // 10 SOLD DIRHAM/day for lifting equipment
            ],
            [
                'name' => 'Tourist Transport',
                'name_fr' => 'Transport Touristique',
                'name_ar' => 'النقل السياحي',
                'slug' => 'tourist-transport',
                'type' => 'rent',
                'icon' => 'bus',
                'description' => 'Luxury buses, minibuses, VTC...',
                'description_fr' => 'Minibus, Autocars, VTC...',
                'description_ar' => 'حافلات، سيارات فخمة...',
                'is_active' => true,
                'order' => 5,
                'daily_cost' => 7, // 7 SOLD DIRHAM/day
            ],
            [
                'name' => 'Personnel Transport',
                'name_fr' => 'Transport Personnel',
                'name_ar' => 'نقل المستخدمين',
                'slug' => 'personnel-transport',
                'type' => 'rent',
                'icon' => 'users',
                'description' => 'School & Staff transport...',
                'description_fr' => 'Ouvriers, Scolaire...',
                'description_ar' => 'نقل العمال، المدرسي...',
                'is_active' => true,
                'order' => 6,
                'daily_cost' => 5, // 5 SOLD DIRHAM/day
            ],
            [
                'name' => 'Professional Drivers',
                'name_fr' => 'Chauffeurs Pros',
                'name_ar' => 'سائقون مهنيون',
                'slug' => 'professional-drivers',
                'type' => 'rent',
                'icon' => 'user-check',
                'description' => 'Truck & Machinery Operators...',
                'description_fr' => 'Permis C/EC/D, Opérateurs...',
                'description_ar' => 'سائقين مهنيين، مشغلين...',
                'is_active' => true,
                'order' => 7,
                'daily_cost' => 3, // 3 SOLD DIRHAM/day for drivers
            ],

            // Buy Categories (lower daily cost since they're sales listings)
            [
                'name' => 'Heavy Machinery Sales',
                'name_fr' => 'Vente Engins',
                'name_ar' => 'بيع المعدات',
                'slug' => 'heavy-machinery-sales',
                'type' => 'buy',
                'icon' => 'shopping-cart',
                'description' => 'Used machinery & vehicles...',
                'description_fr' => 'Machines et véhicules d\'occasion...',
                'description_ar' => 'الآلات و المركبات المستعملة...',
                'is_active' => true,
                'order' => 1,
                'daily_cost' => 8, // 8 SOLD DIRHAM/day for sales
            ],
            [
                'name' => 'Commercial Vehicles',
                'name_fr' => 'Véhicules Commerciaux',
                'name_ar' => 'مركبات تجارية',
                'slug' => 'commercial-vehicles',
                'type' => 'buy',
                'icon' => 'truck',
                'description' => 'Trucks, Vans for sale...',
                'description_fr' => 'Camions, Utilitaires à vendre...',
                'description_ar' => 'شاحنات، عربات للبيع...',
                'is_active' => true,
                'order' => 2,
                'daily_cost' => 6, // 6 SOLD DIRHAM/day
            ],
            [
                'name' => 'Business & Licenses',
                'name_fr' => 'Business & Agréments',
                'name_ar' => 'مشاريع ورخص',
                'slug' => 'business-licenses',
                'type' => 'buy',
                'icon' => 'briefcase',
                'description' => 'Transport licenses & companies...',
                'description_fr' => 'Licences de transport et entreprises...',
                'description_ar' => 'رخص النقل و المقاولات...',
                'is_active' => true,
                'order' => 3,
                'daily_cost' => 5, // 5 SOLD DIRHAM/day
            ],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']], // Check mainly by slug to avoid dupes
                $category
            );
        }
    }
}

