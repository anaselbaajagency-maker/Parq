<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="container" style="display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 160px);">
    <div style="width: 100%; max-width: 450px; padding: 2.5rem; border: 1px solid var(--color-separator); border-radius: var(--radius-lg); background: white; box-shadow: var(--shadow-soft);">
        <h1 class="text-center">Connexion</h1>
        <p class="text-center mt-1" style="color: var(--color-text);">Heureux de vous revoir !</p>

        <?php if (session()->getFlashdata('error')): ?>
            <div style="background: #FEE2E2; color: #B91C1C; padding: 1rem; border-radius: var(--radius-md); margin-top: 1.5rem;">
                <?= session()->getFlashdata('error') ?>
            </div>
        <?php endif; ?>

        <form action="<?= base_url('login') ?>" method="POST" class="mt-4">
            <div class="mt-2">
                <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Email</label>
                <input type="email" name="email" required style="width: 100%; padding: 0.875rem; border-radius: var(--radius-md); border: 1px solid #DDD; outline: none;">
            </div>
            
            <div class="mt-4">
                <label style="display: block; font-weight: 600; margin-bottom: 0.5rem;">Mot de passe</label>
                <input type="password" name="password" required style="width: 100%; padding: 0.875rem; border-radius: var(--radius-md); border: 1px solid #DDD; outline: none;">
            </div>

            <button type="submit" class="btn btn-primary mt-4" style="width: 100%;">Se connecter</button>
        </form>

        <p class="text-center mt-4">
            Pas encore de compte ? <a href="<?= base_url('register') ?>" style="color: var(--color-brand); font-weight: 700;">Inscrivez-vous</a>
        </p>
    </div>
</div>

<?= $this->endSection() ?>
