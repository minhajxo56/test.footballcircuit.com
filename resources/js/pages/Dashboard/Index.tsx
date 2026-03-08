import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import DailyStatusTracker from '@/components/Dashboard/DailyStatusTracker';
import PeakOperationalHour from '@/components/Dashboard/PeakOperationalHour';
import WorkforceDeploymentChart from '@/components/Dashboard/WorkforceDeploymentChart';
import { CalendarClock, FileText, Luggage, MapPin, PlaneTakeoff, UserCheck, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8 p-4 md:p-8">
                
                <div>
                    <DailyStatusTracker />
                </div>

                {/* Operational Analytics Section (Now stacked vertically using a single column layout) */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">Operational Analytics</h2>
                    {/* Changed from lg:grid-cols-2 to grid-cols-1 to prevent side-by-side rendering */}
                    <div className="grid gap-4 grid-cols-1">
                        <PeakOperationalHour />
                        <WorkforceDeploymentChart />
                    </div>
                </div>

                {/* Daily Operations Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">Daily Operations</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        
                        <div className="flex flex-col justify-center space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Employees</span>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                    <Users className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">124</span>
                                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">Across all active departments</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">On Duty Today</span>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                    <UserCheck className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">98</span>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ 124</span>
                                </div>
                                <span className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-500">26 personnel on day off / leave</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Field Assignments</span>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                    <MapPin className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">3</span>
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/ 5</span>
                                </div>
                                <span className="mt-1 text-xs font-medium text-green-600 dark:text-green-500">2 personnel available for dispatch</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Requests</span>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    <FileText className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">12</span>
                                <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">Requires HR or Manager review</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">Tour & Travel Status</h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        
                        <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                                <PlaneTakeoff className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Tours</span>
                                <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">3</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
                                <CalendarClock className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Upcoming Tours</span>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">2</span>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Next 7 days</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                                <Luggage className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Staff on Tour</span>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">14</span>
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Currently deployed</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}