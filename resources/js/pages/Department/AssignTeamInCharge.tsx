import { FormEvent } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, Check, Save, Users } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AssignProps {
    department: { id: number; name: string };
    eligibleUsers: User[];
    currentManagerIds: number[];
}

export default function AssignTeamInCharge({ department, eligibleUsers, currentManagerIds }: AssignProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Departments', href: '/departments' },
        { title: 'Assign Managers', href: '#' },
    ];

    const { data, setData, post, processing } = useForm({
        manager_ids: currentManagerIds || [],
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        post(`/departments/${department.id}/managers`);
    };

    const toggleManager = (id: number) => {
        if (data.manager_ids.includes(id)) {
            setData('manager_ids', data.manager_ids.filter(managerId => managerId !== id));
        } else {
            setData('manager_ids', [...data.manager_ids, id]);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Assign Team In Charge - ${department.name}`} />
            
            <div className="mx-auto w-full max-w-3xl flex-1 p-4 md:p-8">
                <div className="mb-6 flex items-center space-x-4">
                    <Link href="/departments" className="rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                            Assign Team In Charge
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Select managers for the <strong>{department.name}</strong> department.
                        </p>
                    </div>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                                <Users className="w-4 h-4 mr-2 text-gray-500" />
                                Eligible Users
                            </h3>
                            
                            {eligibleUsers.length === 0 ? (
                                <div className="p-4 text-center text-sm text-gray-500 bg-gray-50 rounded-md dark:bg-gray-900/50">
                                    No users found with the required roles (Team_In_Charge, Admin, Super_Admin).
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {eligibleUsers.map((user) => {
                                        const isSelected = data.manager_ids.includes(user.id);
                                        return (
                                            <div 
                                                key={user.id}
                                                onClick={() => toggleManager(user.id)}
                                                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                                                    isSelected 
                                                    ? 'border-gray-900 bg-gray-50 dark:border-gray-100 dark:bg-gray-900' 
                                                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700'
                                                }`}
                                            >
                                                <div className={`flex h-5 w-5 items-center justify-center rounded border mr-3 ${
                                                    isSelected 
                                                    ? 'bg-gray-900 border-gray-900 text-white dark:bg-gray-100 dark:border-gray-100 dark:text-gray-900' 
                                                    : 'border-gray-300 dark:border-gray-700'
                                                }`}>
                                                    {isSelected && <Check className="h-3.5 w-3.5" />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-gray-100 pt-6 dark:border-gray-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                            >
                                <Save className="mr-2 h-4 w-4" />
                                Save Assignments
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}