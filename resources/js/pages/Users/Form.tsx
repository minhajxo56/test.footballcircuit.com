import React, { useState, useRef } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { 
    ArrowLeft, Shield, User, Building2, Briefcase, 
    Mail, Phone, Lock, Send, CheckCircle2 
} from 'lucide-react';
import { ChevronStepper } from '@/components/ChevronStepper';

interface Props {
    user?: any;
    roles?: { id: number; name: string }[];
    departments?: { id: number; name: string }[];
}

const mockRoles = [
    { id: 1, name: 'Admin' }, { id: 2, name: 'CEO' },
    { id: 3, name: 'HR' }, { id: 4, name: 'Team In-Charge' }, { id: 5, name: 'Employee' },
];

const mockDepartments = [
    { id: 1, name: 'News' }, { id: 2, name: 'Video' },
    { id: 3, name: 'Marketing' }, { id: 4, name: 'Design' }, { id: 5, name: 'HR & Admin' },
];

const formSteps = [
    { id: 1, title: 'Create / Update' },
    { id: 2, title: 'Save as Draft' },
    { id: 3, title: 'Save and Send' },
];

export default function Form({ user, roles = mockRoles, departments = mockDepartments }: Props) {
    const isEdit = !!user;
    const formRef = useRef<HTMLFormElement>(null);
    const [currentStep, setCurrentStep] = useState(1);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Directory & Users', href: '/users' },
        { title: isEdit ? 'Edit Employee' : 'Add Employee', href: '#' },
    ];

    const { data, setData, post, put, processing, errors, transform } = useForm({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        password: '',
        password_confirmation: '',
        role_id: user?.role_id || '',
        department_id: user?.department_id || '',
        status: user?.status || 'active',
        joining_date: user?.joining_date || new Date().toISOString().split('T')[0],
    });

    const handleStepClick = (targetStep: number) => {
        // Prevent unnecessary processing if clicking the active step
        if (targetStep === currentStep) return;

        // Allow navigating back to Step 1 without validation
        if (targetStep === 1) {
            setCurrentStep(1);
            return;
        }

        // Native HTML5 Validation before moving forward
        if (!formRef.current?.reportValidity()) return;

        // Inject the appropriate status into the payload seamlessly
        const actionType = targetStep === 2 ? 'draft' : 'send';
        transform((currentData) => ({
            ...currentData,
            action_type: actionType
        }));

        const requestOptions = {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                // If target is 2 (Draft), the UI stays in edit mode automatically.
                // If target is 3 (Send), the UI will swap to the success screen.
                setCurrentStep(targetStep);
            },
        };

        if (isEdit) {
            put(`/users/${user.id}`, requestOptions);
        } else {
            post('/users', requestOptions);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEdit ? 'Edit Employee' : 'Add Employee'} />
            <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col p-4 md:p-8">
                
                <div className="mb-6 flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                            {isEdit ? 'Edit Employee Profile' : 'Add New Employee'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Configure personal details, system access, and department routing.
                        </p>
                    </div>
                    <Link 
                        href="/users" 
                        className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> 
                        <span className="hidden sm:inline">Back to Directory</span>
                    </Link>
                </div>

                {/* Sole Navigation: The Interactive Visual Stepper */}
                <div className="mb-8">
                    <ChevronStepper 
                        steps={formSteps} 
                        currentStep={currentStep} 
                        onStepClick={handleStepClick}
                        disabled={processing}
                    />
                </div>

                <form ref={formRef} className="flex flex-col gap-6" onSubmit={e => e.preventDefault()}>
                    
                    {/* --- STEP 1 & 2: FORM / EDIT MODE --- */}
                    {/* The form remains visible whether they are creating or just saved a draft */}
                    {(currentStep === 1 || currentStep === 2) && (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                            <div className="flex flex-col space-y-6 lg:col-span-3">
                                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                    <div className="border-b border-gray-200 p-6 dark:border-gray-800 flex justify-between items-center">
                                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-50">
                                            <User className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" /> 
                                            Personal Information
                                        </h3>
                                        {currentStep === 2 && (
                                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                                Draft Saved
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-6 p-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">First Name</label>
                                                <input 
                                                    type="text" 
                                                    value={data.first_name}
                                                    onChange={e => setData('first_name', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                    required 
                                                />
                                                {errors.first_name && <p className="text-[0.8rem] font-medium text-red-500">{errors.first_name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Last Name</label>
                                                <input 
                                                    type="text" 
                                                    value={data.last_name}
                                                    onChange={e => setData('last_name', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                    required 
                                                />
                                                {errors.last_name && <p className="text-[0.8rem] font-medium text-red-500">{errors.last_name}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Email Address</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                    <input 
                                                        type="email" 
                                                        value={data.email}
                                                        onChange={e => setData('email', e.target.value)}
                                                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                        required 
                                                    />
                                                </div>
                                                {errors.email && <p className="text-[0.8rem] font-medium text-red-500">{errors.email}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Phone Number</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                    <input 
                                                        type="tel" 
                                                        value={data.phone}
                                                        onChange={e => setData('phone', e.target.value)}
                                                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                    />
                                                </div>
                                                {errors.phone && <p className="text-[0.8rem] font-medium text-red-500">{errors.phone}</p>}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                    <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-50">
                                            <Lock className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" /> 
                                            Authentication
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                                                    Password {(isEdit || currentStep === 2) && <span className="ml-1 font-normal text-gray-500">(Leave blank to keep)</span>}
                                                </label>
                                                <input 
                                                    type="password" 
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                    required={!isEdit && currentStep !== 2} 
                                                />
                                                {errors.password && <p className="text-[0.8rem] font-medium text-red-500">{errors.password}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Confirm Password</label>
                                                <input 
                                                    type="password" 
                                                    value={data.password_confirmation}
                                                    onChange={e => setData('password_confirmation', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                    required={(!isEdit && currentStep !== 2) || !!data.password} 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-6 lg:col-span-2">
                                <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                                    <div className="border-b border-gray-200 p-6 dark:border-gray-800">
                                        <h3 className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-50">
                                            <Briefcase className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" /> 
                                            Corporate Details
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-6 p-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Department</label>
                                            <div className="relative">
                                                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                <select 
                                                    value={data.department_id}
                                                    onChange={e => setData('department_id', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                    required
                                                >
                                                    <option value="" disabled className="dark:bg-gray-950">Select Department</option>
                                                    {departments.map(dept => (
                                                        <option key={dept.id} value={dept.id} className="dark:bg-gray-950">{dept.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.department_id && <p className="text-[0.8rem] font-medium text-red-500">{errors.department_id}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">System Role</label>
                                            <div className="relative">
                                                <Shield className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                                                <select 
                                                    value={data.role_id}
                                                    onChange={e => setData('role_id', e.target.value)}
                                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                                    required
                                                >
                                                    <option value="" disabled className="dark:bg-gray-950">Assign System Role</option>
                                                    {roles.map(role => (
                                                        <option key={role.id} value={role.id} className="dark:bg-gray-950">{role.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {errors.role_id && <p className="text-[0.8rem] font-medium text-red-500">{errors.role_id}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Account Status</label>
                                            <select 
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                            >
                                                <option value="active" className="dark:bg-gray-950">Active (Full Access)</option>
                                                <option value="probation" className="dark:bg-gray-950">Probation (Limited Access)</option>
                                                <option value="inactive" className="dark:bg-gray-950">Inactive (Suspended)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Joining Date</label>
                                            <input 
                                                type="date" 
                                                value={data.joining_date}
                                                onChange={e => setData('joining_date', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300 [color-scheme:light_dark]"
                                                required 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- STEP 3: DEDICATED SUCCESS TAB/VIEW --- */}
                    {/* Hides the form entirely and displays the final status */}
                    {currentStep === 3 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-10 shadow-sm dark:border-gray-800 dark:bg-gray-950 text-center max-w-4xl mx-auto w-full mt-4">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6 shadow-sm">
                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                                Employee Successfully Dispatched
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
                                The employee profile for <strong className="text-gray-900 dark:text-gray-100">{data.first_name} {data.last_name}</strong> is now finalized and active in the system.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 border-t border-gray-100 dark:border-gray-800 pt-8 mt-8">
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Employee Code</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 py-1 rounded">
                                        {/* Assuming backend generates this and returns it, otherwise placeholder */}
                                        Generated
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Assigned Dept.</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {departments.find(d => String(d.id) === String(data.department_id))?.name || '-'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Access Role</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {roles.find(r => String(r.id) === String(data.role_id))?.name || '-'}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">System Notification</p>
                                    <p className="font-medium flex justify-center items-center text-green-600 dark:text-green-400">
                                        <Send className="w-4 h-4 mr-1.5" /> Sent to Email
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