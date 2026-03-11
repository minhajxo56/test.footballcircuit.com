import { useState, useMemo, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    ArrowLeft, ShieldAlert, Briefcase, FileSignature, 
    AlertOctagon, Check, Infinity, Calendar, Plane, 
    Sun, Search, X, CheckCircle2, Send 
} from 'lucide-react';
import { ChevronStepper } from '@/components/ChevronStepper';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Official Letters', href: '/letters' },
    { title: 'Compose', href: '/letters/compose' },
];

const letterTypes = [
    { id: 'Responsibility', icon: ShieldAlert, label: 'Responsibility' },
    { id: 'Appointment', icon: Briefcase, label: 'Appointment' },
    { id: 'Warning', icon: AlertOctagon, label: 'Warning' },
    { id: 'General', icon: FileSignature, label: 'General Notice' },
];

const formSteps = [
    { id: 1, title: 'Compose / Update' },
    { id: 2, title: 'Save as Draft' },
    { id: 3, title: 'Save and Send' },
];

interface Employee {
    id: number;
    name: string;
    dept: string;
}

interface Department {
    id: string | number;
    name: string;
}

interface Tour {
    id: number | string;
    name: string;
}

interface Props {
    letter?: any;
    employees: Employee[];
    departments: Department[];
    tours: Tour[];
}

