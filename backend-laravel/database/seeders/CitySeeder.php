<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public function run()
    {
        $cities = [
            [
                'name' => 'Casablanca',
                'name_fr' => 'Casablanca',
                'name_ar' => 'الدار البيضاء',
                'slug' => 'casablanca',
                'region' => 'Casablanca-Settat',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Rabat',
                'name_fr' => 'Rabat',
                'name_ar' => 'الرباط',
                'slug' => 'rabat',
                'region' => 'Rabat-Salé-Kénitra',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Marrakech',
                'name_fr' => 'Marrakech',
                'name_ar' => 'مراكش',
                'slug' => 'marrakech',
                'region' => 'Marrakech-Safi',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Fes',
                'name_fr' => 'Fès',
                'name_ar' => 'فاس',
                'slug' => 'fes',
                'region' => 'Fès-Meknès',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Tangier',
                'name_fr' => 'Tanger',
                'name_ar' => 'طنجة',
                'slug' => 'tangier',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Agadir',
                'name_fr' => 'Agadir',
                'name_ar' => 'أكادير',
                'slug' => 'agadir',
                'region' => 'Souss-Massa',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Meknes',
                'name_fr' => 'Meknès',
                'name_ar' => 'مكناس',
                'slug' => 'meknes',
                'region' => 'Fès-Meknès',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Oujda',
                'name_fr' => 'Oujda',
                'name_ar' => 'وجدة',
                'slug' => 'oujda',
                'region' => 'Oriental',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Kenitra',
                'name_fr' => 'Kénitra',
                'name_ar' => 'القنيطرة',
                'slug' => 'kenitra',
                'region' => 'Rabat-Salé-Kénitra',
                'country' => 'Maroc',
            ],
            [
                'name' => 'Tetouan',
                'name_fr' => 'Tétouan',
                'name_ar' => 'تطوان',
                'slug' => 'tetouan',
                'region' => 'Tanger-Tétouan-Al Hoceïma',
                'country' => 'Maroc',
            ],
        ];

        foreach ($cities as $city) {
            City::updateOrCreate(['slug' => $city['slug']], $city);
        }
    }
}
