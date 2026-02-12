<?php

namespace App\Notifications;

use App\Models\TopUpRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TopUpApprovedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected TopUpRequest $topUpRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(TopUpRequest $topUpRequest)
    {
        $this->topUpRequest = $topUpRequest;
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
            ->subject('Recharge approuvée - '.$this->topUpRequest->amount.' SOLD DIRHAM')
            ->greeting('Bonjour '.$notifiable->full_name.',')
            ->line('Votre demande de recharge a été approuvée!')
            ->line('Montant crédité: '.$this->topUpRequest->amount.' SOLD DIRHAM')
            ->line('Méthode: '.$this->topUpRequest->method_label)
            ->action('Voir mon portefeuille', url('/wallet'))
            ->line('Merci de votre confiance!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'topup_approved',
            'amount' => $this->topUpRequest->amount,
            'method' => $this->topUpRequest->method,
            'message' => 'Recharge de '.$this->topUpRequest->amount.' SOLD DIRHAM approuvée.',
            'action_url' => '/wallet',
            'action_label' => 'Voir portefeuille',
        ];
    }
}
