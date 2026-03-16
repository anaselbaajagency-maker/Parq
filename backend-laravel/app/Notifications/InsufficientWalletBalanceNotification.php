<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InsufficientWalletBalanceNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('⚠️ Action requise : Vos annonces ont été mises en pause')
                    ->greeting('Bonjour ' . $notifiable->full_name . ',')
                    ->line('Nous vous contactons pour vous informer que votre solde de portefeuille est épuisé.')
                    ->line('Par conséquent, toutes vos annonces actives ont été automatiquement mises en pause.')
                    ->line('Pour réactiver vos annonces et continuer à les diffuser, veuillez recharger votre solde dès que possible.')
                    ->action('Recharger mon solde', url(env('FRONTEND_URL', 'http://localhost:3000') . '/fr/tableau-de-bord/wallet'))
                    ->line('Merci pour votre confiance !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
