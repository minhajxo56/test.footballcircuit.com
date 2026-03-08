<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        foreach (static::getRecordableEvents() as $event) {
            static::$event(function ($model) use ($event) {
                $model->generateLog($event);
            });
        }
    }

    protected static function getRecordableEvents(): array
    {
        if (method_exists(static::class, 'recordEvents')) {
            return static::recordEvents();
        }
        return ['created', 'updated', 'deleted', 'restored'];
    }

    protected function generateLog(string $event)
    {
        // Don't log if there's no changes on update
        if ($event === 'updated' && empty($this->getChanges())) {
            return;
        }

        ActivityLog::create([
            'user_id'    => Auth::id(),
            'action'     => $event,
            'model_type' => get_class($this),
            'model_id'   => $this->id,
            'old_data'   => $this->getOldData($event),
            'new_data'   => $this->getNewData($event),
            'ip_address' => request()->ip(),
        ]);
    }

    protected function getOldData(string $event): ?array
    {
        if ($event === 'created') return null;
        
        // For updates, we only want the original values of the fields that changed
        if ($event === 'updated') {
            return array_intersect_key($this->getOriginal(), $this->getChanges());
        }

        return $this->getOriginal();
    }

    protected function getNewData(string $event): ?array
    {
        if ($event === 'deleted') return null;
        if ($event === 'updated') return $this->getChanges();
        
        return $this->getAttributes();
    }
}