<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LowBalanceNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected int $balance;

    /**
     * Create a new notification instance.
     */
    public function __construct(int $balance)
    {
        $this->balance = $balance;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Solde faible - Rechargez votre portefeuille')
            ->greeting('Bonjour '.$notifiable->full_name.',')
            ->line('Votre solde SOLD DIRHAM est actuellement de '.$this->balance.' crédits.')
            ->line('Si votre solde atteint 0, vos annonces actives seront automatiquement masquées.')
            ->action('Recharger maintenant', url('/wallet/topup'))
            ->line('Rechargez dès maintenant pour maintenir la visibilité de vos annonces.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'low_balance',
            'balance' => $this->balance,
            'message' => 'Votre solde est faible: '.$this->balance.' SOLD DIRHAM.',
            'action_url' => '/wallet/topup',
            'action_label' => 'Recharger',
        ];
    }
}
