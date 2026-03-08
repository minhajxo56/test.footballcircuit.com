import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Search, Plus, MapPin, Calendar, Plane, Users, CheckCircle2, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Tours & Travel', href: '/tours' }];

// Helper to generate consistent colors and initials from names
const getAvatarProps = (name: string, index: number) => {
    const initial = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['bg-blue-500', 'bg-emerald-500', 'bg-orange-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    return { initial, color: colors[index % colors.length] };
};

export default function Index({ tours }: { tours: any }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('all');

    const toursList = tours?.data || [];

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'active': return { label: 'Active Deployment', badgeClass: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400', icon: Plane };
            case 'planned': return { label: 'Upcoming', badgeClass: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400', icon: Clock };
            case 'completed': return { label: 'Completed', badgeClass: 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800/50 dark:bg-gray-800/30 dark:text-gray-400', icon: CheckCircle2 };
            default: return { label: status, badgeClass: 'border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400', icon: Plane };
        }
    };

    const filteredTours = toursList.filter((tour: any) => {
        const matchesSearch = tour.name.toLowerCase().includes(searchQuery.toLowerCase()) || tour.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || tour.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tours & Deployments" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-6 p-4 md:p-8">
                
                <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Tour Deployments</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage out-of-station travel and personnel deployments.</p>
                    </div>
                    
                    <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0 md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tours or locations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                            />
                        </div>
                        <Link 
                            href="/tours/create" 
                            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                        >
                            <Plus className="mr-2 h-4 w-4" /> New Tour
                        </Link>
                    </div>
                </div>

                <div className="flex w-full overflow-hidden">
                    <div className="flex w-full overflow-x-auto pb-2 scrollbar-hide sm:pb-0">
                        <div className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                            {['all', 'active', 'planned', 'completed'].map(f => (
                                <button 
                                    key={f} 
                                    onClick={() => setFilter(f)}
                                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium capitalize ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 ${
                                        filter === f 
                                        ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50' 
                                        : 'hover:text-gray-900 dark:hover:text-gray-50'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTours.map((tour: any) => {
                        const { label, badgeClass, icon: StatusIcon } = getStatusConfig(tour.status);
                        const assignedUsers = tour.users || [];
                        const totalAssigned = tour.users_count || assignedUsers.length;
                        
                        return (
                            <div key={tour.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
                                
                                <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-gray-800">
                                    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${badgeClass}`}>
                                        <StatusIcon className="mr-1.5 h-3.5 w-3.5" /> 
                                        {label}
                                    </div>
                                </div>

                                <div className="flex flex-1 flex-col space-y-3 p-5">
                                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 line-clamp-1 dark:text-gray-50" title={tour.name}>
                                        {tour.name}
                                    </h3>
                                    
                                    <div className="flex flex-col space-y-2.5">
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                                            <span className="truncate">{tour.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                                            <span className="truncate">
                                                {new Date(tour.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(tour.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
                                    <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                        <Users className="h-4 w-4" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Team</span>
                                    </div>
                                    
                                    <div className="flex items-center">
                                        <div className="flex -space-x-2 overflow-hidden">
                                            {assignedUsers.slice(0, 4).map((user: any, index: number) => {
                                                const name = user.employee ? `${user.employee.first_name} ${user.employee.last_name}` : user.name;
                                                const { initial, color } = getAvatarProps(name, index);
                                                return (
                                                    <div key={user.id} className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-medium text-white ring-2 ring-white dark:ring-gray-950 ${color}`} title={name}>
                                                        {initial}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {totalAssigned > 4 && (
                                            <div className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                                                +{totalAssigned - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <Link href={`/tours/${tour.id}`} className="absolute inset-0 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300">
                                    <span className="sr-only">View Details for {tour.name}</span>
                                </Link>
                            </div>
                        );
                    })}
                </div>

                {filteredTours.length === 0 && (
                    <div className="flex w-full flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-gray-200 py-16 text-center dark:border-gray-800">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                            <Plane className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">No tours found</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}