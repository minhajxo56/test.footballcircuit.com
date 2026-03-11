<?php

namespace App\Notifications;

use App\Models\Letter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OfficialLetterIssued extends Notification implements ShouldQueue
{
    use Queueable;

    public Letter $letter;

    public function __construct(Letter $letter)
    {
        $this->letter = $letter;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        // Fallback just in case the issuer relationship is missing
        $issuerName = $this->letter->issuer->name ?? 'Management';

        return (new MailMessage)
            ->subject('New Official Document: ' . $this->letter->subject)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('You have received a new official communication from ' . $issuerName . '.')
            ->line('**Type:** ' . $this->letter->type)
            ->line('**Subject:** ' . $this->letter->subject)
            ->action('View & Acknowledge Letter', url('/letters/' . $this->letter->id))
            ->line('Please log into the portal to review this document and acknowledge receipt.');
    }
}