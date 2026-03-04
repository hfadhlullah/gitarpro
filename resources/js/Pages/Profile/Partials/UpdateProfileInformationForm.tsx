import InputError from '@/Components/InputError';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1.5">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                    <InputError className="mt-1.5 text-red-400 text-sm" message={errors.name} />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-text-secondary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition"
                    />
                    <InputError className="mt-1.5 text-red-400 text-sm" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-border bg-surface-elevated px-4 py-3">
                        <p className="text-sm text-text-secondary">
                            Your email address is unverified.{' '}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="text-accent underline hover:text-accent/80 transition"
                            >
                                Re-send verification email
                            </Link>
                        </p>
                        {status === 'verification-link-sent' && (
                            <p className="mt-1.5 text-sm font-medium text-green-400">
                                Verification link sent to your email.
                            </p>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="rounded-lg bg-accent px-5 py-2 text-sm font-semibold text-white shadow-[0_0_12px_rgba(255,77,0,0.3)] transition hover:bg-accent-hover active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {processing ? 'Saving…' : 'Save Changes'}
                    </button>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-400">Saved.</p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
