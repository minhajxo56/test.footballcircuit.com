import { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Search, Plus, MoreVertical, Edit, Shield, Building2, UserX, UserCheck, Clock } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Directory & Users', href: '/users' }];

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface User {
    id: number;
    name: string;
    email: string;
    status: string;
    role?: { name: string };
    employee?: {
        first_name: string;
        last_name: string;
        joining_date: string;
        department?: { name: string };
    };
}

interface PaginatedUsers {
    data: User[];
    links: PaginationLink[];
    from: number;
    to: number;
    total: number;
}

export default function Index({ users }: { users: PaginatedUsers }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');

    const usersList = users?.data || [];

    const filteredUsers = useMemo(() => {
        return usersList.filter(user => {
            const fName = user.employee?.first_name || user.name;
            const lName = user.employee?.last_name || '';
            const rName = user.role?.name || 'Unassigned';
            const matchesSearch = `${fName} ${lName} ${user.email}`.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = roleFilter === 'All' || rName === roleFilter;
            const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [searchQuery, roleFilter, statusFilter, usersList]);

    const getStatusBadge = (status: string) => {
        const baseStyle = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize transition-colors";
        switch (status) {
            case 'active': return <span className={`${baseStyle} border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400`}><UserCheck className="h-3.5 w-3.5" /> Active</span>;
            case 'probation': return <span className={`${baseStyle} border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/30 dark:bg-amber-900/20 dark:text-amber-400`}><Clock className="h-3.5 w-3.5" /> Probation</span>;
            case 'inactive': return <span className={`${baseStyle} border-red-200 bg-red-50 text-red-700 dark:border-red-900/30 dark:bg-red-900/20 dark:text-red-400`}><UserX className="h-3.5 w-3.5" /> Inactive</span>;
            default: return null;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Directory" />
            <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col p-4 md:p-8">
                
                <div className="mb-6 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Employee Directory</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage user access, roles, and HR profiles.</p>
                    </div>
                    <Link 
                        href="/users/create" 
                        className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 md:w-auto dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Add Employee
                    </Link>
                </div>

                <div className="mb-6 flex flex-col space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:space-x-3 md:space-y-0 dark:border-gray-800 dark:bg-gray-950">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search by name or email..." 
                            value={searchQuery} 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-9 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" 
                        />
                    </div>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                        <select 
                            value={roleFilter} 
                            onChange={(e) => setRoleFilter(e.target.value)} 
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 sm:w-[160px] dark:border-gray-800 dark:focus-visible:ring-gray-300"
                        >
                            <option value="All" className="dark:bg-gray-950">All Roles</option>
                            <option value="Admin" className="dark:bg-gray-950">Admin</option>
                            <option value="HR" className="dark:bg-gray-950">HR</option>
                            <option value="Team In-Charge" className="dark:bg-gray-950">Team In-Charge</option>
                            <option value="Employee" className="dark:bg-gray-950">Employee</option>
                        </select>
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)} 
                            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 sm:w-[160px] dark:border-gray-800 dark:focus-visible:ring-gray-300"
                        >
                            <option value="All" className="dark:bg-gray-950">All Statuses</option>
                            <option value="active" className="dark:bg-gray-950">Active</option>
                            <option value="probation" className="dark:bg-gray-950">Probation</option>
                            <option value="inactive" className="dark:bg-gray-950">Inactive</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950">
                    <div className="hidden border-b border-gray-200 bg-gray-50/50 p-4 md:grid md:grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] md:gap-4 dark:border-gray-800 dark:bg-gray-900/50">
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Employee</div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Department & Role</div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined Date</div>
                        <div className="text-right text-sm font-medium text-gray-500 dark:text-gray-400">Actions</div>
                    </div>

                    {filteredUsers.length > 0 ? (
                        <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                            {filteredUsers.map((user) => {
                                const fName = user.employee?.first_name || user.name.split(' ')[0] || 'U';
                                const lName = user.employee?.last_name || user.name.split(' ')[1] || '';
                                const roleName = user.role?.name || 'Unassigned';
                                const deptName = user.employee?.department?.name || 'Unassigned';
                                const avatar = `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase();
                                
                                return (
                                    <div key={user.id} className="flex flex-col space-y-4 p-4 transition-colors hover:bg-gray-50/50 md:grid md:grid-cols-[1.5fr_1.5fr_1fr_1fr_auto] md:items-center md:space-y-0 md:gap-4 dark:hover:bg-gray-800/50">
                                        <div className="flex items-start justify-between md:block">
                                            <div className="flex items-center space-x-3 overflow-hidden">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                                                    {avatar}
                                                </div>
                                                <div className="flex flex-col overflow-hidden">
                                                    <span className="truncate font-medium text-gray-900 dark:text-gray-100">{fName} {lName}</span>
                                                    <span className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1 md:hidden">
                                                <Link 
                                                    href={`/users/${user.id}/edit`} 
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:block">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center space-x-1.5 font-medium text-gray-900 dark:text-gray-100">
                                                    <Building2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                                                    <span className="truncate text-sm">{deptName}</span>
                                                </div>
                                                <div className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                                                    <Shield className="h-3.5 w-3.5" />
                                                    <span className="truncate">{roleName}</span>
                                                </div>
                                            </div>
                                            <div className="md:hidden">
                                                {getStatusBadge(user.status)}
                                            </div>
                                        </div>

                                        <div className="hidden md:block">
                                            {getStatusBadge(user.status)}
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-600 md:block dark:text-gray-300">
                                            <span className="text-xs font-medium text-gray-500 md:hidden dark:text-gray-400">Joined Date</span>
                                            <span>{user.employee?.joining_date ? new Date(user.employee.joining_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
                                        </div>

                                        <div className="hidden md:flex md:items-center md:justify-end md:space-x-1">
                                            <Link 
                                                href={`/users/${user.id}/edit`} 
                                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                            <button className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center border-b border-gray-200 dark:border-gray-800">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                                <UserX className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                            </div>
                            <div className="mt-4 space-y-1">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">No employees found</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters or search query.</p>
                            </div>
                        </div>
                    )}

                    {users.links && users.links.length > 3 && (
                        <div className="flex w-full items-center justify-between border-t border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="hidden text-sm text-gray-500 sm:block dark:text-gray-400">
                                Showing <span className="font-medium text-gray-900 dark:text-gray-100">{users.from}</span> to <span className="font-medium text-gray-900 dark:text-gray-100">{users.to}</span> of <span className="font-medium text-gray-900 dark:text-gray-100">{users.total}</span> results
                            </div>
                            
                            <div className="flex w-full justify-center sm:w-auto sm:justify-end">
                                <nav className="isolate inline-flex max-w-full -space-x-px overflow-x-auto rounded-md shadow-sm scrollbar-hide" aria-label="Pagination">
                                    {users.links.map((link, index) => {
                                        const isFirst = index === 0;
                                        const isLast = index === users.links.length - 1;
                                        
                                        if (link.url === null) {
                                            return (
                                                <span 
                                                    key={index} 
                                                    className={`relative inline-flex items-center whitespace-nowrap border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-400 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-600 ${isFirst ? 'rounded-l-md' : ''} ${isLast ? 'rounded-r-md' : ''}`} 
                                                    dangerouslySetInnerHTML={{ __html: link.label }} 
                                                />
                                            );
                                        }

                                        return (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`relative inline-flex items-center whitespace-nowrap border px-3 py-1.5 text-sm font-medium focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:focus-visible:outline-gray-300 ${
                                                    link.active 
                                                    ? 'z-10 border-gray-900 bg-gray-900 text-gray-50 dark:border-gray-50 dark:bg-gray-50 dark:text-gray-900' 
                                                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-50'
                                                } ${isFirst ? 'rounded-l-md' : ''} ${isLast ? 'rounded-r-md' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}