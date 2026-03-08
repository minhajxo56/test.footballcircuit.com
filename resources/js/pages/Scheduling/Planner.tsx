import { useState, useMemo, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Clock, MapPin, Plus, Trash2, X, Coffee, Search, Building2, Users, CheckCircle2, FileArchive, Send } from 'lucide-react';
import { ChevronStepper } from '@/components/ChevronStepper';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Scheduling', href: '/schedules' },
    { title: 'Master Planner', href: '/schedules' },
];

const formSteps = [
    { id: 1, title: 'Draft Plan' },
    { id: 2, title: 'Save as Draft' },
    { id: 3, title: 'Publish Schedule' },
];

type EmployeeType = 'office' | 'field';
type ViewHorizon = 1 | 3 | 7;

interface OfficeShift { start: string; end: string; }
interface FieldTask { time: string; location: string; task: string; }

type AssignmentData = 
    | { type: 'office'; shifts: OfficeShift[] }
    | { type: 'field'; tasks: FieldTask[] }
    | { type: 'off' }
    | { type: 'unassigned' };

interface Department {
    id: number;
    name: string;
}

interface TeamMember {
    id: number;
    name: string;
    role: string;
    type: EmployeeType;
    department_id: number | null;
}

interface PlannerProps {
    teamMembers: TeamMember[];
    departments: Department[];
    initialAssignments?: Record<string, AssignmentData>;
}

