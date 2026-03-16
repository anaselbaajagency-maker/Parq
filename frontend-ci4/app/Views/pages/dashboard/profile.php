<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="container mt-4">
    <div style="display: grid; grid-template-columns: 280px 1fr; gap: 2rem;">
        
         <!-- Reuse Sidebar Navigation (Ideally a component) -->
         <aside style="background: white; border: 1px solid var(--color-separator); border-radius: var(--radius-lg); padding: 1.5rem; height: fit-content;">
            <div style="text-align: center; padding-bottom: 1.5rem; border-bottom: 1px solid var(--color-separator);">
                <div style="width: 80px; height: 80px; background: var(--color-brand); border-radius: 50%; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 2rem; font-weight: 700;">
                    <?= substr($user['full_name'] ?? 'U', 0, 1) ?>
                </div>
                <h3 class="mt-2"><?= $user['full_name'] ?></h3>
                <p style="color: var(--color-muted); font-size: 0.875rem;"><?= $user['role'] ?></p>
            </div>
            
            <nav class="mt-4" style="display: flex; flex-direction: column; gap: 0.5rem;">
                <a href="<?= base_url('tableau-de-bord') ?>" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); transition: background 0.2s;">Vue d'ensemble</a>
                <a href="<?= base_url('profil') ?>" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); background: var(--color-separator); font-weight: 600;">Mon Profil</a>
                <a href="#" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); transition: background 0.2s;">Mes Annonces</a>
                <a href="#" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); transition: background 0.2s;">Portefeuille</a>
                <a href="<?= base_url('logout') ?>" style="padding: 0.75rem 1rem; border-radius: var(--radius-md); color: #B91C1C; margin-top: 1rem;">Déconnexion</a>
            </nav>
        </aside>

        <!-- Profile Form -->
        <div style="background: white; border: 1px solid var(--color-separator); padding: 2rem; border-radius: var(--radius-lg);">
            <h1>Mon Profil</h1>
            <p style="color: var(--color-text);">Gérez vos informations personnelles.</p>

            <form action="#" method="POST" class="mt-4" style="max-width: 600px;">
                <div class="mt-4">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Nom complet</label>
                    <input type="text" name="full_name" value="<?= $user['full_name'] ?>" style="width: 100%; padding: 0.875rem; border-radius: var(--radius-md); border: 1px solid #DDD;">
                </div>

                <div class="mt-4">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Email</label>
                    <input type="email" name="email" value="<?= $user['email'] ?>" disabled style="width: 100%; padding: 0.875rem; border-radius: var(--radius-md); border: 1px solid #DDD; background: var(--color-separator); color: var(--color-muted);">
                    <p style="font-size: 0.75rem; color: var(--color-muted); margin-top: 0.25rem;">L'email ne peut pas être modifié.</p>
                </div>

                <div class="mt-4">
                    <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Téléphone</label>
                    <input type="text" name="phone" value="<?= $user['phone'] ?? '' ?>" style="width: 100%; padding: 0.875rem; border-radius: var(--radius-md); border: 1px solid #DDD;">
                </div>

                <button type="submit" class="btn btn-primary mt-4">Enregistrer les modifications</button>
            </form>
        </div>

    </div>
</div>

<?= $this->endSection() ?>
