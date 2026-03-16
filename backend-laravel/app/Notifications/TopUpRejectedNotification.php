<?php

namespace App\Notifications;

use App\Models\TopUpRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TopUpRejectedNotification extends Notification
{
    protected TopUpRequest $topUpRequest;
    protected string $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct(TopUpRequest $topUpRequest, string $reason)
    {
        $this->topUpRequest = $topUpRequest;
        $this->reason = $reason;
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
            ->subject('Recharge refusée - '.$this->topUpRequest->amount.' SOLD DIRHAM')
            ->greeting('Bonjour '.$notifiable->full_name.',')
            ->line('Votre demande de recharge a été malheureusement refusée.')
            ->line('Montant concerné: '.$this->topUpRequest->amount.' SOLD DIRHAM')
            ->line('Motif: '.$this->reason)
            ->action('Voir mon portefeuille', url('/wallet'))
            ->line('Si vous avez des questions, n\'hésitez pas à nous contacter.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'topup_rejected',
            'amount' => $this->topUpRequest->amount,
            'reason' => $this->reason,
            'title' => 'Recharge Refusée',
            'message' => 'Votre recharge de '.$this->topUpRequest->amount.' DH a été refusée. Motif: '.$this->reason,
            'action_url' => '/wallet',
            'action_label' => 'Voir portefeuille',
        ];
    }
}
