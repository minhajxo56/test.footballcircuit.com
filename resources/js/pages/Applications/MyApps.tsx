import { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Plus, Clock, CheckCircle, XCircle, FileText, Palmtree, Wallet, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Applications', href: '/my-applications' },
];

export default function MyApps({ applications = [] }: { applications: any[] }) {
    const { flash } = usePage<any>().props;
    const [filter, setFilter] = useState('all');

    // Parse the DB data into UI friendly formats
    const userApps = useMemo(() => {
        return applications.map(app => {
            const cleanDetails = app.details.replace(/\n\n--- Budget: .*/, '');
            return {
                id: app.id,
                type: app.type,
                title: app.title,
                status: app.status,
                date: new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                details: cleanDetails,
            };
        });
    }, [applications]);

    const getStatusStyle = (status: string) => {
        const baseStyle = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors";
        switch (status) {
            case 'approved': 
                return `${baseStyle} border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400`;
            case 'pending': 
                return `${baseStyle} border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400`;
            case 'rejected': 
                return `${baseStyle} border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400`;
            case 'escalated': 
                return `${baseStyle} border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-900/20 dark:text-purple-400`;
            default: 
                return `${baseStyle} border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800/50 dark:bg-gray-800/30 dark:text-gray-400`;
        }
    };

    const StatusIcon = ({ status }: { status: string }) => {
        const props = { className: "h-3.5 w-3.5 shrink-0" };
        switch (status) {
            case 'approved': return <CheckCircle {...props} />;
            case 'pending': return <Clock {...props} />;
            case 'rejected': return <XCircle {...props} />;
            case 'escalated': return <AlertCircle {...props} />;
            default: return null;
        }
    };

    const getTypeIcon = (type: string) => {
        const props = { className: "h-4 w-4 text-gray-600 dark:text-gray-400 shrink-0" };
        switch (type) {
            case 'leave': return <Palmtree {...props} />;
            case 'expense': return <Wallet {...props} />;
            default: return <FileText {...props} />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Applications" />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 md:p-8">
                
                {flash?.success && (
                    <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-950/50 dark:border-green-900">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{flash.success}</h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">My Requests</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Track the status of your submitted applications.</p>
                    </div>
                    <Link 
                        href="/applications/create" 
                        className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Request
                    </Link>
                </div>

                <div className="mb-6">
                    <div className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                        {['all', 'pending', 'approved', 'rejected', 'escalated'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 capitalize ${
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {userApps.filter(app => filter === 'all' || app.status === filter).map(app => (
                        <div 
                            key={app.id} 
                            className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
                        >
                            <div className="mb-4 flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                                        {getTypeIcon(app.type)}
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-50">{app.title}</h3>
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{app.date}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-4 flex-1">
                                <p className="text-sm text-gray-600 line-clamp-2 dark:text-gray-400">{app.details}</p>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                                <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-semibold capitalize text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                                    {app.type}
                                </span>
                                <div className={getStatusStyle(app.status)}>
                                    <StatusIcon status={app.status} />
                                    <span>{app.status}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {userApps.filter(app => filter === 'all' || app.status === filter).length === 0 && (
                        <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center space-y-3 rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-gray-800 dark:bg-gray-950/50">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                                <FileText className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">No requests found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">You don't have any applications matching this status.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}