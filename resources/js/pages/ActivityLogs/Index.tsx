import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
  Clock, 
  User as UserIcon, 
  Activity, 
  Database, 
  Globe, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  X,
  History
} from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface ActivityLog {
    id: number;
    user_id: number | null;
    action: string;
    model_type: string;
    model_id: number;
    old_data: Record<string, any> | null;
    new_data: Record<string, any> | null;
    ip_address: string;
    created_at: string;
    user?: User;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    logs: {
        data: ActivityLog[];
        links: PaginationLink[];
        from: number;
        to: number;
        total: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Activity Logs', href: '/activity-logs' },
];

export default function ActivityLogsIndex({ logs }: Props) {
    const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

    const formatModelName = (modelPath: string) => {
        const parts = modelPath.split('\\');
        return parts[parts.length - 1];
    };

    const getActionStyle = (action: string) => {
        switch (action.toLowerCase()) {
            case 'created': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
            case 'updated': return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20';
            case 'deleted': return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border-red-200 dark:border-red-500/20';
            default: return 'bg-zinc-50 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400 border-zinc-200 dark:border-zinc-500/20';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />
            
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col space-y-8 p-4 md:p-8">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <History className="h-6 w-6 text-zinc-500" />
                        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                            System Activity
                        </h1>
                    </div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Audit trail of resource modifications and system actions.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                                    <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Timestamp</th>
                                    <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">User</th>
                                    <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Action</th>
                                    <th className="px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">Resource</th>
                                    <th className="hidden lg:table-cell px-6 py-4 font-medium text-zinc-500 dark:text-zinc-400">IP Address</th>
                                    <th className="px-6 py-4 text-right font-medium text-zinc-500 dark:text-zinc-400">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-zinc-600 dark:text-zinc-400 tabular-nums">
                                                {new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 font-medium text-zinc-900 dark:text-zinc-100">
                                                    <div className="h-6 w-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                                                        <UserIcon className="h-3 w-3 text-zinc-500" />
                                                    </div>
                                                    {log.user ? log.user.name : 'System'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getActionStyle(log.action)}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-zinc-900 dark:text-zinc-100 font-medium">{formatModelName(log.model_type)}</div>
                                                <div className="text-[11px] text-zinc-500 font-mono uppercase tracking-tighter">REF: {log.model_id}</div>
                                            </td>
                                            <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-zinc-500 font-mono text-xs tabular-nums">
                                                {log.ip_address || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => setSelectedLog(log)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm"
                                                >
                                                    <Eye className="w-3.5 h-3.5" />
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                                            No activity logs found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {logs.links && logs.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-50/30 dark:bg-zinc-900/20">
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                                Showing records {logs.from} to {logs.to}
                            </p>
                            <nav className="flex items-center gap-1">
                                {logs.links.map((link, idx) => (
                                    link.url ? (
                                        <Link
                                            key={idx}
                                            href={link.url}
                                            className={`min-w-[32px] h-8 flex items-center justify-center px-2 rounded-md text-sm transition-all border ${
                                                link.active 
                                                    ? 'bg-zinc-900 text-zinc-50 border-zinc-900 dark:bg-zinc-100 dark:text-zinc-950 dark:border-zinc-100 font-semibold' 
                                                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 shadow-sm'
                                            }`}
                                        >
                                            {link.label.includes('Previous') ? <ChevronLeft className="w-4 h-4" /> : link.label.includes('Next') ? <ChevronRight className="w-4 h-4" /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                                        </Link>
                                    ) : (
                                        <span key={idx} className="min-w-[32px] h-8 flex items-center justify-center px-2 rounded-md text-sm border border-transparent text-zinc-300 dark:text-zinc-700 cursor-not-allowed">
                                            {link.label.includes('Previous') ? <ChevronLeft className="w-4 h-4" /> : link.label.includes('Next') ? <ChevronRight className="w-4 h-4" /> : <span dangerouslySetInnerHTML={{ __html: link.label }} />}
                                        </span>
                                    )
                                ))}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedLog(null)} />
                    <div className="relative w-full max-w-3xl bg-white dark:bg-zinc-950 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">State Comparison</h3>
                                <p className="text-xs text-zinc-500 font-mono uppercase tracking-tight">Trace ID: {selectedLog.id}</p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto bg-zinc-50/50 dark:bg-zinc-950">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                        <span className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">Previous State</span>
                                    </div>
                                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-[12px] leading-relaxed h-80 overflow-auto scrollbar-thin scrollbar-thumb-zinc-800 shadow-inner">
                                        {selectedLog.old_data && Object.keys(selectedLog.old_data).length > 0 ? (
                                            <pre className="text-red-400/90 whitespace-pre-wrap">{JSON.stringify(selectedLog.old_data, null, 2)}</pre>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-zinc-700 italic">Initial creation (no old data)</div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                                        <span className="text-[11px] font-bold uppercase text-zinc-500 tracking-wider">New State</span>
                                    </div>
                                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-[12px] leading-relaxed h-80 overflow-auto scrollbar-thin scrollbar-thumb-zinc-800 shadow-inner">
                                        {selectedLog.new_data && Object.keys(selectedLog.new_data).length > 0 ? (
                                            <pre className="text-emerald-400/90 whitespace-pre-wrap">{JSON.stringify(selectedLog.new_data, null, 2)}</pre>
                                        ) : (
                                            <div className="h-full flex items-center justify-center text-zinc-700 italic">Resource deleted (no new data)</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-end">
                            <button
                                onClick={() => setSelectedLog(null)}
                                className="px-6 py-2 text-sm font-semibold text-white bg-zinc-900 dark:bg-zinc-50 dark:text-zinc-950 rounded-lg hover:opacity-90 transition-all shadow-md active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}