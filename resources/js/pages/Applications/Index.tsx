import { useState, useEffect, useMemo } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Search, Filter, CheckCircle, XCircle, ArrowUpRight, Eye, X, Inbox, AlertCircle, CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inbox', href: '/applications' },
];

export default function Index({ applications = [] }: { applications: any[] }) {
    const { flash } = usePage<any>().props;
    
    // Tab & Filter States
    const [activeTab, setActiveTab] = useState<'needs_review' | 'reviewed'>('needs_review');
    const [search, setSearch] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterType, setFilterType] = useState('all');
    
    // Action States
    const [previewItem, setPreviewItem] = useState<any | null>(null);
    const [escalateRole, setEscalateRole] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (previewItem) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [previewItem]);

    // Format DB applications into UI expected format
    const inboxData = useMemo(() => {
        return applications.map(app => {
            const emp = app.user?.employee;
            const start = app.start_date ? new Date(app.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
            const end = app.end_date ? new Date(app.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : null;
            
            let datesStr = null;
            if (start && end) {
                const diffTime = new Date(app.end_date).getTime() - new Date(app.start_date).getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                datesStr = `${start} - ${end} (${diffDays} days)`;
            }

            // Extract budget if present in details
            const budgetMatch = app.details.match(/--- Budget: ([\d.]+)/);
            const amount = budgetMatch ? `$${budgetMatch[1]}` : null;
            const cleanDetails = app.details.replace(/\n\n--- Budget: .*/, '');

            return {
                id: app.id,
                empName: emp ? `${emp.first_name} ${emp.last_name}` : app.user?.name,
                dept: emp?.department?.name || 'General',
                type: app.type,
                title: app.title,
                status: app.status,
                date: new Date(app.created_at).toLocaleDateString(),
                amount: amount,
                dates: datesStr,
                details: cleanDetails,
                attachment: app.attachment_path,
                escalated_role: app.escalated_role?.name
            };
        });
    }, [applications]);

    // Filter requests based on Search, Dropdowns, and Active Tab
    const filteredRequests = useMemo(() => {
        return inboxData.filter(req => {
            // 1. Tab Logic
            const isReviewed = req.status === 'approved' || req.status === 'rejected';
            if (activeTab === 'needs_review' && isReviewed) return false;
            if (activeTab === 'reviewed' && !isReviewed) return false;

            // 2. Search & Filter Logic
            const matchesSearch = search === '' || 
                req.empName.toLowerCase().includes(search.toLowerCase()) ||
                req.title.toLowerCase().includes(search.toLowerCase()) ||
                req.dept.toLowerCase().includes(search.toLowerCase());

            const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
            const matchesType = filterType === 'all' || req.type === filterType;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [search, filterStatus, filterType, inboxData, activeTab]);

    const hasActiveFilters = filterStatus !== 'all' || filterType !== 'all';

    const getStatusStyle = (status: string) => {
        const baseStyle = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors";
        switch (status) {
            case 'approved':
                return `${baseStyle} border-green-200 bg-green-50 text-green-700 dark:border-green-900/30 dark:bg-green-900/20 dark:text-green-400`;
            case 'rejected':
                return `${baseStyle} border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400`;
            case 'pending': 
                return `${baseStyle} border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400`;
            case 'escalated': 
                return `${baseStyle} border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900/30 dark:bg-purple-900/20 dark:text-purple-400`;
            case 'investigating':
            case 'looking into it':
                return `${baseStyle} border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400`;
            default: 
                return `${baseStyle} border-gray-200 bg-gray-50 text-gray-600 dark:border-gray-800/50 dark:bg-gray-800/30 dark:text-gray-400`;
        }
    };

    // API Calls
    const handleResolve = (action: 'approve' | 'reject') => {
        if (!previewItem) return;
        setIsProcessing(true);
        router.post(`/applications/${previewItem.id}/resolve`, { action }, {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewItem(null);
                setIsProcessing(false);
            }
        });
    };

    const handleEscalate = () => {
        if (!previewItem || !escalateRole) return;
        setIsProcessing(true);
        router.post(`/applications/${previewItem.id}/escalate`, { role_id: escalateRole }, {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewItem(null);
                setEscalateRole('');
                setIsProcessing(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Team Requests" />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 md:p-8">
                
                {/* Success Banner */}
                {flash?.success && (
                    <div className="mb-6 rounded-md bg-green-50 p-4 border border-green-200 dark:bg-green-950/50 dark:border-green-900">
                        <div className="flex items-center">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{flash.success}</h3>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="mb-6 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Request Inbox</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Review and resolve team applications.</p>
                    </div>
                    
                    {/* Search & Filter Trigger */}
                    <div className="flex w-full items-center space-x-2 md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search requests..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                            />
                        </div>

                        <div className="relative">
                            <button 
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border text-sm font-medium shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 ${
                                    showFilters || hasActiveFilters
                                    ? 'border-gray-900 bg-gray-100 text-gray-900 dark:border-gray-100 dark:bg-gray-800 dark:text-gray-50' 
                                    : 'border-gray-200 bg-transparent hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                                }`}
                            >
                                <Filter className="h-4 w-4" />
                                {hasActiveFilters && (
                                    <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5 rounded-full bg-gray-900 ring-2 ring-white dark:bg-gray-50 dark:ring-gray-950" />
                                )}
                            </button>

                            {/* Dropdown Filters */}
                            {showFilters && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
                                    
                                    <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-md border border-gray-200 bg-white p-4 shadow-md dark:border-gray-800 dark:bg-gray-950">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">Filter Requests</h4>
                                            {hasActiveFilters && (
                                                <button 
                                                    onClick={() => { setFilterStatus('all'); setFilterType('all'); }}
                                                    className="text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
                                                >
                                                    Clear all
                                                </button>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Status</label>
                                                <select 
                                                    value={filterStatus} 
                                                    onChange={e => setFilterStatus(e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                >
                                                    <option value="all" className="dark:bg-gray-950">All Statuses</option>
                                                    <option value="pending" className="dark:bg-gray-950">Pending</option>
                                                    <option value="investigating" className="dark:bg-gray-950">Investigating</option>
                                                    <option value="escalated" className="dark:bg-gray-950">Escalated</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Request Type</label>
                                                <select 
                                                    value={filterType} 
                                                    onChange={e => setFilterType(e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                >
                                                    <option value="all" className="dark:bg-gray-950">All Types</option>
                                                    <option value="leave" className="dark:bg-gray-950">Leave Request</option>
                                                    <option value="expense" className="dark:bg-gray-950">Expense Claim</option>
                                                    <option value="equipment" className="dark:bg-gray-950">Equipment / IT</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs UI */}
                <div className="mb-6 flex border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('needs_review')}
                        className={`pb-3 px-4 text-sm font-medium transition-colors focus-visible:outline-none ${
                            activeTab === 'needs_review' 
                            ? 'border-b-2 border-gray-900 text-gray-900 dark:border-gray-50 dark:text-gray-50' 
                            : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Needs Review
                    </button>
                    <button
                        onClick={() => setActiveTab('reviewed')}
                        className={`pb-3 px-4 text-sm font-medium transition-colors focus-visible:outline-none ${
                            activeTab === 'reviewed' 
                            ? 'border-b-2 border-gray-900 text-gray-900 dark:border-gray-50 dark:text-gray-50' 
                            : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300'
                        }`}
                    >
                        Reviewed
                    </button>
                </div>

                {/* Applications Table */}
                <div className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    
                    <div className="hidden border-b border-gray-200 bg-gray-50/50 p-4 md:grid md:grid-cols-[1.5fr_1fr_2.5fr_auto] md:gap-4 dark:border-gray-800 dark:bg-gray-900/50">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee</div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Details</div>
                        <div className="text-right text-sm font-medium text-gray-500 dark:text-gray-400">Action</div>
                    </div>

                    {filteredRequests.length > 0 ? (
                        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredRequests.map(req => (
                                <div 
                                    key={req.id} 
                                    className="flex flex-col space-y-3 p-4 transition-colors hover:bg-gray-50/50 md:grid md:grid-cols-[1.5fr_1fr_2.5fr_auto] md:items-center md:space-y-0 md:gap-4 dark:hover:bg-gray-900/50"
                                >
                                    <div className="flex items-start justify-between md:flex-col md:items-start md:space-y-1">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 dark:text-gray-50">{req.empName}</span>
                                            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">{req.dept}</span>
                                        </div>
                                        <div className="md:hidden">
                                            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-50">
                                                {req.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="hidden md:block">
                                        <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-50">
                                            {req.type}
                                        </span>
                                    </div>

                                    <div className="flex flex-col space-y-1">
                                        <span className="font-medium text-gray-900 dark:text-gray-50">{req.title}</span>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className={getStatusStyle(req.status)}>{req.status}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{req.date}</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 md:mt-0 md:text-right">
                                        <button 
                                            onClick={() => setPreviewItem(req)}
                                            className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 md:h-8 md:w-auto md:px-3 md:text-xs dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                                        >
                                            <Eye className="mr-2 h-4 w-4 text-gray-500 md:h-3.5 md:w-3.5" /> Review
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-3 py-16 px-4 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                                <Inbox className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">No requests found</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    We couldn't find anything matching your current filters.
                                </p>
                            </div>
                            {(hasActiveFilters || search) && (
                                <button 
                                    onClick={() => { setSearch(''); setFilterStatus('all'); setFilterType('all'); }}
                                    className="text-sm font-medium text-gray-900 underline-offset-4 hover:underline dark:text-gray-50"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Drawer */}
            {previewItem && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
                    <div className="flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-950">
                        
                        <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">Application Review</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Submitted {previewItem.date}</p>
                            </div>
                            <button 
                                onClick={() => setPreviewItem(null)}
                                className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300"
                            >
                                <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            <div className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-200 text-lg font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {previewItem.empName.charAt(0)}
                                </div>
                                <div className="flex flex-1 flex-col overflow-hidden">
                                    <h3 className="truncate font-semibold text-gray-900 dark:text-gray-50">{previewItem.empName}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{previewItem.dept} Department</p>
                                </div>
                                <div className="hidden sm:block">
                                    <span className={getStatusStyle(previewItem.status)}>{previewItem.status}</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subject / Title</label>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{previewItem.title}</p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Category</label>
                                        <p className="text-sm font-medium capitalize text-gray-900 dark:text-gray-50">{previewItem.type}</p>
                                    </div>
                                    {previewItem.amount && (
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Amount</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{previewItem.amount}</p>
                                        </div>
                                    )}
                                    {previewItem.dates && (
                                        <div className="col-span-2 space-y-1">
                                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Requested Dates</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{previewItem.dates}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 border-t border-gray-200 pt-6 dark:border-gray-800">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Detailed Reason</label>
                                    <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap dark:text-gray-300">
                                        {previewItem.details}
                                    </p>
                                </div>

                                {previewItem.attachment && (
                                    <div className="space-y-2 border-t border-gray-200 pt-6 dark:border-gray-800">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Attachment</label>
                                        <a href={`/storage/${previewItem.attachment}`} target="_blank" rel="noreferrer" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                                            View Attached File <ArrowUpRight className="ml-1 h-3 w-3" />
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Only show actions if it hasn't been approved/rejected yet */}
                        {(previewItem.status !== 'approved' && previewItem.status !== 'rejected') ? (
                            <div className="border-t border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
                                <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Take Action</h4>
                                
                                <div className="space-y-4">
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleResolve('approve')}
                                            disabled={isProcessing}
                                            className="inline-flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-green-600 focus-visible:outline-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-green-500"
                                        >
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve
                                        </button>
                                        <button 
                                            onClick={() => handleResolve('reject')}
                                            disabled={isProcessing}
                                            className="inline-flex h-9 flex-1 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-red-500 dark:hover:bg-red-950/20"
                                        >
                                            <XCircle className="mr-2 h-4 w-4" /> Reject
                                        </button>
                                    </div>

                                    <div className="flex space-x-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                                        <select 
                                            value={escalateRole}
                                            onChange={(e) => setEscalateRole(e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-950"
                                        >
                                            <option value="" disabled className="dark:bg-gray-950">Escalate To...</option>
                                            <option value="3" className="dark:bg-gray-950">HR Department</option>
                                            <option value="2" className="dark:bg-gray-950">CEO</option>
                                        </select>
                                        <button 
                                            onClick={handleEscalate}
                                            disabled={isProcessing || !escalateRole}
                                            className="inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800"
                                        >
                                            <ArrowUpRight className="mr-2 h-4 w-4" /> Route
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-gray-200 bg-gray-50/50 p-6 text-center dark:border-gray-800 dark:bg-gray-900/50">
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    This application has been <span className="lowercase">{previewItem.status}</span>.
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </AppLayout>
    );
}