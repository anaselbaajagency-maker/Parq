<!DOCTYPE html>
<html lang="<?= $locale ?? 'fr' ?>" dir="<?= ($locale ?? 'fr') === 'ar' ? 'rtl' : 'ltr' ?>">
<head>
    <meta charset="UTF-8">
    <title><?= $title ?? 'Parq - Louez plus que du stationnement' ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="<?= base_url('css/globals.css') ?>">
    <link rel="icon" type="image/x-icon" href="<?= base_url('favicon.ico') ?>">
    <!-- Add more meta tags or external scripts here -->
</head>
<body>

    <header class="header">
        <div class="container header-content">
            <a href="<?= base_url() ?>" class="logo">PARQ</a>
            
            <nav class="nav-links">
                <a href="<?= base_url('annonces') ?>" class="nav-item">Explorer</a>
                <?php if (session()->get('user')): ?>
                    <?php if (session()->get('user')['role'] === 'admin'): ?>
                        <a href="<?= base_url('admin') ?>" class="nav-item" style="color: #B91C1C;">Admin</a>
                    <?php endif; ?>
                    <a href="<?= base_url('tableau-de-bord') ?>" class="nav-item">Dashboard</a>
                    <a href="<?= base_url('logout') ?>" class="btn btn-secondary">Déconnexion</a>
                <?php else: ?>
                    <a href="<?= base_url('login') ?>" class="nav-item">Connexion</a>
                    <a href="<?= base_url('register') ?>" class="btn btn-primary">Inscription</a>
                <?php endif; ?>
                
                <div class="locale-switcher" style="margin-left: 1rem; border-left: 1px solid var(--color-separator); padding-left: 1rem; display: flex; gap: 0.5rem;">
                     <a href="<?= base_url('lang/fr') ?>" style="font-weight: <?= ($locale ?? 'fr') === 'fr' ? '700' : '400' ?>;">FR</a>
                     <a href="<?= base_url('lang/ar') ?>" style="font-weight: <?= ($locale ?? 'fr') === 'ar' ? '700' : '400' ?>;">AR</a>
                </div>
            </nav>
        </div>
    </header>

    <main>
        <?= $this->renderSection('content') ?>
    </main>

    <footer class="mt-4" style="border-top: 1px solid var(--color-separator); padding: 2rem 0;">
        <div class="container text-center">
            <p>&copy; <?= date('Y') ?> Parq. Tous droits réservés.</p>
        </div>
    </footer>

    <script src="<?= base_url('js/main.js') ?>"></script>
</body>
</html>
