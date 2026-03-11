import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Building2, Edit, Trash2, Users, Plus, ShieldCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Departments', href: '/departments' },
];

interface Manager {
    id: number;
    name: string;
    email: string;
}

interface Department {
    id: number;
    name: string;
    type: string;
    is_active: boolean;
    managers: Manager[];
}

export default function Index({ departments }: { departments: Department[] }) {
    const deleteDepartment = (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            router.delete(`/departments/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Departments" />
            
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-6 p-4 md:p-8">
                <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Departments</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage organizational departments and assign Team In Charge.</p>
                    </div>
                    <Link 
                        href="/departments/create" 
                        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Department
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                                <tr>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Department Name</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Types Allowed</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                                    <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Team In Charge</th>
                                    <th className="p-4 text-right font-medium text-gray-500 dark:text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {departments.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">No departments found.</td>
                                    </tr>
                                ) : (
                                    departments.map((dept) => (
                                        <tr key={dept.id} className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                            <td className="p-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800">
                                                        <Building2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                                                    </div>
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">{dept.name}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1">
                                                    {dept.type.split(',').map(t => (
                                                        <span key={t} className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 capitalize dark:bg-gray-800 dark:text-gray-300">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${dept.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {dept.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                {dept.managers.length > 0 ? (
                                                    <div className="flex flex-col space-y-1">
                                                        {dept.managers.map(m => (
                                                            <span key={m.id} className="inline-flex items-center text-xs text-gray-600 dark:text-gray-400">
                                                                <ShieldCheck className="mr-1.5 h-3 w-3 text-blue-500" />
                                                                {m.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end space-x-2">
                                                    <Link 
                                                        href={`/departments/${dept.id}/assign-managers`}
                                                        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400"
                                                        title="Assign Team In Charge"
                                                    >
                                                        <Users className="h-4 w-4" />
                                                    </Link>
                                                    <Link 
                                                        href={`/departments/${dept.id}/edit`}
                                                        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Link>
                                                    <button 
                                                        onClick={() => deleteDepartment(dept.id)}
                                                        className="rounded-md p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-500"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}