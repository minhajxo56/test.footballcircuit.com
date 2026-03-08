import { Head, useForm } from '@inertiajs/react';
import { ShieldAlert, KeyRound, Loader2 } from 'lucide-react';

export default function ForcePasswordChange() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/force-password-change');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-950">
            <Head title="Update Password Required" />
            
            <div className="w-full max-w-md space-y-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <ShieldAlert className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
                            Action Required
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            For security reasons, you must update your system-generated password before accessing the dashboard.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                            New Password
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-transparent py-2 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                required
                                autoFocus
                            />
                        </div>
                        {errors.password && <p className="text-[0.8rem] font-medium text-red-500">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-gray-900 dark:text-gray-100">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={e => setData('password_confirmation', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-gray-200 bg-transparent py-2 pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:border-gray-800 dark:focus-visible:ring-gray-300"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex h-10 w-full items-center justify-center whitespace-nowrap rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                    >
                        {processing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                        ) : (
                            'Update Password & Continue'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}