import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }: { className?: string }) {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-5">
                <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-text-primary mb-1.5">
                        Current Password
                    </label>
                    <input
                        id="current_password"
                        type="password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                    <InputError message={errors.current_password} className="mt-1.5 text-red-400 text-sm" />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
                        New Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                    <InputError message={errors.password} className="mt-1.5 text-red-400 text-sm" />
                </div>

                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-text-primary mb-1.5">
                        Confirm New Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5 text-red-400 text-sm" />
                </div>

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_0_12px_rgba(255,77,0,0.3)] transition hover:bg-accent-hover active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {processing ? 'Saving…' : 'Update Password'}
                    </button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-400">Password updated.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
