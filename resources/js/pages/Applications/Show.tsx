import { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    ArrowLeft, Printer, CheckCircle, XCircle, ArrowUpRight, 
    FileText, Calendar, Building, User, Paperclip, Clock, Trash2
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inbox', href: '/applications' },
    { title: 'Application Details', href: '#' },
];

export default function Show({ application }: { application: any }) {
    const { auth, flash } = usePage<any>().props;
    const [isProcessing, setIsProcessing] = useState(false);
    const [escalateRole, setEscalateRole] = useState('');

    const isCreator = auth.user.id === application.user_id;
    const isPendingOrEscalated = ['pending', 'escalated'].includes(application.status);
    const canTakeAction = !isCreator && isPendingOrEscalated; // Simplified check (Policy handles backend security)

    const getStatusConfig = (status: string) => {
        const base = "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider";
        switch (status) {
            case 'approved': return { label: 'Approved', class: `${base} border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400` };
            case 'rejected': return { label: 'Rejected', class: `${base} border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400` };
            case 'pending': return { label: 'Pending', class: `${base} border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400` };
            case 'escalated': return { label: 'Escalated', class: `${base} border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-900/20 dark:text-purple-400` };
            case 'draft': return { label: 'Draft', class: `${base} border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800/30 dark:bg-gray-800/50 dark:text-gray-400` };
            default: return { label: status, class: `${base} border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800/30 dark:bg-gray-800/50 dark:text-gray-400` };
        }
    };

    const statusConfig = getStatusConfig(application.status);
    const empName = application.user?.employee ? `${application.user.employee.first_name} ${application.user.employee.last_name}` : application.user?.name;
    const deptName = application.user?.employee?.department?.name || 'General';

    // Actions
    const handleResolve = (action: 'approve' | 'reject') => {
        setIsProcessing(true);
        router.post(`/applications/${application.id}/resolve`, { action }, {
            preserveScroll: true,
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleEscalate = () => {
        if (!escalateRole) return;
        setIsProcessing(true);
        router.post(`/applications/${application.id}/escalate`, { role_id: escalateRole }, {
            preserveScroll: true,
            onSuccess: () => setEscalateRole(''),
            onFinish: () => setIsProcessing(false)
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to cancel and delete this application?')) {
            router.delete(`/applications/${application.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Application: ${application.title}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-6 p-4 md:p-8">
                
                {/* Success Banner */}
                {flash?.success && (
                    <div className="rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-950/50 dark:border-green-900">
                        <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-400" />
                            <h3 className="ml-3 text-sm font-medium text-green-800 dark:text-green-200">{flash.success}</h3>
                        </div>
                    </div>
                )}

                {/* Top Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button 
                        onClick={() => window.history.back()}
                        className="inline-flex h-9 w-fit items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </button>

                    <div className="flex items-center gap-2">
                        {isCreator && ['draft', 'pending'].includes(application.status) && (
                            <button 
                                onClick={handleDelete}
                                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-900 shadow-sm transition-colors hover:bg-red-100 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/40"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Cancel Request
                            </button>
                        )}
                        <button 
                            onClick={() => window.print()}
                            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800"
                        >
                            <Printer className="mr-2 h-4 w-4" /> Print
                        </button>
                    </div>
                </div>

                <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm print:shadow-none print:border-none dark:border-gray-800 dark:bg-gray-950">
                    
                    {/* Header Section */}
                    <div className="flex flex-col space-y-4 border-b border-gray-200 p-6 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 sm:p-8 dark:border-gray-800">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 print:hidden dark:border-gray-800 dark:bg-gray-900">
                                <FileText className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold capitalize tracking-tight text-gray-900 dark:text-gray-50">{application.type} Request</h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Submitted {new Date(application.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col text-left sm:text-right">
                            <span className={statusConfig.class}>{statusConfig.label}</span>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 gap-6 border-b border-gray-200 bg-gray-50/50 p-6 print:bg-transparent sm:grid-cols-3 sm:p-8 dark:border-gray-800 dark:bg-gray-900/20">
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Requested By</span>
                            <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                <User className="mr-2 h-4 w-4 text-gray-400" /> {empName}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Department</span>
                            <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                <Building className="mr-2 h-4 w-4 text-gray-400" /> {deptName}
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Dates Requested</span>
                            <div className="flex items-center text-sm font-medium text-gray-900 dark:text-gray-100">
                                <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                                {application.start_date 
                                    ? `${new Date(application.start_date).toLocaleDateString()} - ${application.end_date ? new Date(application.end_date).toLocaleDateString() : 'Ongoing'}` 
                                    : 'N/A'
                                }
                            </div>
                        </div>
                    </div>

                    {/* Application Body Section */}
                    <div className="p-6 sm:p-10">
                        <h1 className="mb-6 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                            {application.title}
                        </h1>
                        <div className="space-y-4 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                            {application.details}
                        </div>
                        
                        {application.attachment_path && (
                            <div className="mt-8 border-t border-gray-200 pt-6 print:hidden dark:border-gray-800">
                                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50">Attachments</h3>
                                <a 
                                    href={`/storage/${application.attachment_path}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                                >
                                    <Paperclip className="mr-2 h-4 w-4" />
                                    View Attached Document
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Approver History / Metadata (If Resolved) */}
                    {['approved', 'rejected'].includes(application.status) && application.approver && (
                        <div className="border-t border-gray-200 bg-gray-50 p-6 sm:px-10 dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                <span>
                                    This application was <strong>{application.status}</strong> by {application.approver.name}.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* ACTION PANEL (For Management) */}
                    {canTakeAction && (
                        <div className="border-t border-gray-200 bg-gray-50/50 p-6 print:hidden sm:px-10 dark:border-gray-800 dark:bg-gray-900/20">
                            <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-50">Management Actions</h4>
                            
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={() => handleResolve('approve')}
                                        disabled={isProcessing}
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-6 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                    </button>
                                    <button 
                                        onClick={() => handleResolve('reject')}
                                        disabled={isProcessing}
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-red-200 bg-white px-6 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900/30 dark:bg-gray-950 dark:text-red-500 dark:hover:bg-red-900/20"
                                    >
                                        <XCircle className="mr-2 h-4 w-4" /> Reject
                                    </button>
                                </div>

                                <div className="hidden h-10 w-px bg-gray-300 sm:block dark:bg-gray-700"></div>

                                <div className="flex w-full space-x-2 sm:max-w-xs">
                                    <select 
                                        value={escalateRole}
                                        onChange={(e) => setEscalateRole(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50"
                                    >
                                        <option value="" disabled>Escalate Request To...</option>
                                        <option value="3">HR Department</option>
                                        <option value="2">CEO</option>
                                    </select>
                                    <button 
                                        onClick={handleEscalate}
                                        disabled={isProcessing || !escalateRole}
                                        className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-100 px-4 text-sm font-medium text-gray-900 shadow-sm transition-colors hover:bg-gray-200 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                                    >
                                        <ArrowUpRight className="mr-2 h-4 w-4" /> Route
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}