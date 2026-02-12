<?php

namespace Database\Seeders;

use App\Models\PaymentMethod;
use Illuminate\Database\Seeder;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $methods = [
            [
                'code' => 'bank_transfer',
                'name' => 'Virement Bancaire',
                'name_ar' => 'تحويل بنكي',
                'description' => 'Effectuez un virement et téléchargez le reçu pour validation.',
                'description_ar' => 'قم بإجراء تحويل وقم بتحميل الإيصال للتحقق.',
                'is_active' => true,
                'sort_order' => 1,
                'icon' => 'building-bank',
                'config' => null,
            ],
            [
                'code' => 'cmi',
                'name' => 'Carte Bancaire (CMI)',
                'name_ar' => 'البطاقة البنكية (CMI)',
                'description' => 'Paiement sécurisé par carte bancaire marocaine.',
                'description_ar' => 'الدفع الآمن بالبطاقة البنكية المغربية.',
                'is_active' => false, // Enable when configured
                'sort_order' => 2,
                'icon' => 'credit-card',
                'config' => null,
            ],
            [
                'code' => 'payzone',
                'name' => 'Payzone',
                'name_ar' => 'Payzone',
                'description' => 'Paiement en ligne via Payzone.',
                'description_ar' => 'الدفع عبر الإنترنت عبر Payzone.',
                'is_active' => false, // Enable when configured
                'sort_order' => 3,
                'icon' => 'wallet',
                'config' => null,
            ],
            [
                'code' => 'cashplus',
                'name' => 'Cash Plus',
                'name_ar' => 'كاش بلس',
                'description' => 'Payez en espèces dans un point Cash Plus.',
                'description_ar' => 'ادفع نقدًا في نقطة كاش بلس.',
                'is_active' => false, // Enable when configured
                'sort_order' => 4,
                'icon' => 'banknotes',
                'config' => null,
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::updateOrCreate(
                ['code' => $method['code']],
                $method
            );
        }
    }
}
