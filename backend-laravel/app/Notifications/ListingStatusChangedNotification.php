<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Models\Listing;

class ListingStatusChangedNotification extends Notification
{
    use Queueable;

    public $listingId;
    public $listingTitle;
    public $newStatus;
    public $message;

    /**
     * Create a new notification instance.
     */
    public function __construct(int $listingId, string $listingTitle, string $newStatus, string $message)
    {
        $this->listingId = $listingId;
        $this->listingTitle = $listingTitle;
        $this->newStatus = $newStatus;
        $this->message = $message;
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
            'listing_id' => $this->listingId,
            'listing_title' => $this->listingTitle,
            'status' => $this->newStatus,
            'message' => $this->message,
            'type' => 'listing_status_changed'
        ];
    }
}
