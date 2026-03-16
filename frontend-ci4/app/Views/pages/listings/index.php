<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="container mt-4">
    <h1>Explorez les annonces</h1>
    
    <div style="display: grid; grid-template-columns: 250px 1fr; gap: 2rem; margin-top: 2rem;">
        <!-- Filters Sidebar -->
        <aside class="filters-sidebar" style="background: var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); height: fit-content;">
            <h3>Filtres</h3>
            <form action="<?= base_url('annonces') ?>" method="GET" class="mt-2">
                <div class="mt-2">
                    <label>Prix max</label>
                    <input type="number" name="price_max" value="<?= $filters['price_max'] ?? '' ?>" style="width: 100%; padding: 0.5rem; border-radius: var(--radius-sm); border: 1px solid #DDD;">
                </div>
                <button type="submit" class="btn btn-primary mt-4" style="width: 100%;">Filtrer</button>
            </form>
        </aside>

        <!-- Listings Grid -->
        <div class="listings-results text-center">
            <?php if (empty($listings)): ?>
                <div style="padding: 4rem 0;">
                    <p>Aucune annonce trouvée.</p>
                </div>
            <?php else: ?>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; text-align: left;">
                    <?php foreach ($listings as $listing): ?>
                        <a href="<?= base_url('annonce/' . ($listing['slug'] ?? $listing['id'])) ?>" class="listing-card" style="background: white; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-soft); transition: transform 0.2s ease; display: block;">
                            <div style="height: 180px; background: #EEE; display:flex; align-items:center; justify-content:center;">
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
                        </a>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>

<?= $this->endSection() ?>
