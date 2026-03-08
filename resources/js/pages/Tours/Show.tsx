import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, MapPin, Calendar, Plane, Users, CheckCircle2, Clock, Edit, Send } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tours & Travel', href: '/tours' },
    { title: 'Tour Details', href: '#' },
];

const getAvatarProps = (name: string, index: number) => {
    const initial = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    return { initial, color: colors[index % colors.length] };
};

export default function Show({ tour }: { tour: any }) {
    // Transform backend users into UI format
    const employees = (tour.users || []).map((user: any, index: number) => {
        const name = user.employee ? `${user.employee.first_name} ${user.employee.last_name}` : user.name;
        const dept = user.employee?.department?.name || 'Unassigned';
        const role = user.role?.name || 'Unassigned';
        const { initial, color } = getAvatarProps(name, index);
        
        return { id: user.id, name, dept, role, initial, color };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={tour.name} />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col space-y-6 p-4 md:p-8">
                
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                    <div className="flex items-center space-x-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            <Plane className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">{tour.name}</h1>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{tour.location}</span>
                        </div>
                    </div>
                    <div className="flex w-full items-center space-x-2 sm:w-auto">
                        <Link 
                            href="/tours" 
                            className="inline-flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 sm:flex-none"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back
                        </Link>
                        <Link 
                            href={`/tours/${tour.id}/edit`} 
                            className="inline-flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 sm:flex-none"
                        >
                            <Edit className="mr-2 h-4 w-4" /> Edit Tour
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    
                    <div className="flex flex-col space-y-6 lg:col-span-2">
                        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Tour Overview</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Destination</span>
                                        <div className="flex items-center text-gray-900 dark:text-gray-100">
                                            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{tour.location}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Duration</span>
                                        <div className="flex items-center text-gray-900 dark:text-gray-100">
                                            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                            <span className="font-medium">
                                                {new Date(tour.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - {new Date(tour.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</span>
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${
                                                tour.status === 'active' ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400' :
                                                tour.status === 'planned' ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400' :
                                                'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800/50 dark:bg-gray-800/30 dark:text-gray-400'
                                            }`}>
                                                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> {tour.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 space-y-2 border-t border-gray-100 pt-6 dark:border-gray-800">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Description & Objectives</span>
                                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                        {tour.description || "No description provided for this tour."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-6">
                        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
                                <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-50">
                                    <Users className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    Assigned Team
                                </h3>
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                                    {employees.length}
                                </span>
                            </div>
                            
                            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                                {employees.length > 0 ? employees.map((emp: typeof employees[0]) => (
                                    <div key={emp.id} className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ${emp.color}`}>
                                                {emp.initial}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{emp.name}</span>
                                                <span className="truncate text-xs text-gray-500 dark:text-gray-400">{emp.role} • {emp.dept}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">No personnel assigned yet.</div>
                                )}
                            </div>
                            
                            <div className="border-t border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
                                <button disabled={employees.length === 0} className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300">
                                    <Send className="mr-2 h-4 w-4" /> Notify Team
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AppLayout>
    );
}