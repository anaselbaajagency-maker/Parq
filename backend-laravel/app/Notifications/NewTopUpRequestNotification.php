<?php

namespace App\Notifications;

use App\Models\TopUpRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTopUpRequestNotification extends Notification
{
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
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'new_topup_request',
            'topup_id' => $this->topUpRequest->id,
            'user_name' => $this->topUpRequest->user->full_name,
            'amount' => $this->topUpRequest->amount,
            'title' => 'Nouvelle Demande de Recharge',
            'message' => 'Demande de '.$this->topUpRequest->amount.' DH par '.$this->topUpRequest->user->full_name,
            'action_url' => '/admin/wallets',
            'action_label' => 'Gérer les recharges',
        ];
    }
}
