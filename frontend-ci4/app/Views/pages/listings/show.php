<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="container mt-4">
    <div style="display: grid; grid-template-columns: 1fr 380px; gap: 2rem;">
        
        <!-- Main Content -->
        <div class="listing-details">
            <h1 style="font-size: 2.5rem;"><?= $listing['title_fr'] ?? $listing['title'] ?></h1>
            <p style="color: var(--color-text); margin-top: 0.5rem;">Maroc, Bouskoura</p>
            
            <div class="gallery mt-4" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; height: 400px; border-radius: var(--radius-lg); overflow: hidden;">
                <div style="background: #EEE; grid-row: span 2;">
                     <?php if (!empty($listing['image_hero'])): ?>
                        <img src="<?= $listing['image_hero'] ?>" style="width: 100%; height: 100%; object-fit: cover;">
                     <?php endif; ?>
                </div>
                <div style="background: #DDD;"></div>
                <div style="background: #CCC;"></div>
            </div>

            <div class="description mt-4">
                <h2>Description</h2>
                <p class="mt-1"><?= $listing['description_fr'] ?? $listing['description'] ?></p>
            </div>
            
            <div class="attributes mt-4">
                 <h2>Caractéristiques</h2>
                 <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;" class="mt-2">
                      <div style="border: 1px solid var(--color-separator); padding: 1rem; border-radius: var(--radius-md);">
                           <p style="font-weight: 700;">Type</p>
                           <p><?= $listing['price_type'] ?></p>
                      </div>
                 </div>
            </div>
        </div>

        <!-- Sticky Sidebar -->
        <aside class="booking-card" style="border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-hover); height: fit-content; position: sticky; top: 100px;">
            <p style="font-size: 1.5rem; font-weight: 700;"><?= $listing['price'] ?> <?= $listing['price_unit'] ?></p>
            <p style="color: var(--color-muted); font-size: 0.875rem;">Prix total</p>
            
            <button class="btn btn-primary mt-4" style="width: 100%;">Réserver maintenant</button>
            
            <div class="mt-4" style="border-top: 1px solid var(--color-separator); padding-top: 1rem; font-size: 0.875rem;">
                <p>Vous ne serez pas encore débité.</p>
            </div>
        </aside>

    </div>
</div>

<?= $this->endSection() ?>
