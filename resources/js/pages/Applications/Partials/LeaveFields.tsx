import { useMemo } from 'react';
import { Calendar, Clock } from 'lucide-react';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
}

export default function LeaveFields({ data, setData }: Props) {
    const daysRequested = useMemo(() => {
        if (!data.start_date || !data.end_date) return 0;
        const start = new Date(data.start_date);
        const end = new Date(data.end_date);
        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays > 0 ? diffDays : 0;
    }, [data.start_date, data.end_date]);

    const setQuickDate = (daysToAdd: number, duration: number = 1) => {
        const start = new Date();
        start.setDate(start.getDate() + daysToAdd);
        
        const end = new Date(start);
        end.setDate(end.getDate() + (duration - 1));

        setData('start_date', start.toISOString().split('T')[0]);
        setData('end_date', end.toISOString().split('T')[0]);
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                            Start Date
                        </label>
                        <button 
                            type="button" 
                            onClick={() => setQuickDate(1, 1)} 
                            className="text-xs font-medium text-gray-500 underline-offset-4 transition-colors hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:text-gray-400 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        >
                            Tomorrow
                        </button>
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        <input 
                            type="date" 
                            value={data.start_date} 
                            onChange={e => setData('start_date', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:focus-visible:ring-gray-300 [color-scheme:light_dark]" 
                            required 
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                            End Date
                        </label>
                        <button 
                            type="button" 
                            onClick={() => setQuickDate(1, 3)} 
                            className="text-xs font-medium text-gray-500 underline-offset-4 transition-colors hover:text-gray-900 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:text-gray-400 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                        >
                            Next 3 Days
                        </button>
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                        <input 
                            type="date" 
                            min={data.start_date}
                            value={data.end_date} 
                            onChange={e => setData('end_date', e.target.value)}
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:focus-visible:ring-gray-300 [color-scheme:light_dark]" 
                            required 
                        />
                    </div>
                </div>
            </div>

            <div className="flex min-h-[24px] items-center text-sm text-gray-500 dark:text-gray-400">
                {daysRequested > 0 && (
                    <span className="flex items-center space-x-1.5 animate-in fade-in slide-in-from-bottom-1">
                        <Clock className="h-4 w-4" />
                        <span>Total duration: <span className="font-medium text-gray-900 dark:text-gray-100">{daysRequested} day{daysRequested > 1 ? 's' : ''}</span></span>
                    </span>
                )}
            </div>
        </div>
    );
}