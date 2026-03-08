import { PieChart, MapPin } from 'lucide-react';

export default function WorkforceDeploymentChart() {
    const deploymentData = [
        { label: 'Desk Shift/Office', value: 56, percentage: 45, colorClass: 'text-emerald-500 dark:text-emerald-400', bgClass: 'bg-emerald-500 dark:bg-emerald-400', dashArray: '45 55', dashOffset: 25 },
        { label: 'Field Assignments', value: 44, percentage: 35, colorClass: 'text-blue-500 dark:text-blue-400', bgClass: 'bg-blue-500 dark:bg-blue-400', dashArray: '35 65', dashOffset: -20 },
        { label: 'On Tour', value: 25, percentage: 20, colorClass: 'text-purple-500 dark:text-purple-400', bgClass: 'bg-purple-500 dark:bg-purple-400', dashArray: '20 80', dashOffset: -55 },
    ];

    const totalDeployed = deploymentData.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="flex w-full flex-col space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50">Workforce Deployment</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Real-time snapshot of active workforce</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
                    <PieChart className="h-5 w-5" />
                </div>
            </div>

            <div className="flex flex-col items-center justify-between gap-8 pt-2 sm:flex-row">
                <div className="relative flex h-48 w-48 shrink-0 items-center justify-center">
                    <svg viewBox="0 0 36 36" className="h-full w-full transform">
                        <circle
                            cx="18"
                            cy="18"
                            r="15.91549431"
                            fill="transparent"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="text-gray-100 dark:text-gray-800"
                        ></circle>

                        {deploymentData.map((data, index) => (
                            <circle
                                key={index}
                                cx="18"
                                cy="18"
                                r="15.91549431"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeDasharray={data.dashArray}
                                strokeDashoffset={data.dashOffset}
                                className={`transition-all duration-700 ease-in-out hover:stroke-[5px] ${data.colorClass}`}
                            ></circle>
                        ))}
                    </svg>

                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Deployed</span>
                        <span className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">{totalDeployed}</span>
                    </div>
                </div>

                <div className="flex w-full flex-col space-y-4 sm:w-auto sm:flex-1 sm:pl-4">
                    {deploymentData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <span className={`h-2.5 w-2.5 rounded-full ${data.bgClass}`}></span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{data.label}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">{data.value}</span>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{data.percentage}%</span>
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-900/20">
                        <div className="flex items-start space-x-2">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                                {deploymentData[1].value + deploymentData[2].value} personnel are currently deployed outside the office.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}