import { Clock } from 'lucide-react';

export default function PeakOperationalHour() {
    const rosterData = [
        {
            department: 'News',
            color: 'bg-blue-500 dark:bg-blue-400',
            bgLight: 'bg-blue-50 dark:bg-blue-900/20',
            staff: [
                { name: 'Sarah J.', start: 6, end: 14 },
                { name: 'Mike T.', start: 10, end: 18 },
                { name: 'Anna K.', start: 14, end: 22 },
            ]
        },
        {
            department: 'Reporter',
            color: 'bg-green-500 dark:bg-green-400',
            bgLight: 'bg-green-50 dark:bg-green-900/20',
            staff: [
                { name: 'James W.', start: 8, end: 16 },
                { name: 'Elena R.', start: 12, end: 20 },
            ]
        },
        {
            department: 'Camera',
            color: 'bg-purple-500 dark:bg-purple-400',
            bgLight: 'bg-purple-50 dark:bg-purple-900/20',
            staff: [
                { name: 'David L.', start: 7, end: 15 },
                { name: 'Chris M.', start: 15, end: 23 },
                { name: 'Tom B.', start: 18, end: 24 }, 
            ]
        },
        {
            department: 'Graphics',
            color: 'bg-amber-500 dark:bg-amber-400',
            bgLight: 'bg-amber-50 dark:bg-amber-900/20',
            staff: [
                { name: 'Nina S.', start: 9, end: 17 },
                { name: 'Paul O.', start: 10, end: 18 },
            ]
        }
    ];

    const hours = Array.from({ length: 25 }, (_, i) => i);

    return (
        <div className="flex flex-col space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">Daily Shift Timeline</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Employee duty rosters grouped by department</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                    <Clock className="h-5 w-5" />
                </div>
            </div>

            <div className="relative w-full overflow-hidden pb-4">
                <div className="w-full">
                    <div className="ml-16 flex border-b border-gray-200 pb-2 sm:ml-28 dark:border-gray-800">
                        {hours.map((hour) => (
                            <div key={hour} className="relative flex-1 text-center">
                                <span className="absolute -left-2 -top-1 text-[10px] font-medium text-gray-500 sm:-left-3 dark:text-gray-400">
                                    <span className="block sm:hidden">{hour % 6 === 0 ? `${hour}h` : ''}</span>
                                    <span className="hidden sm:block">{hour % 2 === 0 ? `${hour.toString().padStart(2, '0')}h` : ''}</span>
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-2 flex flex-col space-y-4">
                        <div className="pointer-events-none absolute bottom-0 left-16 right-0 top-0 flex sm:left-28">
                            {hours.slice(0, 24).map((hour) => (
                                <div key={hour} className={`flex-1 border-l ${hour % 2 === 0 ? 'border-gray-100 dark:border-gray-800/50' : 'border-gray-50/30 dark:border-gray-900/20'}`} />
                            ))}
                            <div className="border-l border-gray-100 dark:border-gray-800/50" />
                        </div>

                        {rosterData.map((dept, deptIndex) => (
                            <div key={deptIndex} className="flex flex-col space-y-1.5">
                                <div className={`mb-1 inline-flex w-max items-center rounded-md px-2 py-0.5 ${dept.bgLight}`}>
                                    <div className={`mr-1.5 h-1.5 w-1.5 rounded-full ${dept.color}`} />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-700 sm:text-xs dark:text-gray-300">
                                        {dept.department}
                                    </span>
                                </div>

                                {dept.staff.map((employee, empIndex) => {
                                    const leftPercentage = (employee.start / 24) * 100;
                                    const widthPercentage = ((employee.end - employee.start) / 24) * 100;

                                    return (
                                        <div key={empIndex} className="group relative flex h-7 items-center rounded-md transition-colors hover:bg-gray-50 sm:h-8 dark:hover:bg-gray-900/50">
                                            <div className="w-16 shrink-0 truncate pr-2 text-[10px] font-medium text-gray-600 transition-colors group-hover:text-gray-900 sm:w-28 sm:text-xs dark:text-gray-400 dark:group-hover:text-gray-100">
                                                {employee.name}
                                            </div>
                                            
                                            <div className="relative h-full flex-1">
                                                <div 
                                                    className={`absolute top-1 h-5 rounded-md shadow-sm opacity-90 transition-opacity hover:opacity-100 sm:top-1.5 sm:h-5 ${dept.color}`}
                                                    style={{ 
                                                        left: `${leftPercentage}%`, 
                                                        width: `${widthPercentage}%` 
                                                    }}
                                                >
                                                    <div className="absolute -top-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-[10px] font-medium text-gray-50 opacity-0 shadow-sm transition-opacity group-hover:block group-hover:opacity-100 sm:-top-8 sm:text-xs dark:bg-gray-50 dark:text-gray-900">
                                                        {employee.start.toString().padStart(2, '0')}:00 - {employee.end.toString().padStart(2, '0')}:00
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}