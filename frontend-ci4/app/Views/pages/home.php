<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<!-- Hero Section -->
<section class="hero" style="background-color: var(--color-separator); padding: var(--space-2xl) 0; border-radius: var(--radius-lg); margin: var(--space-md) 0;">
    <div class="container">
        <h1 style="font-size: 3rem; margin-bottom: var(--space-md);">Trouvez votre stationnement idéal au Maroc</h1>
        <p style="font-size: 1.25rem; color: var(--color-text); margin-bottom: var(--space-lg);">Louez, garez, et profitez en toute sérénité.</p>
        
        <div class="search-bar" style="background: white; padding: 1rem; border-radius: var(--radius-full); display: flex; gap: 1rem; box-shadow: var(--shadow-soft); max-width: 800px;">
            <input type="text" placeholder="Où allez-vous ?" style="flex: 1; border: none; outline: none; padding: 0 1rem;">
            <button class="btn btn-primary">Rechercher</button>
        </div>
    </div>
</section>

<!-- Categories -->
<section class="categories mt-4">
    <div class="container">
        <h2>Catégories populaires</h2>
        <div style="display: flex; gap: 1.5rem; overflow-x: auto; padding: 1rem 0;" class="no-scrollbar">
            <?php foreach ($categories as $cat): ?>
                <div class="category-card" style="text-align: center; min-width: 100px; cursor: pointer;">
                    <div style="width: 60px; height: 60px; background: var(--color-separator); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
                        <!-- Icon Placeholder -->
                        <span>🏙️</span>
                    </div>
                    <p class="mt-1"><?= $cat['name_fr'] ?? $cat['name'] ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- Featured Listings -->
<section class="featured mt-4">
    <div class="container">
        <h2>À la une</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 1rem;">
            <?php foreach ($listings as $listing): ?>
                <div class="listing-card" style="background: white; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-soft); transition: transform 0.2s ease;">
                    <div style="height: 200px; background: #EEE; display:flex; align-items:center; justify-content:center;">
                         <?php if (!empty($listing['image_hero'])): ?>
                             <img src="<?= $listing['image_hero'] ?>" style="width: 100%; height: 100%; object-fit: cover;">
                         <?php else: ?>
                             <span>📸</span>
                         <?php endif; ?>
                    </div>
                    <div style="padding: 1rem;">
                        <h3 style="font-size: 1.1rem; line-height: 1.2;"><?= $listing['title_fr'] ?? $listing['title'] ?></h3>
                        <p style="color: var(--color-muted); font-size: 0.875rem;"><?= $listing['price'] ?> <?= $listing['price_unit'] ?></p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<?= $this->endSection() ?>