export default function Planner({ teamMembers = [], departments = [], initialAssignments = {} }: PlannerProps) {
    const [horizon, setHorizon] = useState<ViewHorizon>(1);
    const [assignments, setAssignments] = useState<Record<string, AssignmentData>>(initialAssignments);
    const [mobileActiveDate, setMobileActiveDate] = useState<string>('');
    const [activeCell, setActiveCell] = useState<{ userId: number; date: string; empName: string; empType: EmployeeType } | null>(null);
    const [draftData, setDraftData] = useState<AssignmentData>({ type: 'unassigned' });
    const [isSaving, setIsSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState<number | 'all'>('all');

    const generatedDates = useMemo(() => {
        const dates = [];
        const today = new Date();
        today.setDate(today.getDate() + 1);
        
        for (let i = 0; i < horizon; i++) {
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + i);
            dates.push({
                raw: nextDate.toISOString().split('T')[0],
                label: nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
                shortLabel: nextDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })
            });
        }
        return dates;
    }, [horizon]);

    useEffect(() => {
        if (generatedDates.length > 0 && (!mobileActiveDate || !generatedDates.find(d => d.raw === mobileActiveDate))) {
            setMobileActiveDate(generatedDates[0].raw);
        }
    }, [generatedDates, mobileActiveDate]);

    const filteredTeamMembers = useMemo(() => {
        return teamMembers.filter(emp => {
            const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesDepartment = selectedDepartment === 'all' || emp.department_id === selectedDepartment;
            return matchesSearch && matchesDepartment;
        });
    }, [teamMembers, searchQuery, selectedDepartment]);

    const openModal = (emp: TeamMember, date: string) => {
        const key = `${emp.id}-${date}`;
        const existing = assignments[key] || { type: 'unassigned' };
        
        if (existing.type === 'unassigned') {
            setDraftData(emp.type === 'office' 
                ? { type: 'office', shifts: [{ start: '09:00', end: '17:00' }] } 
                : { type: 'field', tasks: [{ time: '10:00', location: '', task: '' }] }
            );
        } else {
            setDraftData(JSON.parse(JSON.stringify(existing)));
        }
        setActiveCell({ userId: emp.id, date, empName: emp.name, empType: emp.type });
    };

    const saveCell = () => {
        if (!activeCell) return;
        setAssignments(prev => ({ ...prev, [`${activeCell.userId}-${activeCell.date}`]: draftData }));
        setActiveCell(null);
    };

    const handleStepClick = (targetStep: number) => {
        if (targetStep === currentStep) return;

        if (targetStep === 1) {
            setCurrentStep(1);
            return;
        }

        const actionType = targetStep === 2 ? 'draft' : 'send';
        
        setIsSaving(true);
        router.post('/schedules', { assignments: assignments as any, action_type: actionType }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setCurrentStep(targetStep);
                setIsSaving(false);
            },
            onError: () => setIsSaving(false)
        });
    };

    const renderContent = (data: AssignmentData | undefined, isMobile: boolean = false) => {
        if (!data || data.type === 'unassigned') {
            return <span className={`text-xs font-medium transition-colors ${isMobile ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 group-hover:text-gray-900 dark:text-gray-500 dark:group-hover:text-gray-100'}`}>+ Assign</span>;
        }
        if (data.type === 'off') {
            return (
                <div className="inline-flex items-center rounded-md border border-transparent bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-900 transition-colors dark:bg-gray-800 dark:text-gray-100">
                    <Coffee className="mr-1 h-3 w-3" /> Off
                </div>
            );
        }
        if (data.type === 'office') {
            return (
                <div className={`flex flex-col gap-1 ${isMobile ? 'items-end' : 'items-center'}`}>
                    {data.shifts.map((s, i) => (
                        <div key={i} className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-900 transition-colors dark:bg-blue-900/40 dark:text-blue-100">
                            <Clock className="mr-1 h-3 w-3" /> {s.start} - {s.end}
                        </div>
                    ))}
                </div>
            );
        }
        if (data.type === 'field') {
            return (
                <div className={`flex flex-col gap-1 ${isMobile ? 'items-end' : 'items-center'}`}>
                    <div className="inline-flex items-center rounded-md border border-transparent bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-900 transition-colors dark:bg-purple-900/40 dark:text-purple-100">
                        <MapPin className="mr-1 h-3 w-3" /> {data.tasks.length} Task{data.tasks.length !== 1 && 's'}
                    </div>
                    <span className="max-w-[120px] truncate text-[11px] font-medium text-gray-500 dark:text-gray-400">
                        {data.tasks[0]?.location || 'Pending location'}
                    </span>
                </div>
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Planner" />
            
            <div className="flex h-full flex-1 flex-col space-y-4 p-4 md:p-8">
                
                <div className="mb-6 flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">Master Planner</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage employee schedules and field deployments.</p>
                    </div>
                </div>

                <div className="mb-4">
                    <ChevronStepper 
                        steps={formSteps} 
                        currentStep={currentStep} 
                        onStepClick={handleStepClick}
                        disabled={isSaving}
                    />
                </div>

                {(currentStep === 1 || currentStep === 2) && (
                    <>
                        {currentStep === 2 && (
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                                    <FileArchive className="h-7 w-7 text-gray-600 dark:text-gray-300" />
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Schedule Draft Saved</h2>
                                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    The current assignments are saved as a draft. You can continue editing below or click <strong>Publish Schedule</strong> to notify the team.
                                </p>
                            </div>
                        )}

                        <div className="flex flex-col items-start justify-between space-y-4 md:flex-row md:items-center md:space-y-0">
                            <div className="flex w-full items-center justify-between md:w-auto md:justify-start md:space-x-4">
                                <div className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                    {([1, 3, 7] as ViewHorizon[]).map(h => (
                                        <button 
                                            key={h} 
                                            onClick={() => setHorizon(h)}
                                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300 ${horizon === h ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50' : 'hover:text-gray-900 dark:hover:text-gray-100'}`}
                                        >
                                            {h === 1 ? '1 Day' : `${h} Days`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 w-full md:w-auto">
                                <div className="relative flex-1 w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                                    <input 
                                        type="text" 
                                        placeholder="Search employee..." 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:bg-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300"
                                    />
                                </div>
                                
                                <div className="relative w-full sm:w-48 flex-shrink-0">
                                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none" />
                                    <select
                                        value={selectedDepartment}
                                        onChange={(e) => setSelectedDepartment(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                                        className="flex h-10 w-full appearance-none rounded-md border border-gray-200 bg-white pl-9 pr-8 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-100 dark:focus-visible:ring-gray-300"
                                    >
                                        <option value="all" className="dark:bg-gray-900">All Depts</option>
                                        {departments.map(dept => (
                                            <option key={dept.id} value={dept.id} className="dark:bg-gray-900">
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm lg:block dark:border-gray-800 dark:bg-gray-950">
                            <div className="overflow-x-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50">
                                        <tr>
                                            <th className="sticky left-0 z-10 w-64 bg-gray-50/50 p-4 text-left font-medium text-gray-500 backdrop-blur-sm dark:bg-gray-900/50 dark:text-gray-400">Employee</th>
                                            {generatedDates.map(day => (
                                                <th key={day.raw} className="min-w-[160px] border-l border-gray-200 p-4 text-center font-medium text-gray-500 dark:border-gray-800 dark:text-gray-400">{day.label}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {filteredTeamMembers.length === 0 ? (
                                            <tr>
                                                <td colSpan={generatedDates.length + 1} className="h-32 text-center text-gray-500 dark:text-gray-400">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Users className="h-8 w-8 mb-2 opacity-20" />
                                                        <p>No employees found matching the filters.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTeamMembers.map(emp => (
                                                <tr key={emp.id} className="border-b border-gray-200 transition-colors hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-800/50">
                                                    <td className="sticky left-0 z-10 bg-white p-4 backdrop-blur-sm dark:bg-gray-950">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900 dark:text-gray-100">{emp.name}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{emp.role}</span>
                                                        </div>
                                                    </td>
                                                    {generatedDates.map(day => {
                                                        const data = assignments[`${emp.id}-${day.raw}`];
                                                        const isOff = data?.type === 'off';
                                                        const isAssigned = data && data.type !== 'unassigned' && !isOff;
                                                        
                                                        return (
                                                            <td key={day.raw} className="border-l border-gray-200 p-2 align-top dark:border-gray-800">
                                                                <button 
                                                                    onClick={() => openModal(emp, day.raw)}
                                                                    className={`group flex h-full min-h-[72px] w-full flex-col items-center justify-center rounded-md border p-2 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-300 ${
                                                                        isOff ? 'border-transparent bg-gray-50 dark:bg-gray-900' :
                                                                        isAssigned ? 'border-transparent bg-gray-50/50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-800' :
                                                                        'border-dashed border-gray-200 bg-transparent hover:border-gray-300 hover:bg-gray-50 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:bg-gray-900'
                                                                    }`}
                                                                >
                                                                    {renderContent(data)}
                                                                </button>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex flex-col rounded-md border border-gray-200 bg-white shadow-sm lg:hidden dark:border-gray-800 dark:bg-gray-950">
                            <div className="flex overflow-x-auto border-b border-gray-200 p-2 scrollbar-hide dark:border-gray-800">
                                {generatedDates.map(day => (
                                    <button 
                                        key={day.raw}
                                        onClick={() => setMobileActiveDate(day.raw)}
                                        className={`flex shrink-0 flex-col items-center justify-center rounded-md px-5 py-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-gray-300 ${
                                            mobileActiveDate === day.raw 
                                                ? 'bg-gray-900 text-gray-50 shadow-sm dark:bg-gray-50 dark:text-gray-900' 
                                                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                                        }`}
                                    >
                                        <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">{day.label.split(',')[0]}</span>
                                        <span className="text-xl font-bold">{day.label.split(' ')[2]}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
                                {filteredTeamMembers.length === 0 ? (
                                    <div className="py-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
                                        <Users className="h-8 w-8 mb-2 opacity-20" />
                                        <p className="text-sm">No employees match your filters.</p>
                                    </div>
                                ) : (
                                    filteredTeamMembers.map(emp => {
                                        const data = assignments[`${emp.id}-${mobileActiveDate}`];
                                        const isAssigned = data && data.type !== 'unassigned';
                                        
                                        return (
                                            <button 
                                                key={emp.id}
                                                onClick={() => openModal(emp, mobileActiveDate)}
                                                className="flex items-center justify-between p-4 text-left transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-900 dark:hover:bg-gray-800/50 dark:focus-visible:ring-gray-300"
                                            >
                                                <div className="flex items-center space-x-4 overflow-hidden">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                                                        {emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{emp.name}</span>
                                                        <span className="truncate text-xs text-gray-500 dark:text-gray-400">{emp.role}</span>
                                                    </div>
                                                </div>
                                                <div className={`ml-4 shrink-0 rounded-md px-3 py-2 text-xs transition-colors ${!isAssigned && 'border border-dashed border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900'}`}>
                                                    {renderContent(data, true)}
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                )}

                {currentStep === 3 && (
                    <div className="w-full rounded-lg border border-transparent bg-white p-10 text-center mx-auto dark:bg-gray-950 mt-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 mb-6 shadow-sm">
                            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                            Schedule Published Successfully
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto mb-8">
                            The roster updates have been finalized and employees can now view their assigned shifts and field tasks.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-gray-100 dark:border-gray-800 pt-8 mt-8 max-w-xl mx-auto">
                            <div className="space-y-2">
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Horizon Planned</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {horizon} Day{horizon > 1 ? 's' : ''}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">System Status</p>
                                <p className="font-medium flex justify-center items-center text-blue-600 dark:text-blue-400">
                                    <Send className="w-4 h-4 mr-1.5" /> Published
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {activeCell && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
                        <div className="flex flex-col space-y-1.5 border-b border-gray-200 p-6 dark:border-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-semibold leading-none tracking-tight text-gray-900 dark:text-gray-100">{activeCell.empName}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {new Date(activeCell.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })}
                                    </p>
                                </div>
                                <button onClick={() => setActiveCell(null)} className="rounded-md opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:ring-offset-gray-950 dark:focus:ring-gray-300">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-6">
                            <div className="mb-6 flex space-x-2 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
                                <button onClick={() => setDraftData({ type: 'off' })} className={`inline-flex h-8 flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${draftData.type === 'off' ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}`}>
                                    Day Off
                                </button>
                                <button onClick={() => setDraftData(activeCell.empType === 'office' ? { type: 'office', shifts: [{start: '09:00', end: '17:00'}] } : { type: 'field', tasks: [{time: '10:00', location: '', task: ''}] })} className={`inline-flex h-8 flex-1 items-center justify-center whitespace-nowrap rounded-md px-3 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 ${draftData.type !== 'off' && draftData.type !== 'unassigned' ? 'bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'}`}>
                                    {activeCell.empType === 'office' ? 'Office Shift' : 'Field Task'}
                                </button>
                            </div>

                            {draftData.type === 'office' && (
                                <div className="space-y-4">
                                    <div className="flex flex-wrap gap-2">
                                        <button onClick={() => setDraftData({ type: 'office', shifts: [{start: '09:00', end: '17:00'}] })} className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300">09:00 - 17:00</button>
                                        <button onClick={() => setDraftData({ type: 'office', shifts: [{start: '14:00', end: '22:00'}] })} className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus:ring-gray-300">14:00 - 22:00</button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {draftData.shifts.map((shift, idx) => (
                                            <div key={idx} className="flex items-end gap-3 rounded-md border border-gray-200 p-4 dark:border-gray-800">
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">Start Time</label>
                                                    <input type="time" value={shift.start} onChange={(e) => { const newShifts = [...draftData.shifts]; newShifts[idx].start = e.target.value; setDraftData({ type: 'office', shifts: newShifts }); }} className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" />
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">End Time</label>
                                                    <input type="time" value={shift.end} onChange={(e) => { const newShifts = [...draftData.shifts]; newShifts[idx].end = e.target.value; setDraftData({ type: 'office', shifts: newShifts }); }} className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" />
                                                </div>
                                                {draftData.shifts.length > 1 && (
                                                    <button onClick={() => setDraftData({ type: 'office', shifts: draftData.shifts.filter((_, i) => i !== idx) })} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent bg-transparent text-red-600 transition-colors hover:bg-red-50 dark:text-red-500 dark:hover:bg-red-950/50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {draftData.shifts.length < 2 && (
                                        <button onClick={() => setDraftData({ type: 'office', shifts: [...draftData.shifts, {start: '12:00', end: '16:00'}] })} className="inline-flex h-9 w-full items-center justify-center rounded-md border border-dashed border-gray-200 bg-transparent px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300">
                                            <Plus className="mr-2 h-4 w-4" /> Add 2nd Shift
                                        </button>
                                    )}
                                </div>
                            )}

                            {draftData.type === 'field' && (
                                <div className="space-y-4">
                                    {draftData.tasks.map((task, idx) => (
                                        <div key={idx} className="relative space-y-4 rounded-md border border-gray-200 p-4 dark:border-gray-800">
                                            {draftData.tasks.length > 1 && (
                                                <button onClick={() => setDraftData({ type: 'field', tasks: draftData.tasks.filter((_, i) => i !== idx) })} className="absolute right-2 top-2 rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-500">
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                                <div className="space-y-2 sm:col-span-1">
                                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">Time</label>
                                                    <input type="time" value={task.time} onChange={(e) => { const newTasks = [...draftData.tasks]; newTasks[idx].time = e.target.value; setDraftData({ type: 'field', tasks: newTasks }); }} className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" />
                                                </div>
                                                <div className="space-y-2 sm:col-span-2">
                                                    <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">Location</label>
                                                    <input type="text" placeholder="e.g. Main Stadium" value={task.location} onChange={(e) => { const newTasks = [...draftData.tasks]; newTasks[idx].location = e.target.value; setDraftData({ type: 'field', tasks: newTasks }); }} className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">Task Details</label>
                                                <input type="text" placeholder="e.g. Pre-match interview coverage" value={task.task} onChange={(e) => { const newTasks = [...draftData.tasks]; newTasks[idx].task = e.target.value; setDraftData({ type: 'field', tasks: newTasks }); }} className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" />
                                            </div>
                                        </div>
                                    ))}
                                    {draftData.tasks.length < 4 && (
                                        <button onClick={() => setDraftData({ type: 'field', tasks: [...draftData.tasks, {time: '12:00', location: '', task: ''}] })} className="inline-flex h-9 w-full items-center justify-center rounded-md border border-dashed border-gray-200 bg-transparent px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900 dark:border-gray-800 dark:text-gray-50 dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300">
                                            <Plus className="mr-2 h-4 w-4" /> Add Another Location
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col-reverse border-t border-gray-200 p-6 sm:flex-row sm:justify-end sm:space-x-2 dark:border-gray-800">
                            <button onClick={() => { setAssignments(prev => { const next = {...prev}; delete next[`${activeCell.userId}-${activeCell.date}`]; return next; }); setActiveCell(null); }} className="mt-2 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-600 sm:mr-auto sm:mt-0 dark:text-red-500 dark:hover:bg-red-950/50">
                                Clear
                            </button>
                            <button onClick={() => setActiveCell(null)} className="mt-2 inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 sm:mt-0 dark:border-gray-800 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300">
                                Cancel
                            </button>
                            <button onClick={saveCell} className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}