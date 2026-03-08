import { useState, useMemo } from 'react';
import { 
    Building2, 
    MapPin, 
    Plane, 
    Coffee, 
    Clock, 
    Search, 
    ArrowRightCircle, 
    LogOut
} from 'lucide-react';

type StatusCategory = 'All' | 'Office' | 'Transit' | 'Field' | 'Tour' | 'Away';

interface EmployeeStatus {
    id: number;
    name: string;
    department: string;
    category: StatusCategory;
    statusText: string; // Ultra-short status
}

// Dummy Data - Notice the highly condensed status text
const mockStatuses: EmployeeStatus[] = [
    { id: 1, name: 'Sarah Jenkins', department: 'News', category: 'Transit', statusText: 'Arriving (15m)' },
    { id: 2, name: 'Michael Chen', department: 'Video', category: 'Office', statusText: 'Office' },
    { id: 3, name: 'David Smith', department: 'News', category: 'Field', statusText: 'Mirpur Stadium' },
    { id: 4, name: 'Elena Rodriguez', department: 'Marketing', category: 'Tour', statusText: 'ICC World Cup' },
    { id: 5, name: 'James Wilson', department: 'Design', category: 'Transit', statusText: 'Leaving (10m)' },
    { id: 6, name: 'Anita Patel', department: 'Video', category: 'Field', statusText: 'BCB HQ' },
    { id: 7, name: 'Robert Fox', department: 'Dev', category: 'Away', statusText: 'Day Off' },
    { id: 8, name: 'Lisa Ray', department: 'HR', category: 'Away', statusText: 'Sick Leave' },
    { id: 9, name: 'Tom Hardy', department: 'News', category: 'Office', statusText: 'Office' },
];

export default function DailyStatusTracker() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<StatusCategory>('All');

    // Filter Logic
    const filteredEmployees = useMemo(() => {
        return mockStatuses.filter(emp => {
            const matchesTab = activeTab === 'All' || emp.category === activeTab;
            const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  emp.department.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [searchQuery, activeTab]);

    // Calculate dynamic counts
    const counts = mockStatuses.reduce((acc, emp) => {
        acc[emp.category] = (acc[emp.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    counts['All'] = mockStatuses.length;

    // Filter Grid Configuration
    const filterCards = [
        { id: 'All', label: 'Total', count: counts['All'], color: 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' },
        { id: 'Office', label: 'Office', count: counts['Office'] || 0, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
        { id: 'Transit', label: 'Transit', count: counts['Transit'] || 0, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' },
        { id: 'Field', label: 'Field', count: counts['Field'] || 0, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' },
        { id: 'Tour', label: 'Tour', count: counts['Tour'] || 0, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' },
        { id: 'Away', label: 'Away', count: counts['Away'] || 0, color: 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
    ] as const;

    // Icon & Color mapping for list items
    const getBadgeConfig = (category: StatusCategory, text: string) => {
        const isLeaving = text.toLowerCase().includes('leaving');
        switch (category) {
            case 'Office': return { icon: Building2, style: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20' };
            case 'Field': return { icon: MapPin, style: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20' };
            case 'Tour': return { icon: Plane, style: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20' };
            case 'Away': return { icon: Coffee, style: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800' };
            case 'Transit': return { 
                icon: isLeaving ? LogOut : ArrowRightCircle, 
                style: isLeaving ? 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20' : 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20'
            };
            default: return { icon: Clock, style: 'text-gray-600 bg-gray-50' };
        }
    };

    return (
        <div className="flex flex-col rounded-xl border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-sidebar">
            
            <div className="border-b border-sidebar-border/70 p-4 dark:border-sidebar-border">
                {/* Header & Search */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Live Tracker</h2>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Find employee..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-md border border-gray-200 bg-gray-50 py-1.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                {/* Interactive Metrics Grid (Replaces scrollable chips) */}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {filterCards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => setActiveTab(card.id)}
                            className={`flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-all ${
                                activeTab === card.id 
                                    ? `border-transparent shadow-sm ${card.color} ring-2 ring-current ring-offset-1 dark:ring-offset-gray-900` 
                                    : 'border-gray-100 bg-gray-50 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800'
                            }`}
                        >
                            <span className={`text-lg font-bold ${activeTab === card.id ? '' : 'text-gray-900 dark:text-gray-100'}`}>
                                {card.count}
                            </span>
                            <span className={`text-[10px] font-medium uppercase tracking-wider ${activeTab === card.id ? 'opacity-90' : 'text-gray-500 dark:text-gray-400'}`}>
                                {card.label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* List View */}
            <div className="flex-1 overflow-y-auto p-2" style={{ maxHeight: '400px' }}>
                {filteredEmployees.length > 0 ? (
                    <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredEmployees.map((emp) => {
                            const { icon: Icon, style } = getBadgeConfig(emp.category, emp.statusText);
                            
                            return (
                                <div key={emp.id} className="flex items-center justify-between rounded-md p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                            {emp.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="truncate">
                                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{emp.name}</p>
                                            <p className="truncate text-xs text-gray-400">{emp.department}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Ultra-Compact Status Badge */}
                                    <div className={`ml-2 flex shrink-0 items-center gap-1.5 rounded bg-opacity-20 px-2 py-1 text-xs font-semibold ${style}`}>
                                        <Icon size={12} />
                                        <span>{emp.statusText}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex h-32 flex-col items-center justify-center text-gray-400">
                        <Search className="mb-2 h-6 w-6 opacity-30" />
                        <p className="text-sm">No personnel found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}