import { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Send, ArrowLeft, FileText, Palmtree, Wallet, Laptop, AlertCircle, FileArchive, CheckCircle2, Paperclip, Save } from 'lucide-react';
import LeaveFields from './Partials/LeaveFields';
import ExpenseFields from './Partials/ExpenseFields';
import { ChevronStepper } from '@/components/ChevronStepper';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'My Applications', href: '/my-applications' },
    { title: 'Manage Request', href: '#' },
];

const requestTypes = [
    { id: 'leave', label: 'Leave Request', desc: 'Vacation, Sick, or Unpaid', icon: Palmtree },
    { id: 'expense', label: 'Expense Claim', desc: 'Travel, Meals, or Purchases', icon: Wallet },
    { id: 'equipment', label: 'IT / Equipment', desc: 'Hardware or software', icon: Laptop },
    { id: 'general_request', label: 'General Request', desc: 'Standard HR request', icon: FileText },
];

const formSteps = [
    { id: 1, title: 'Draft Request' },
    { id: 2, title: 'Save as Draft' },
    { id: 3, title: 'Submit for Approval' },
];

export default function Form({ application }: { application?: any }) {
    const isEdit = !!application;
    const formRef = useRef<HTMLFormElement>(null);
    const [currentStep, setCurrentStep] = useState(1);

    // CRITICAL FIX: Include action_type and _method right in the data initialization
    const { data, setData, post, processing, errors, transform } = useForm({
        type: application?.type || 'leave',
        title: application?.title || '',
        details: application?.details || '',
        start_date: application?.start_date || '',
        end_date: application?.end_date || '',
        attachment: null as File | null,
        action_type: application?.status || 'draft',
        _method: isEdit ? 'PUT' : 'POST'
    });

    const handleSubmit = (actionType: 'draft' | 'send') => {
        if (!formRef.current?.reportValidity()) return;

        transform((currentData) => ({
            ...currentData,
            action_type: actionType
        }));

        const requestOptions = {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setCurrentStep(actionType === 'draft' ? 2 : 3),
        };

        // CRITICAL FIX: Since we use _method: 'PUT' in the payload, we use post() for BOTH create and edit
        if (isEdit) {
            post(`/applications/${application.id}`, requestOptions);
        } else {
            post('/applications', requestOptions);
        }
    };

    const handleStepClick = (targetStep: number) => {
        if (targetStep === currentStep) return;
        if (targetStep === 1) { setCurrentStep(1); return; }
        handleSubmit(targetStep === 2 ? 'draft' : 'send');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Application" : "New Application"} />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 md:p-8">
                
                {Object.keys(errors).length > 0 && !errors.title && !errors.details && (
                    <div className="mb-6 rounded-md bg-red-50 p-4 border border-red-200 dark:bg-red-950/50 dark:border-red-900">
                        <div className="flex">
                            <AlertCircle className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">There was a problem submitting your request.</h3>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-6 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                            {isEdit ? 'Edit Request' : 'Submit Request'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Select a category and fill out the details for HR approval.</p>
                    </div>
                    <Link 
                        href="/my-applications" 
                        className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inbox
                    </Link>
                </div>

                <div className="mb-8">
                    <ChevronStepper 
                        steps={formSteps} 
                        currentStep={currentStep} 
                        onStepClick={handleStepClick}
                        disabled={processing}
                    />
                </div>

                <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <form ref={formRef} className="flex flex-col md:flex-row" encType="multipart/form-data" onSubmit={e => e.preventDefault()}>
                        
                        {(currentStep === 1 || currentStep === 2) && (
                            <>
                                <div className="flex flex-row gap-2 overflow-x-auto border-b border-gray-200 p-4 md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r dark:border-gray-800 scrollbar-hide">
                                    {requestTypes.map((type) => {
                                        const Icon = type.icon;
                                        const isActive = data.type === type.id;
                                        return (
                                            <button 
                                                key={type.id} 
                                                type="button" 
                                                onClick={() => setData('type', type.id)}
                                                className={`flex w-48 shrink-0 items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 md:w-full dark:focus-visible:ring-gray-300 ${
                                                    isActive 
                                                    ? 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50' 
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900/50 dark:hover:text-gray-50'
                                                }`}
                                            >
                                                <Icon className="mt-0.5 h-4 w-4 shrink-0" />
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="truncate">{type.label}</span>
                                                    <span className="truncate text-[11px] font-normal text-gray-400 dark:text-gray-500">{type.desc}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <div className="flex-1 space-y-6 p-6">
                                        
                                        {currentStep === 2 && (
                                            <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-900 flex items-center justify-between border border-gray-200 dark:border-gray-800">
                                                <div className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-200">
                                                    <FileArchive className="mr-2 h-4 w-4 text-gray-500" />
                                                    Application saved securely as a draft.
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                                                Subject
                                            </label>
                                            <input 
                                                type="text" 
                                                value={data.title}
                                                onChange={e => setData('title', e.target.value)}
                                                placeholder="e.g., Annual Leave for December"
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" 
                                                required 
                                            />
                                            {errors.title && <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">{errors.title}</p>}
                                        </div>

                                        <div className="min-h-[140px]">
                                            {data.type === 'leave' && <LeaveFields data={data} setData={setData} />}
                                            {data.type === 'expense' && <ExpenseFields data={data} setData={setData} />}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                                                Details
                                            </label>
                                            <textarea 
                                                rows={4}
                                                value={data.details}
                                                onChange={e => setData('details', e.target.value)}
                                                placeholder="Provide necessary context, links, or justification..."
                                                className="flex min-h-[100px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" 
                                                required 
                                            />
                                            {errors.details && <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">{errors.details}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                                                Attachment (Optional)
                                            </label>
                                            {application?.attachment_path && (
                                                <div className="mb-2 text-sm text-gray-500 flex items-center">
                                                    <Paperclip className="h-4 w-4 mr-1" />
                                                    Current file: <a href={`/storage/${application.attachment_path}`} target="_blank" rel="noreferrer" className="ml-1 text-blue-600 hover:underline">View Attached</a>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                onChange={e => setData('attachment', e.target.files ? e.target.files[0] : null)}
                                                className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:file:text-gray-50 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                            />
                                            {errors.attachment && <p className="text-[0.8rem] font-medium text-red-500 dark:text-red-900">{errors.attachment as string}</p>}
                                        </div>
                                    </div>

                                    {/* Explicit Action Buttons at the bottom of the form */}
                                    <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
                                        <button 
                                            type="button"
                                            onClick={() => handleSubmit('draft')}
                                            disabled={processing}
                                            className="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <Save className="mr-2 h-4 w-4" /> Save Draft
                                        </button>
                                        <button 
                                            type="button"
                                            onClick={() => handleSubmit('send')}
                                            disabled={processing}
                                            className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                                        >
                                            <Send className="mr-2 h-4 w-4" /> Submit Request
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {currentStep === 3 && (
                            <div className="w-full rounded-lg border border-transparent bg-white p-10 text-center mx-auto dark:bg-gray-950">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6 shadow-sm">
                                    <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                                    Application Submitted
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
                                    Your request has been successfully forwarded to management for review.
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Type</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                                            {data.type.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Subject</p>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate max-w-[200px] mx-auto" title={data.title}>
                                            {data.title}
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Status</p>
                                        <p className="font-medium flex justify-center items-center text-yellow-600 dark:text-yellow-400">
                                            <Send className="w-4 h-4 mr-1.5" /> Pending Review
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}