import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Calendar, Clock, MapPin, Coffee, AlertCircle, Building2, ChevronRight, X, Send } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Schedule', href: '/my-schedule' },
];

type AssignmentType = 'office' | 'field' | 'off';

interface ScheduleDay {
    id: number;
    date: string;
    dayName: string;
    type: AssignmentType;
    officeShifts?: { start: string; end: string }[];
    fieldTasks?: { time: string; location: string; task: string }[];
}

export default function ViewRoster({ mySchedule = [] }: { mySchedule: ScheduleDay[] }) {
    // Bypass strict Inertia generics by pulling props directly and casting
    const { props } = usePage();
    const auth = props.auth as any;
    const user = auth?.user; 
    const employee = user?.employee; 
    
    // Fallbacks for user info to prevent crashes
    const initials = employee && employee.first_name && employee.last_name
        ? `${employee.first_name[0]}${employee.last_name[0]}` 
        : (user?.name?.substring(0, 2).toUpperCase() || 'U');
        
    const fullName = employee 
        ? `${employee.first_name} ${employee.last_name}` 
        : (user?.name || 'Employee');
        
    const jobInfo = employee?.department 
        ? `${user?.role?.name || 'Employee'} • ${employee.department.name} Department` 
        : (user?.email || '');

    const [selectedDay, setSelectedDay] = useState<ScheduleDay | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        type: 'general_request',
        title: '',
        details: '',
        start_date: '',
        end_date: '',
    });

    const openRequestModal = (day: ScheduleDay) => {
        setSelectedDay(day);
        setData({
            type: 'general_request',
            title: `Schedule Change Request: ${day.date}`,
            details: '',
            start_date: day.date,
            end_date: day.date,
        });
    };

    const closeRequestModal = () => {
        setSelectedDay(null);
        reset();
    };

    const submitRequest = (e: React.FormEvent) => {
        e.preventDefault();
        post('/applications', {
            preserveScroll: true,
            onSuccess: () => closeRequestModal(),
        });
    };

    const getTypeDetails = (type: AssignmentType) => {
        switch (type) {
            case 'office': return { icon: Building2, colorClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800', label: 'Office' };
            case 'field': return { icon: MapPin, colorClass: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800', label: 'Field' };
            case 'off': return { icon: Coffee, colorClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700', label: 'Day Off' };
        }
    };

    // Find the first field task for the alert banner safely
    const nextFieldTask = mySchedule?.find(d => d.type === 'field' && (d.fieldTasks?.length ?? 0) > 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Schedule" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-6 p-4 md:p-8">
                
                <div className="flex flex-col items-start justify-between space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:space-y-0 dark:border-gray-800 dark:bg-gray-950">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-900 text-lg font-bold text-gray-50 dark:bg-gray-50 dark:text-gray-900">
                            {initials}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">{fullName}</h2>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{jobInfo}</p>
                        </div>
                    </div>
                    
                    {mySchedule && mySchedule.length > 0 && (
                        <div className="inline-flex items-center space-x-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50">
                            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span>{new Date(mySchedule[0].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(mySchedule[mySchedule.length-1].date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    )}
                </div>

                {nextFieldTask && nextFieldTask.fieldTasks && (
                    <div className="relative rounded-lg border border-purple-200 bg-purple-50 p-4 text-sm text-purple-900 dark:border-purple-900/50 dark:bg-purple-900/20 dark:text-purple-200">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="mt-0.5 h-4 w-4 text-purple-600 dark:text-purple-400" />
                            <div className="space-y-1">
                                <h5 className="font-medium leading-none tracking-tight">Upcoming Field Assignment: {nextFieldTask.dayName}</h5>
                                <p className="text-purple-700/80 dark:text-purple-300/80">
                                    You have {nextFieldTask.fieldTasks.length} task(s) scheduled. Please report to {nextFieldTask.fieldTasks[0].location} at {nextFieldTask.fieldTasks[0].time}.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {mySchedule?.map((day) => {
                        const { icon: TypeIcon, colorClass, label } = getTypeDetails(day.type);
                        
                        return (
                            <div key={day.id} className="group flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
                                <div className="p-5">
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-50">{day.dayName}</p>
                                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{day.date}</p>
                                        </div>
                                        <div className={`inline-flex items-center space-x-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${colorClass}`}>
                                            <TypeIcon className="h-3 w-3" />
                                            <span>{label}</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-3">
                                        {day.type === 'off' && (
                                            <div className="py-8 text-center text-sm font-medium text-gray-400 dark:text-gray-600">
                                                Rest Day
                                            </div>
                                        )}

                                        {day.type === 'office' && day.officeShifts && (
                                            <div className="space-y-2">
                                                {day.officeShifts.map((shift, idx) => (
                                                    <div key={idx} className="flex items-center justify-between rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm dark:border-gray-800/50 dark:bg-gray-900/50">
                                                        <div className="flex items-center space-x-2 font-medium text-gray-900 dark:text-gray-100">
                                                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                            <span>{shift.start} - {shift.end}</span>
                                                        </div>
                                                        <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500">Shift {idx + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {day.type === 'field' && day.fieldTasks && (
                                            <div className="relative ml-2 space-y-4 border-l border-gray-200 pl-4 dark:border-gray-800">
                                                {day.fieldTasks.map((task, idx) => (
                                                    <div key={idx} className="relative">
                                                        <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-gray-900 ring-4 ring-white dark:bg-gray-50 dark:ring-gray-950" />
                                                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">{task.time}</p>
                                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{task.location}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{task.task}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {day.type !== 'off' && (
                                    <div className="border-t border-gray-100 bg-gray-50/50 px-5 py-3 dark:border-gray-800 dark:bg-gray-900/20">
                                        <button 
                                            onClick={() => openRequestModal(day)}
                                            className="flex w-full items-center justify-between text-xs font-medium text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:text-gray-400 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                        >
                                            <span>Request Change</span>
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                
                {(!mySchedule || mySchedule.length === 0) && (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center dark:border-gray-800 dark:bg-gray-900/50">
                        <Calendar className="mb-4 h-10 w-10 text-gray-400" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">No schedule generated</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Your upcoming schedule has not been published yet.</p>
                    </div>
                )}
            </div>

            {selectedDay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex flex-col space-y-1.5 border-b border-gray-100 p-6 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-50">Request Change</h3>
                                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{selectedDay.dayName}, {selectedDay.date}</p>
                                </div>
                                <button 
                                    onClick={closeRequestModal} 
                                    className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:ring-offset-gray-950 dark:focus:ring-gray-300"
                                >
                                    <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>
                        </div>
                        
                        <form onSubmit={submitRequest}>
                            <div className="space-y-4 p-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                        Reason for change
                                    </label>
                                    <textarea 
                                        rows={4}
                                        value={data.details}
                                        onChange={(e) => setData('details', e.target.value)}
                                        placeholder="Explain why you need to change this shift..."
                                        className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                        required
                                    />
                                    {errors.details && <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">{errors.details}</p>}
                                </div>
                                <div className="rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                                    This request will be sent to your department manager for approval.
                                </div>
                            </div>
                            
                            <div className="flex flex-col-reverse border-t border-gray-100 p-6 sm:flex-row sm:justify-end sm:space-x-2 dark:border-gray-800">
                                <button 
                                    type="button" 
                                    onClick={closeRequestModal} 
                                    className="mt-2 inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 sm:mt-0 sm:w-auto dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 sm:w-auto dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                >
                                    <Send className="mr-2 h-4 w-4" />
                                    {processing ? 'Sending...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}