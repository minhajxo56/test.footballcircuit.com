import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Save, ArrowLeft } from 'lucide-react';

interface DepartmentFormProps {
    department?: {
        id: number;
        name: string;
        type_array: string[];
        is_active: boolean;
    };
}

export default function Form({ department }: DepartmentFormProps) {
    const isEditing = !!department;
    
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Departments', href: '/departments' },
        { title: isEditing ? 'Edit Department' : 'Create Department', href: '#' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: department?.name || '',
        type: department?.type_array || [],
        is_active: department !== undefined ? department.is_active : true,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/departments/${department.id}`);
        } else {
            post('/departments');
        }
    };

    const handleTypeToggle = (value: string) => {
        const newTypes = data.type.includes(value)
            ? data.type.filter(t => t !== value)
            : [...data.type, value];
        setData('type', newTypes);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isEditing ? 'Edit Department' : 'Create Department'} />
            
            <div className="mx-auto w-full max-w-2xl flex-1 p-4 md:p-8">
                <div className="mb-6 flex items-center space-x-4">
                    <Link href="/departments" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                        {isEditing ? 'Edit Department' : 'Create Department'}
                    </h1>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Department Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                placeholder="e.g. Camera, Reporting, HR"
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">Allowed Employee Types</label>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.type.includes('office')}
                                        onChange={() => handleTypeToggle('office')}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:checked:bg-gray-50"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Office</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={data.type.includes('field')}
                                        onChange={() => handleTypeToggle('field')}
                                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:checked:bg-gray-50"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Field</span>
                                </label>
                            </div>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                            <p className="text-xs text-gray-500">Select at least one. This dictates what shifts can be assigned to employees in this department.</p>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:checked:bg-gray-50"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                                Department is Active
                            </label>
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-6 dark:border-gray-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                {isEditing ? 'Update Department' : 'Save Department'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}