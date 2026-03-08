import { Head, Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { ArrowLeft, Printer, ShieldAlert, Briefcase, AlertOctagon, FileSignature, CheckCircle, Clock, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Official Letters', href: '/letters' },
    { title: 'View Letter', href: '#' },
];

interface User {
    id: number;
    name: string;
}

interface Letter {
    id: number;
    type: string;
    subject: string;
    content: string;
    validity_type: string;
    validity_value: string | null;
    created_at: string;
    issuer: User;
    recipients: (User & { pivot: { read_at: string | null } })[];
}

interface Props {
    letterId: string | number;
    letterDetails: Letter;
}

export default function Show({ letterId, letterDetails }: Props) {
    const { auth } = usePage<any>().props;

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'Responsibility': return { icon: ShieldAlert, badgeClass: 'border-purple-200 bg-purple-100 text-purple-800 dark:border-purple-800/30 dark:bg-purple-900/30 dark:text-purple-300' };
            case 'Appointment': return { icon: Briefcase, badgeClass: 'border-emerald-200 bg-emerald-100 text-emerald-800 dark:border-emerald-800/30 dark:bg-emerald-900/30 dark:text-emerald-300' };
            case 'Warning': return { icon: AlertOctagon, badgeClass: 'border-red-200 bg-red-100 text-red-800 dark:border-red-800/30 dark:bg-red-900/30 dark:text-red-300' };
            default: return { icon: FileSignature, badgeClass: 'border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800/30 dark:bg-blue-900/30 dark:text-blue-300' };
        }
    };

    const { icon: TypeIcon, badgeClass } = getTypeConfig(letterDetails.type);

    // Format the validity string
    let validityStr = '';
    switch (letterDetails.validity_type) {
        case 'ongoing': validityStr = 'Until Revoked'; break;
        case 'tomorrow': validityStr = 'Tomorrow Only'; break;
        case 'tour': validityStr = `Tied to Tour: ${letterDetails.validity_value || 'Active'}`; break;
        case 'custom': validityStr = `Until ${new Date(letterDetails.validity_value as string).toLocaleDateString()}`; break;
        default: validityStr = letterDetails.validity_type;
    }

    // Role checks
    const isSender = letterDetails.issuer.id === auth.user.id;
    const isRecipient = letterDetails.recipients.some(r => r.id === auth.user.id);
    
    // Recipient acknowledgment status
    const myRecord = letterDetails.recipients.find(r => r.id === auth.user.id);
    const isAcknowledged = myRecord ? !!myRecord.pivot?.read_at : false;

    const handleAcknowledge = () => {
        router.post(`/letters/${letterId}/acknowledge`, {}, { 
            preserveScroll: true 
        });
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Letter: ${letterDetails.subject}`} />
            <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col space-y-6 p-4 md:p-8">
                
                <div className="flex items-center justify-between">
                    <Link 
                        href="/letters" 
                        className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> 
                        Back to Inbox
                    </Link>
                    <button 
                        onClick={handlePrint}
                        className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                    >
                        <Printer className="mr-2 h-4 w-4" /> 
                        Print
                    </button>
                </div>

                <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm print:shadow-none print:border-none dark:border-gray-800 dark:bg-gray-950">
                    
                    {/* Header Section */}
                    <div className="flex flex-col space-y-4 border-b border-gray-200 p-6 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 sm:p-8 dark:border-gray-800">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 print:hidden dark:border-gray-800 dark:bg-gray-900">
                                <TypeIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">{letterDetails.type} Notice</h2>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ref ID: CF-LTR-{new Date(letterDetails.created_at).getFullYear()}-{letterDetails.id.toString().padStart(4, '0')}</p>
                            </div>
                        </div>
                        <div className="flex flex-col text-left sm:text-right">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Issued Date</span>
                            <span className="font-semibold text-gray-900 dark:text-gray-50">
                                {new Date(letterDetails.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    {/* Metadata Section */}
                    <div className="grid grid-cols-1 gap-6 border-b border-gray-200 bg-gray-50/50 p-6 print:bg-transparent sm:grid-cols-2 sm:p-8 dark:border-gray-800 dark:bg-gray-900/20">
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Issued To</span>
                            <p className="font-medium text-gray-900 dark:text-gray-100">{letterDetails.recipients.map(r => r.name).join(', ')}</p>
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Authorized By</span>
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-gray-100">{letterDetails.issuer.name}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">Authorized Personnel</span>
                            </div>
                        </div>
                        <div className="space-y-1.5 sm:col-span-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Validity Period</span>
                            <div className="flex items-center">
                                <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-800/30 dark:bg-amber-900/30 dark:text-amber-300">
                                    <Clock className="mr-1.5 h-3.5 w-3.5" /> 
                                    {validityStr}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Letter Body Section */}
                    <div className="p-6 sm:p-10">
                        <h1 className="mb-8 text-xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                            {letterDetails.subject}
                        </h1>
                        <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                            {letterDetails.content.split('\n').map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                        </div>
                        
                        <div className="mt-16 w-64 space-y-1 border-t border-dashed border-gray-300 pt-4 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-gray-100">{letterDetails.issuer.name}</p>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Digital Signature Validated</p>
                        </div>
                    </div>

                    {/* ACTION PANEL: Visible only to Recipients */}
                    {isRecipient && !isSender && (
                        <div className="border-t border-gray-200 bg-gray-50/50 p-6 print:hidden sm:px-10 dark:border-gray-800 dark:bg-gray-900/20">
                            {isAcknowledged ? (
                                <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                    <CheckCircle className="mr-2 h-5 w-5" /> 
                                    You acknowledged this letter on {new Date(myRecord?.pivot?.read_at as string).toLocaleDateString()}.
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Please acknowledge receipt of this official document.</p>
                                    <button 
                                        onClick={handleAcknowledge}
                                        className="inline-flex h-9 w-full items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-6 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 sm:w-auto dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                                    >
                                        <CheckCircle className="mr-2 h-4 w-4" /> 
                                        Acknowledge Receipt
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* SENDER PANEL: Tracking & Acknowledgments (Visible only to the Issuer) */}
                    {isSender && (
                        <div className="border-t border-gray-200 bg-gray-50/50 p-6 print:hidden sm:px-10 dark:border-gray-800 dark:bg-gray-900/20">
                            <div className="mb-4 flex items-center text-sm font-semibold text-gray-900 dark:text-gray-50">
                                <Users className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                Recipient Acknowledgments ({letterDetails.recipients.filter(r => r.pivot.read_at).length}/{letterDetails.recipients.length})
                            </div>
                            
                            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {letterDetails.recipients.map(recipient => (
                                    <li 
                                        key={recipient.id} 
                                        className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                                    >
                                        <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100" title={recipient.name}>
                                            {recipient.name}
                                        </span>
                                        {recipient.pivot?.read_at ? (
                                            <span className="ml-3 flex shrink-0 items-center text-xs font-medium text-emerald-600 dark:text-emerald-500">
                                                <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
                                                {new Date(recipient.pivot.read_at).toLocaleDateString()}
                                            </span>
                                        ) : (
                                            <span className="ml-3 flex shrink-0 items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                                                <Clock className="mr-1.5 h-3.5 w-3.5" />
                                                Pending
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}