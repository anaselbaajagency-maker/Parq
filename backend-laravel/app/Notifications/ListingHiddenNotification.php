<?php

namespace App\Notifications;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ListingHiddenNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected Listing $listing;

    /**
     * Create a new notification instance.
     */
    public function __construct(Listing $listing)
    {
        $this->listing = $listing;
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
            ->subject('Votre annonce a été masquée - Solde insuffisant')
            ->greeting('Bonjour ' . $notifiable->full_name . ',')
            ->line('Votre annonce "' . $this->listing->title . '" a été automatiquement masquée car votre solde de SOLD DIRHAM est insuffisant.')
            ->line('Pour réactiver votre annonce, veuillez recharger votre portefeuille.')
            ->action('Recharger maintenant', url('/wallet/topup'))
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
            'type' => 'listing_hidden',
            'listing_id' => $this->listing->id,
            'listing_title' => $this->listing->title,
            'message' => 'Votre annonce "' . $this->listing->title . '" a été masquée pour solde insuffisant.',
            'action_url' => '/wallet/topup',
            'action_label' => 'Recharger',
        ];
    }
}
