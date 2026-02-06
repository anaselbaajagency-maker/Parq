<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ListingApprovedNotification extends Notification
{
    use Queueable;

    protected $listing;

    /**
     * Create a new notification instance.
     */
    public function __construct($listing)
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
        return ['database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Votre annonce a été validée')
                    ->line("Votre annonce '{$this->listing->title}' a été validée par notre équipe.")
                    ->action('Voir mon annonce', url('/dashboard/listings'))
                    ->line('Merci de faire confiance à Parq!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'listing_id' => $this->listing->id,
            'title' => 'Annonce Validée',
            'message' => "Votre annonce '{$this->listing->title}' a été validée et est maintenant en ligne.",
            'type' => 'listing_approved'
        ];
    }
}
