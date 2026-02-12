<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('payment_methods')) {
            Schema::create('payment_methods', function (Blueprint $table) {
                $table->id();
                $table->string('code')->unique(); // bank_transfer, cmi, payzone, cashplus
                $table->string('name');
                $table->string('name_ar')->nullable();
                $table->text('description')->nullable();
                $table->text('description_ar')->nullable();
                $table->string('icon')->default('credit-card');
                $table->boolean('is_active')->default(true);
                $table->integer('sort_order')->default(0);
                $table->json('config')->nullable(); // For API keys, bank details, etc.
                $table->timestamps();
            });

            // Insert default payment methods
            \App\Models\PaymentMethod::insert([
                [
                    'code' => 'bank_transfer',
                    'name' => 'Virement Bancaire',
                    'name_ar' => 'تحويل بنكي',
                    'description' => 'Effectuez un virement vers notre compte bancaire et téléchargez la preuve de paiement.',
                    'icon' => 'landmark',
                    'is_active' => true,
                    'sort_order' => 1,
                    'config' => json_encode([
                        'bank_name' => 'Attijariwafa Bank',
                        'account_holder' => 'PARQ SARL',
                        'rib' => '007 780 0001234567890123 45',
                    ]),
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'code' => 'cmi',
                    'name' => 'Carte Bancaire (CMI)',
                    'name_ar' => 'البطاقة البنكية',
                    'description' => 'Paiement sécurisé par carte bancaire via le Centre Monétique Interbancaire.',
                    'icon' => 'credit-card',
                    'is_active' => true,
                    'sort_order' => 2,
                    'config' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'code' => 'cashplus',
                    'name' => 'Cash Plus',
                    'name_ar' => 'كاش بلس',
                    'description' => 'Payez en espèces dans n\'importe quelle agence Cash Plus avec le code généré.',
                    'icon' => 'banknote',
                    'is_active' => true,
                    'sort_order' => 3,
                    'config' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'code' => 'payzone',
                    'name' => 'Payzone',
                    'name_ar' => 'بايزون',
                    'description' => 'Paiement via le réseau Payzone.',
                    'icon' => 'wallet',
                    'is_active' => false,
                    'sort_order' => 4,
                    'config' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_methods');
    }
};
