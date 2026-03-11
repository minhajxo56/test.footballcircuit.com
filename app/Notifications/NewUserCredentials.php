<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

// Adding "implements ShouldQueue" is crucial for production so 
// the user doesn't wait 3 seconds for the page to load while the email sends!
class NewUserCredentials extends Notification implements ShouldQueue
{
    use Queueable;

    public string $password;

    public function __construct(string $password)
    {
        $this->password = $password;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to ' . config('app.name') . ' - Your Account Credentials')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your employee account has been successfully created.')
            ->line('Here are your secure login credentials:')
            ->line('**Email:** ' . $notifiable->email)
            ->line('**Password:** ' . $this->password)
            ->action('Login to Dashboard', url('/login'))
            ->line('For security reasons, you will be required to change this password immediately upon your first login.');
    }
}