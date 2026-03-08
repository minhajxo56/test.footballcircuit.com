import React from 'react';
import { Check, ArrowDown } from 'lucide-react';

export function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(' ');
}

export interface Step {
    id: number;
    title: string;
}

interface ChevronStepperProps {
    steps: Step[];
    currentStep: number;
    className?: string;
    onStepClick?: (stepId: number) => void;
    disabled?: boolean;
}

export function ChevronStepper({ steps, currentStep, className, onStepClick, disabled }: ChevronStepperProps) {
    return (
        <div className={cn("flex flex-col md:flex-row w-full gap-3 md:gap-0", className)}>
            {steps.map((step, index) => {
                const isCompleted = step.id < currentStep;
                const isCurrent = step.id === currentStep;
                const isPending = step.id > currentStep;
                const zIndex = 10 - index;

                return (
                    <React.Fragment key={step.id}>
                        <button
                            type="button"
                            onClick={() => !disabled && onStepClick?.(step.id)}
                            disabled={disabled}
                            className={cn(
                                "relative flex items-center justify-start md:justify-center py-3 px-4 md:px-8 text-sm font-medium transition-all md:flex-1 rounded-lg md:rounded-none focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300",
                                !disabled && "cursor-pointer hover:opacity-90",
                                disabled && "cursor-not-allowed opacity-70",
                                // Desktop Shapes
                                "md:[clip-path:polygon(0_0,calc(100%-1.2rem)_0,100%_50%,calc(100%-1.2rem)_100%,0_100%,1.2rem_50%)]",
                                index === 0 && "md:[clip-path:polygon(0_0,calc(100%-1.2rem)_0,100%_50%,calc(100%-1.2rem)_100%,0_100%)] md:rounded-l-lg",
                                index === steps.length - 1 && "md:[clip-path:polygon(0_0,100%_0,100%_100%,0_100%,1.2rem_50%)] md:rounded-r-lg",
                                index !== 0 && "md:-ml-5",
                                // State Colors
                                isCompleted && "bg-gray-900 text-gray-50 shadow-sm dark:bg-gray-50 dark:text-gray-900",
                                isCurrent && "bg-blue-600 text-white shadow-md md:ring-0 md:ring-offset-0 dark:bg-blue-500",
                                isPending && "bg-gray-100 text-gray-500 border border-gray-200 md:border-0 dark:bg-gray-800 dark:text-gray-400",
                            )}
                            style={{ zIndex }}
                        >
                            <div className="flex items-center gap-3 pl-0 md:pl-2">
                                <div
                                    className={cn(
                                        "flex h-6 w-6 items-center justify-center rounded-full border-2 text-[10px] font-bold",
                                        isCompleted ? "border-white bg-transparent text-white dark:border-gray-900 dark:text-gray-900" :
                                        isCurrent ? "border-white bg-white text-blue-600 dark:text-blue-500" :
                                        "border-gray-400 bg-transparent"
                                    )}
                                >
                                    {isCompleted ? <Check className="h-3 w-3" /> : step.id}
                                </div>
                                <span className="text-sm truncate">{step.title}</span>
                            </div>
                        </button>

                        {/* Mobile Connector */}
                        {index < steps.length - 1 && (
                            <div className="flex justify-center md:hidden -my-1.5 text-gray-400 z-0">
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}