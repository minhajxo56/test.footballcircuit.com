import { FileText, X, UploadCloud } from 'lucide-react';
import { useRef, useState } from 'react';

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
}

export default function ExpenseFields({ data, setData }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [amount, setAmount] = useState('');

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setAmount(val);
        const baseDetails = data.details.replace(/\n\n--- Budget: .*/, '');
        setData('details', val ? `${baseDetails}\n\n--- Budget: ${val}` : baseDetails);
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            // Note: Changed from 'attachment_path' to 'attachment' to match backend
            setData('attachment', e.target.files[0]);
        }
    };

    const clearFile = () => {
        setData('attachment', null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                    Amount Requested
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span>
                    <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                        className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent py-1 pl-7 pr-3 text-sm shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:placeholder:text-gray-400 dark:focus-visible:ring-gray-300" 
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-gray-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-100">
                    Receipt / Invoice
                </label>
                <div className="h-[72px] w-full">
                    {!data.attachment ? (
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/50 dark:hover:bg-gray-800/50"
                        >
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                                <UploadCloud className="h-4 w-4" />
                                <span className="text-sm font-medium">Upload File</span>
                            </div>
                            <span className="mt-1 text-xs text-gray-500">PDF, JPG up to 5MB</span>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-4 dark:border-gray-800 dark:bg-gray-900/50">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <FileText className="h-5 w-5 shrink-0 text-gray-500 dark:text-gray-400" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{data.attachment.name}</span>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{(data.attachment.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                onClick={clearFile}
                                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFile} 
                />
            </div>
        </div>
    );
}