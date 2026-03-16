<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminWalletUpdateNotification extends Notification
{
    protected int $amount;
    protected string $type; // credit or debit
    protected string $description;

    /**
     * Create a new notification instance.
     */
    public function __construct(int $amount, string $type, string $description)
    {
        $this->amount = $amount;
        $this->type = $type;
        $this->description = $description;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $action = $this->type === 'credit' ? 'Crédit' : 'Débit';
        return [
            'type' => 'admin_wallet_update',
            'amount' => $this->amount,
            'update_type' => $this->type,
            'title' => $action.' Administratif',
            'message' => $action.' de '.$this->amount.' DH. Motif: '.$this->description,
            'action_url' => '/wallet',
            'action_label' => 'Voir portefeuille',
        ];
    }
}
