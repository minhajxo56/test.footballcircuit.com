import { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Mail, Search, Plus, ShieldAlert, Briefcase, FileSignature, AlertOctagon, ArrowUpRight, Inbox, Send as SendIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Official Letters', href: '/letters' },
];

interface User {
    id: number;
    name: string;
}

interface Letter {
    id: number;
    type: string;
    subject: string;
    status: 'draft' | 'issued' | 'cancelled' | 'archived';
    validity_type: string;
    validity_value: string | null;
    created_at: string;
    issuer: User;
    recipients: (User & { pivot: { read_at: string | null } })[];
}

interface Props {
    letters: Letter[];
}

export default function Index({ letters = [] }: Props) {
    const { auth } = usePage<any>().props;
    const currentUser = auth.user;

    const [view, setView] = useState<'received' | 'sent'>('received');
    const [searchQuery, setSearchQuery] = useState('');

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'Responsibility': return { icon: ShieldAlert, badgeClass: 'border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800/30 dark:bg-purple-900/30 dark:text-purple-300' };
            case 'Appointment': return { icon: Briefcase, badgeClass: 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/30 dark:text-emerald-300' };
            case 'Warning': return { icon: AlertOctagon, badgeClass: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800/30 dark:bg-red-900/30 dark:text-red-300' };
            default: return { icon: FileSignature, badgeClass: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-300' };
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'draft': return { label: 'Draft', color: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/30 dark:text-amber-300' };
            case 'issued': return { label: 'Issued', color: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/30 dark:text-emerald-300' };
            case 'cancelled': return { label: 'Cancelled', color: 'border-red-200 bg-red-50 text-red-800 dark:border-red-800/30 dark:bg-red-900/30 dark:text-red-300' };
            case 'archived': return { label: 'Archived', color: 'border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800/30 dark:bg-gray-900/30 dark:text-gray-300' };
            default: return { label: status, color: 'border-gray-200 bg-gray-50 text-gray-800 dark:border-gray-800/30 dark:bg-gray-900/30 dark:text-gray-300' };
        }
    };

    // Transform raw DB letters into the normalized format your UI expects
    const processedLetters = useMemo(() => {
        return letters.map(letter => {
            const isSender = letter.issuer.id === currentUser.id;
            const direction = isSender ? 'sent' : 'received';
            
            let isRead = true;
            if (direction === 'received') {
                const myRecord = letter.recipients.find(r => r.id === currentUser.id);
                isRead = !!myRecord?.pivot?.read_at;
            }

            let validityStr = '';
            switch (letter.validity_type) {
                case 'ongoing': validityStr = 'Until Revoked'; break;
                case 'tomorrow': validityStr = 'Tomorrow Only'; break;
                case 'tour': validityStr = `Tied to Tour: ${letter.validity_value || 'Active'}`; break;
                case 'custom': validityStr = `Until ${new Date(letter.validity_value as string).toLocaleDateString()}`; break;
                default: validityStr = letter.validity_type;
            }

            return {
                id: letter.id,
                type: letter.type,
                subject: letter.subject,
                status: letter.status,
                recipients: letter.recipients.map(r => r.name),
                issuer: letter.issuer.name,
                date: letter.created_at,
                validity: validityStr,
                direction,
                read: isRead,
            };
        });
    }, [letters, currentUser.id]);

    const filteredLetters = processedLetters.filter(letter => 
        letter.direction === view &&
        (letter.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
         letter.recipients.join(', ').toLowerCase().includes(searchQuery.toLowerCase()) ||
         letter.issuer.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const unreadCount = processedLetters.filter(l => l.direction === 'received' && !l.read).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Official Letters" />
            <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-6 p-4 md:p-8">
                
                <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Official Letters</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">View received documents or issue new corporate letters.</p>
                    </div>
                    <Link 
                        href="/letters/compose" 
                        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Compose Letter
                    </Link>
                </div>

                <div className="flex min-h-[600px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:flex-row dark:border-gray-800 dark:bg-gray-950">
                    
                    <div className="flex w-full flex-col border-b border-gray-200 bg-gray-50/50 p-4 md:w-64 md:border-b-0 md:border-r md:p-6 dark:border-gray-800 dark:bg-gray-900/20">
                        <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
                            <button 
                                onClick={() => setView('received')}
                                className={`inline-flex flex-1 items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 md:flex-none dark:focus-visible:ring-gray-300 ${
                                    view === 'received' 
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-800' 
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                                }`}
                            >
                                <span className="flex items-center">
                                    <Inbox className="mr-2 h-4 w-4" /> Inbox
                                </span>
                                {unreadCount > 0 && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 transition-colors dark:bg-blue-900 dark:text-blue-300">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                            <button 
                                onClick={() => setView('sent')}
                                className={`inline-flex flex-1 items-center justify-between whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 md:flex-none dark:focus-visible:ring-gray-300 ${
                                    view === 'sent' 
                                        ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:ring-gray-800' 
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50'
                                }`}
                            >
                                <span className="flex items-center">
                                    <SendIcon className="mr-2 h-4 w-4" /> Sent
                                </span>
                            </button>
                        </nav>
                    </div>

                    <div className="flex flex-1 flex-col">
                        <div className="border-b border-gray-200 p-4 dark:border-gray-800">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <input 
                                    type="text" 
                                    placeholder={`Search ${view} letters...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">
                            {filteredLetters.length > 0 ? (
                                <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                                    {filteredLetters.map(letter => {
                                        const { icon: Icon, badgeClass } = getTypeConfig(letter.type);
                                        const statusConfig = getStatusConfig(letter.status);
                                        const isUnread = !letter.read && view === 'received';
                                        
                                        return (
                                            <Link 
                                                href={`/letters/${letter.id}`}
                                                key={letter.id} 
                                                className={`group flex w-full items-center justify-between px-4 py-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gray-950 dark:hover:bg-gray-900/50 dark:focus-visible:ring-gray-300 ${isUnread ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''}`}
                                            >
                                                <div className="flex items-start space-x-4 overflow-hidden">
                                                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                                                        <Icon className="h-4 w-4" />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <div className="flex items-center space-x-2">
                                                            <span className={`truncate text-sm ${isUnread ? 'font-semibold text-gray-900 dark:text-gray-50' : 'font-medium text-gray-900 dark:text-gray-200'}`}>
                                                                {letter.subject}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1 flex items-center space-x-2">
                                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${badgeClass}`}>
                                                                {letter.type}
                                                            </span>
                                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-colors ${statusConfig.color}`}>
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                        <span className="mt-1.5 truncate text-xs text-gray-500 dark:text-gray-400">
                                                            {view === 'received' ? `From: ${letter.issuer}` : `To: ${letter.recipients.join(', ')}`}
                                                        </span>
                                                        <span className="mt-1 flex items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                                            <Mail className="mr-1.5 h-3 w-3" /> Validity: {letter.validity}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex shrink-0 flex-col items-end space-y-2">
                                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                        {new Date(letter.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <ArrowUpRight className="h-4 w-4 text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-gray-500" />
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center space-y-3 p-8 text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                                        <Mail className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">No letters found</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Your {view} box is currently empty.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}