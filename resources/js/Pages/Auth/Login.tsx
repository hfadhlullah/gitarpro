import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-500">
                    {status}
                </div>
            )}

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-sm text-text-secondary">Log in to your account to continue strumming</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-text-primary" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-surface-elevated border-border text-text-primary focus:border-accent focus:ring-accent"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-red-500" />
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="password" value="Password" className="text-text-primary" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-surface-elevated border-border text-text-primary focus:border-accent focus:ring-accent"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-red-500" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            className="bg-background border-border text-accent focus:ring-accent"
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-text-secondary hover:text-white transition-colors">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-accent hover:text-accent-hover transition-colors focus:outline-none focus:underline"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="mt-8">
                    <button
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3 px-4 rounded-xl text-sm font-bold text-white bg-accent hover:bg-accent-hover shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_25px_rgba(255,77,0,0.5)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                    >
                        Log in
                    </button>

                    <div className="mt-6 text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link href={route('register')} className="font-semibold text-accent hover:text-accent-hover transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
