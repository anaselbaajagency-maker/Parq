<?= $this->extend('layout/main') ?>

<?= $this->section('content') ?>

<div class="container mt-4">
    <h1>Administration Parq</h1>
    <p style="color: var(--color-text);">Gestion globale du système.</p>

    <!-- Stats Grid -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;" class="mt-4">
        <div style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
            <p style="color: var(--color-muted); font-size: 0.875rem;">Utilisateurs</p>
            <h2 style="font-size: 2rem;"><?= $stats['users_total'] ?? 0 ?></h2>
        </div>
        <div style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
            <p style="color: var(--color-muted); font-size: 0.875rem;">Annonces</p>
            <h2 style="font-size: 2rem;"><?= $stats['listings_total'] ?? 0 ?></h2>
        </div>
        <div style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
            <p style="color: var(--color-muted); font-size: 0.875rem;">Volumes (DH)</p>
            <h2 style="font-size: 2rem;"><?= number_format($stats['total_volume'] ?? 0, 2) ?></h2>
        </div>
        <div style="background: white; border: 1px solid var(--color-separator); padding: 1.5rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-soft);">
            <p style="color: var(--color-muted); font-size: 0.875rem;">En attente</p>
            <h2 style="font-size: 2rem; color: #B91C1C;"><?= $stats['pending_approvals'] ?? 0 ?></h2>
        </div>
    </div>

    <!-- Users Table -->
    <div class="mt-4" style="background: white; border: 1px solid var(--color-separator); border-radius: var(--radius-lg); overflow: hidden;">
        <div style="padding: 1.5rem; border-bottom: 1px solid var(--color-separator);">
            <h3>Derniers Utilisateurs</h3>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
            <thead style="background: var(--color-separator);">
                <tr>
                    <th style="padding: 1rem; text-align: left;">Nom</th>
                    <th style="padding: 1rem; text-align: left;">Email</th>
                    <th style="padding: 1rem; text-align: left;">Rôle</th>
                    <th style="padding: 1rem; text-align: left;">Date</th>
                    <th style="padding: 1rem; text-align: center;">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($users as $u): ?>
                    <tr style="border-bottom: 1px solid var(--color-separator);">
                        <td style="padding: 1rem;"><?= $u['full_name'] ?></td>
                        <td style="padding: 1rem;"><?= $u['email'] ?></td>
                        <td style="padding: 1rem;"><span style="background: #EEE; padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.75rem;"><?= strtoupper($u['role']) ?></span></td>
                        <td style="padding: 1rem;"><?= date('d/m/Y', strtotime($u['created_at'])) ?></td>
                        <td style="padding: 1rem; text-align: center;">
                            <a href="#" style="color: var(--color-brand); font-weight: 600;">Gérer</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

</div>

<?= $this->endSection() ?>
