<?php

namespace App\Notifications;

use App\Models\UserApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ApplicationSubmitted extends Notification implements ShouldQueue
{
    use Queueable;

    public UserApplication $application;

    public function __construct(UserApplication $application)
    {
        $this->application = $application;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $employeeName = $this->application->user->name ?? 'An employee';

        return (new MailMessage)
            ->subject('New Application Submitted: ' . $this->application->title)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line("{$employeeName} has submitted a new {$this->application->type} application that requires your review.")
            ->line('**Title:** ' . $this->application->title)
            ->line('**Date:** ' . ($this->application->start_date ?? 'N/A'))
            ->action('Review Application', url('/applications/' . $this->application->id))
            ->line('Please log into the portal to approve, reject, or escalate this application.');
    }
}