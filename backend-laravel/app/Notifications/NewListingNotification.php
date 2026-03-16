<?php

namespace App\Notifications;

use App\Models\Listing;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewListingNotification extends Notification
{
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
            'type' => 'new_listing',
            'listing_id' => $this->listing->id,
            'listing_title' => $this->listing->title,
            'user_name' => $this->listing->user->full_name,
            'title' => 'Nouvelle Annonce',
            'message' => $this->listing->title.' par '.$this->listing->user->full_name,
            'action_url' => '/admin/listings',
            'action_label' => 'Modérer l\'annonce',
        ];
    }
}
