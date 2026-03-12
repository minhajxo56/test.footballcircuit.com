<?php

namespace App\Notifications;

use App\Models\UserApplication;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationEscalated extends Notification implements ShouldQueue
{
    use Queueable;

    public UserApplication $application;
    public User $escalatedBy;

    public function __construct(UserApplication $application, User $escalatedBy)
    {
        $this->application = $application;
        $this->escalatedBy = $escalatedBy;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $employeeName = $this->application->user->name ?? 'An employee';
        $managerName = $this->escalatedBy->name ?? 'A manager';

        return (new MailMessage)
            ->subject('Application Escalated: ' . $this->application->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line("An application from {$employeeName} has been escalated to upper management by {$managerName}.")
            ->line('**Application Type:** ' . $this->application->type)
            ->line('**Title:** ' . $this->application->title)
            ->action('Review Escalated Application', url('/applications/' . $this->application->id))
            ->line('Please log in to review and resolve this escalated request.');
    }
}