export default function Compose({ letter, employees = [], departments = [], tours = [] }: Props) {
    const isEdit = !!letter;
    const formRef = useRef<HTMLFormElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, processing, transform } = useForm({
        type: letter?.type || 'Responsibility',
        recipients: letter?.recipients?.map((r: any) => r.id) || [] as (number | string)[],
        subject: letter?.subject || '',
        content: letter?.content || '',
        validity_type: letter?.validity_type || 'ongoing',
        validity_value: letter?.validity_value || '',
    });

    const handleStepClick = (targetStep: number) => {
        if (targetStep === currentStep) return;

        if (targetStep === 1) {
            setCurrentStep(1);
            return;
        }

        if (!formRef.current?.reportValidity()) return;
        
        if (data.recipients.length === 0) {
            alert('Please select at least one recipient.');
            return;
        }

        const actionType = targetStep === 2 ? 'draft' : 'send';
        transform((currentData) => ({
            ...currentData,
            action_type: actionType
        }));

        const requestOptions = {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => setCurrentStep(targetStep),
        };

        if (isEdit) {
            put(`/letters/${letter.id}`, requestOptions);
        } else {
            post('/letters', requestOptions);
        }
    };

    const toggleRecipient = (id: number | string) => {
        if (data.recipients.includes(id)) {
            setData('recipients', data.recipients.filter((r: number | string) => r !== id));
        } else {
            setData('recipients', [...data.recipients, id]);
        }
    };

    const filteredRecipients = useMemo(() => {
        const query = searchQuery.toLowerCase();
        const filteredEmps = employees.filter(emp => 
            emp.name.toLowerCase().includes(query) || 
            emp.dept.toLowerCase().includes(query)
        );
        const filteredDepts = departments.filter(dept => 
            dept.name.toLowerCase().includes(query)
        );
        return { emps: filteredEmps, depts: filteredDepts };
    }, [searchQuery, employees, departments]);

    const selectedRecipientsData = useMemo(() => {
        const emps = employees.filter(emp => data.recipients.includes(emp.id));
        const depts = departments.filter(dept => data.recipients.includes(dept.id));
        return [...depts, ...emps];
    }, [data.recipients, employees, departments]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? "Edit Letter" : "Compose Letter"} />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-6 p-4 md:p-8">
                
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                            {isEdit ? 'Edit Letter' : 'Compose Letter'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Issue official corporate documents with zero hassle.</p>
                    </div>
                    <Link 
                        href="/letters" 
                        className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> 
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                </div>

                <div className="mb-2">
                    <ChevronStepper 
                        steps={formSteps} 
                        currentStep={currentStep} 
                        onStepClick={handleStepClick}
                        disabled={processing}
                    />
                </div>

                <form ref={formRef} className="flex flex-col" onSubmit={e => e.preventDefault()}>
                    {(currentStep === 1 || currentStep === 2) && (
                        <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex-1 space-y-8 p-6 sm:p-8">
                                
                                {currentStep === 2 && (
                                    <div className="rounded-md bg-gray-100 p-4 dark:bg-gray-900 mb-6 flex items-center justify-between">
                                        <div className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-200">
                                            <FileSignature className="mr-2 h-4 w-4 text-gray-500" />
                                            Letter saved securely as a draft.
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                        Letter Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                        {letterTypes.map(type => {
                                            const Icon = type.icon;
                                            const isActive = data.type === type.id;
                                            return (
                                                <button 
                                                    key={type.id} 
                                                    type="button" 
                                                    onClick={() => setData('type', type.id)}
                                                    className={`flex flex-col items-center justify-center gap-2 rounded-md border p-4 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 ${
                                                        isActive 
                                                            ? 'border-gray-900 bg-gray-50 text-gray-900 shadow-sm dark:border-gray-300 dark:bg-gray-900/50 dark:text-gray-50' 
                                                            : 'border-gray-200 bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50'
                                                    }`}
                                                >
                                                    <Icon className="h-5 w-5" />
                                                    <span className="text-sm font-medium">{type.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                        To (Recipients)
                                    </label>
                                    
                                    <div className="flex flex-col overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
                                        
                                        {selectedRecipientsData.length > 0 && (
                                            <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto border-b border-gray-200 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-900/20">
                                                {selectedRecipientsData.map(rec => (
                                                    <div key={rec.id} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50">
                                                        {rec.name}
                                                        <button 
                                                            type="button" 
                                                            onClick={() => toggleRecipient(rec.id)} 
                                                            className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-950 dark:hover:bg-gray-800 dark:focus:ring-gray-300"
                                                        >
                                                            <X className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="border-b border-gray-200 p-2 dark:border-gray-800">
                                            <div className="relative">
                                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Search employees or departments..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    className="flex h-9 w-full rounded-md border-transparent bg-transparent py-1 pl-9 pr-3 text-sm shadow-none transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex max-h-64 flex-col overflow-y-auto p-2">
                                            
                                            {filteredRecipients.depts.length > 0 && (
                                                <div className="mb-4 space-y-1">
                                                    <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Departments
                                                    </div>
                                                    {filteredRecipients.depts.map(dept => {
                                                        const isSelected = data.recipients.includes(dept.id);
                                                        return (
                                                            <button 
                                                                key={dept.id} 
                                                                type="button"
                                                                onClick={() => toggleRecipient(dept.id)}
                                                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 ${
                                                                    isSelected 
                                                                        ? 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50' 
                                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900/50 dark:hover:text-gray-50'
                                                                }`}
                                                            >
                                                                <span>{dept.name}</span>
                                                                {isSelected && <Check className="h-4 w-4 text-gray-900 dark:text-gray-50" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {filteredRecipients.emps.length > 0 && (
                                                <div className="space-y-1">
                                                    <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                        Employees
                                                    </div>
                                                    {filteredRecipients.emps.map(emp => {
                                                        const isSelected = data.recipients.includes(emp.id);
                                                        return (
                                                            <button 
                                                                key={emp.id} 
                                                                type="button"
                                                                onClick={() => toggleRecipient(emp.id)}
                                                                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 ${
                                                                    isSelected 
                                                                        ? 'bg-gray-100 font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-50' 
                                                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-900/50 dark:hover:text-gray-50'
                                                                }`}
                                                            >
                                                                <div className="flex flex-col">
                                                                    <span>{emp.name}</span>
                                                                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400">{emp.dept}</span>
                                                                </div>
                                                                {isSelected && <Check className="h-4 w-4 text-gray-900 dark:text-gray-50" />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {filteredRecipients.depts.length === 0 && filteredRecipients.emps.length === 0 && (
                                                <div className="py-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    No recipients found.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                        Subject
                                    </label>
                                    <input 
                                        type="text" 
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        placeholder="e.g., Appointment as Team In-Charge"
                                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                        required 
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                        Letter Body
                                    </label>
                                    <textarea 
                                        value={data.content}
                                        onChange={e => setData('content', e.target.value)}
                                        placeholder="Write the official communication here..."
                                        className="flex min-h-[160px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                        required 
                                    />
                                </div>

                                <div className="space-y-4 rounded-md border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-900/20">
                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                        Letter Validity Period
                                    </label>
                                    
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { id: 'ongoing', icon: Infinity, label: 'Until Revoked' },
                                            { id: 'tomorrow', icon: Sun, label: 'Tomorrow Only' },
                                            { id: 'tour', icon: Plane, label: 'Tie to Tour' },
                                            { id: 'custom', icon: Calendar, label: 'Custom Date' }
                                        ].map(option => {
                                            const Icon = option.icon;
                                            const isActive = data.validity_type === option.id;
                                            return (
                                                <button 
                                                    key={option.id}
                                                    type="button" 
                                                    onClick={() => { setData('validity_type', option.id); setData('validity_value', ''); }} 
                                                    className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 ${
                                                        isActive 
                                                            ? 'border-transparent bg-gray-900 text-gray-50 shadow dark:bg-gray-50 dark:text-gray-900' 
                                                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                                                    }`}
                                                >
                                                    <Icon className="h-4 w-4"/> {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="min-h-[40px] pt-1">
                                        {data.validity_type === 'tour' && (
                                            <select 
                                                value={data.validity_value} 
                                                onChange={e => setData('validity_value', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/2 dark:border-gray-800 dark:focus-visible:ring-gray-300" 
                                                required
                                            >
                                                <option value="" disabled className="dark:bg-gray-950">Select active tour...</option>
                                                {tours.map(t => <option key={t.id} value={t.id} className="dark:bg-gray-950">{t.name}</option>)}
                                            </select>
                                        )}
                                        {data.validity_type === 'custom' && (
                                            <input 
                                                type="date" 
                                                value={data.validity_value} 
                                                onChange={e => setData('validity_value', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/3 dark:border-gray-800 dark:focus-visible:ring-gray-300" 
                                                required
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-10 shadow-sm dark:border-gray-800 dark:bg-gray-950 text-center max-w-4xl mx-auto w-full mt-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6 shadow-sm">
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                                Letter Successfully Dispatched
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
                                The official communication has been securely finalized and sent to the selected recipients.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Letter Type</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {data.type}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Recipients</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {data.recipients.length} Users Selected
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">System Notification</p>
                                    <p className="font-medium flex justify-center items-center text-green-600 dark:text-green-400">
                                        <Send className="w-4 h-4 mr-1.5" /> Sent & Logged
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </AppLayout>
    );
}