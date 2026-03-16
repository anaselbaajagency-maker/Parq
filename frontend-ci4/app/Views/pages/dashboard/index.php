<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="container mt-4">
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem;">
        
        <!-- Sidebar Navigation -->
        <aside style="background: white; border: 1px solid var(--color-separator); border-radius: var(--radius-lg); padding: 1.5rem; height: fit-content;">
            <div style="text-align: center; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-separator);">
                <div style="width: 80px; height: 80px; background: var(--color-brand); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700;">
                    <?= substr($user['full_name'] ?? 'U', 0, 1) ?>
                </div>
                <h3 class="mt-2"><?= $user['full_name'] ?></h3>
                <p style="color: var(--color-muted); font-size: 0.875rem;"><?= $user['role'] ?></p>
            </div>
            
            <nav class="mt-4" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <a href="<?= base_url('tableau-de-bord') ?>" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); background: var(--color-separator); font-weight: 600;">Vue d'ensemble</a>
                <a href="<?= base_url('profil') ?>" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); transition: background 0.2s;">Mon Profil</a>
                <a href="#" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); transition: background 0.2s;">Mes Annonces</a>
                <a href="#" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); transition: background 0.2s;">Portefeuille</a>
                <a href="<?= base_url('logout') ?>" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); color: #B91C1C; margin-top: 1rem;">Déconnexion</a>
            </nav>
        </aside>

        <!-- Main Content -->
        <div>
            <h1>Bonjour, <?= explode(' ', $user['full_name'])[0] ?> !</h1>
            <p style="color: var(--color-text);">Voici un aperçu de votre activité.</p>

            <!-- Stats Grid -->
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;" class="mt-4">
                <div style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
                    <p style="color: var(--color-muted); font-size: 0.875rem;">Annonces actives</p>
                    <h2 style="font-size: 2rem;"><?= $stats['listings_count'] ?? 0 ?></h2>
                </div>
                <div style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
                    <p style="color: var(--color-muted); font-size: 0.875rem;">Réservations</p>
                    <h2 style="font-size: 2rem;"><?= $stats['bookings_count'] ?? 0 ?></h2>
                </div>
                <div style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
                    <p style="color: var(--color-muted); font-size: 0.875rem;">Gains totaux</p>
                    <h2 style="font-size: 2rem;"><?= $stats['total_earnings'] ?? 0 ?> DH</h2>
                </div>
            </div>

            <!-- Recent Activity Placeholder -->
            <div class="mt-4" style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg);">
                <h3>Activité récente</h3>
                <div style="padding: 3rem 0; text-align: center; color: var(--color-muted);">
                    <p>Aucune activité récente à afficher.</p>
                </div>
            </div>
        </div>

    </div>
</div>

<?= $this->endSection() ?>
