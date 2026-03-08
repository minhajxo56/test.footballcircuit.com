import { useState, useMemo, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, MapPin, Calendar, Plane, Search, Check, X, Users, CheckCircle2, Send, FileArchive } from 'lucide-react';
import { ChevronStepper } from '@/components/ChevronStepper';

interface Employee {
    id: number;
    name: string;
    dept: string;
    role: string;
}

interface Tour {
    id: number;
    name: string;
    location: string;
    start_date: string;
    end_date: string;
    status: string;
    users?: { id: number }[];
}

interface Props {
    tour?: Tour;
    availableEmployees: Employee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tours & Travel', href: '/tours' },
    { title: 'Manage Tour', href: '#' },
];

const formSteps = [
    { id: 1, title: 'Plan / Update' },
    { id: 2, title: 'Save as Planned' },
    { id: 3, title: 'Activate & Notify' },
];

export default function Form({ tour, availableEmployees = [] }: Props) {
    const isEdit = !!tour;
    const formRef = useRef<HTMLFormElement>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [empSearch, setEmpSearch] = useState('');

    const initialUserIds = tour?.users?.map(u => u.id) || [];

    const { data, setData, post, put, processing, transform } = useForm({
        name: tour?.name || '',
        location: tour?.location || '',
        start_date: tour?.start_date ? new Date(tour.start_date).toISOString().split('T')[0] : '',
        end_date: tour?.end_date ? new Date(tour.end_date).toISOString().split('T')[0] : '',
        status: tour?.status || 'planned',
        assigned_users: initialUserIds as number[],
    });

    const handleStepClick = (targetStep: number) => {
        if (targetStep === currentStep) return;

        if (targetStep === 1) {
            setCurrentStep(1);
            return;
        }

        if (!formRef.current?.reportValidity()) return;

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
            put(`/tours/${tour.id}`, requestOptions);
        } else {
            post('/tours', requestOptions);
        }
    };

    const toggleEmployee = (id: number) => {
        const current = [...data.assigned_users];
        if (current.includes(id)) {
            setData('assigned_users', current.filter(uId => uId !== id));
        } else {
            setData('assigned_users', [...current, id]);
        }
    };

    const filteredEmployees = useMemo(() => {
        return availableEmployees.filter(emp => 
            emp.name.toLowerCase().includes(empSearch.toLowerCase()) || 
            emp.dept.toLowerCase().includes(empSearch.toLowerCase())
        );
    }, [empSearch, availableEmployees]);

    const selectedEmployeesData = availableEmployees.filter(emp => data.assigned_users.includes(emp.id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? `Edit ${tour.name}` : "Plan New Tour"} />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col p-4 md:p-8">
                
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                            {isEdit ? 'Edit Tour Details' : 'Plan New Tour'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage deployment schedule, status, and assigned personnel.</p>
                    </div>
                    <Link 
                        href="/tours" 
                        className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> 
                        <span className="hidden sm:inline">Back</span>
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

                <form ref={formRef} className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
                    
                    {(currentStep === 1 || currentStep === 2) && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                            <div className="flex flex-col space-y-6 lg:col-span-3">
                                
                                {currentStep === 2 && (
                                    <span></span>
                                )}

                                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                    <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-50">
                                            <Plane className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" /> 
                                            Deployment Details
                                        </h3>
                                    </div>

                                    <div className="space-y-6 p-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                                Tour Name
                                            </label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g., ICC World Cup Coverage"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                                required 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                                Destination / Location
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                <input 
                                                    type="text" 
                                                    placeholder="City, Country or Specific Venue"
                                                    value={data.location}
                                                    onChange={e => setData('location', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                                    required 
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                                    Start Date
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                    <input 
                                                        type="date" 
                                                        value={data.start_date}
                                                        onChange={e => setData('start_date', e.target.value)}
                                                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:focus-visible:ring-gray-300 [color-scheme:light_dark]"
                                                        required 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                                                    End Date
                                                </label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                    <input 
                                                        type="date" 
                                                        min={data.start_date}
                                                        value={data.end_date}
                                                        onChange={e => setData('end_date', e.target.value)}
                                                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:focus-visible:ring-gray-300 [color-scheme:light_dark]"
                                                        required 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-6 lg:col-span-2">
                                <div className="flex h-[450px] flex-col rounded-lg border border-gray-200 bg-white shadow-sm lg:h-[500px] dark:border-gray-800 dark:bg-gray-950">
                                    
                                    <div className="flex flex-col space-y-1.5 border-b border-gray-200 p-6 dark:border-gray-800">
                                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-50">
                                            <Users className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" /> 
                                            Tour Roster
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{data.assigned_users.length} personnel selected</p>
                                    </div>

                                    {data.assigned_users.length > 0 && (
                                        <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto border-b border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/20">
                                            {selectedEmployeesData.map(emp => (
                                                <div key={emp.id} className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-900 shadow-sm dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50">
                                                    {emp.name}
                                                    <button 
                                                        type="button" 
                                                        onClick={() => toggleEmployee(emp.id)} 
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
                                                placeholder="Search by name or dept..."
                                                value={empSearch}
                                                onChange={(e) => setEmpSearch(e.target.value)}
                                                className="flex h-9 w-full rounded-md border-transparent bg-transparent py-1 pl-9 pr-3 text-sm shadow-none transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-2">
                                        <div className="flex flex-col space-y-1">
                                            {filteredEmployees.map(emp => {
                                                const isSelected = data.assigned_users.includes(emp.id);
                                                return (
                                                    <button 
                                                        key={emp.id}
                                                        type="button"
                                                        onClick={() => toggleEmployee(emp.id)}
                                                        className={`flex items-center justify-between rounded-md p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 ${
                                                            isSelected 
                                                            ? 'bg-gray-100 dark:bg-gray-800' 
                                                            : 'hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col overflow-hidden">
                                                            <span className={`truncate text-sm font-medium ${isSelected ? 'text-gray-900 dark:text-gray-50' : 'text-gray-900 dark:text-gray-200'}`}>
                                                                {emp.name}
                                                            </span>
                                                            <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                                                                {emp.role} • {emp.dept}
                                                            </span>
                                                        </div>
                                                        <div className={`ml-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${
                                                            isSelected 
                                                            ? 'border-gray-900 bg-gray-900 text-gray-50 dark:border-gray-50 dark:bg-gray-50 dark:text-gray-900' 
                                                            : 'border-gray-300 bg-transparent dark:border-gray-700'
                                                        }`}>
                                                            {isSelected && <Check className="h-3 w-3" />}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                            {filteredEmployees.length === 0 && (
                                                <div className="py-8 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    No personnel found.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-10 shadow-sm dark:border-gray-800 dark:bg-gray-950 text-center max-w-4xl mx-auto w-full mt-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6 shadow-sm">
                                <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                                Tour Successfully Activated
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
                                The <strong className="text-gray-900 dark:text-gray-100">{data.name}</strong> deployment is now formally active and scheduled in the system.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Destination</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {data.location}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Roster Size</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {data.assigned_users.length} Personnel
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Duration</p>
                                    <p className="font-medium flex justify-center items-center text-gray-900 dark:text-gray-100">
                                        <Calendar className="w-4 h-4 mr-1.5 text-gray-500" /> 
                                        {data.start_date} to {data.end_date}
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